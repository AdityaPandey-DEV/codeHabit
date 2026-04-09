import axios from 'axios';
import { SubmissionStatus, Difficulty } from '@prisma/client';

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

interface LeetCodeSubmissionResponse {
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
}

interface LeetCodeUserProfile {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    easyTotal: number;
    mediumTotal: number;
    hardTotal: number;
    acceptanceRate: number;
    ranking: number;
    contributionPoints: number;
    reputation: number;
}

interface SubmissionCalendarData {
    [timestamp: string]: number; // unix timestamp (seconds) -> submission count
}

export class LeetCodeFetcher {
    static async getRecentSubmissions(username: string, limit: number = 20): Promise<LeetCodeSubmissionResponse[]> {
        const query = `
      query getRecentSubmissions($username: String!, $limit: Int) {
        recentSubmissionList(username: $username, limit: $limit) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }
    `;

        try {
            const response = await axios.post(
                LEETCODE_API_ENDPOINT,
                {
                    query,
                    variables: { username, limit }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Referer': 'https://leetcode.com',
                    }
                }
            );

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            return response.data.data.recentSubmissionList;
        } catch (error: any) {
            console.error('Error fetching LeetCode data:', error.message);
            throw new Error('Failed to fetch LeetCode data');
        }
    }

    /**
     * Fetch user profile stats including total solved by difficulty
     */
    static async getUserProfile(username: string): Promise<LeetCodeUserProfile> {
        const query = `
      query getUserProfile($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

        try {
            const response = await axios.post(
                LEETCODE_API_ENDPOINT,
                {
                    query,
                    variables: { username }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Referer': 'https://leetcode.com',
                    }
                }
            );

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            const data = response.data.data;
            const matchedUser = data.matchedUser;
            const allQuestions = data.allQuestionsCount;
            const acStats = matchedUser.submitStatsGlobal.acSubmissionNum;

            const getCount = (arr: any[], diff: string) => {
                const found = arr.find((item: any) => item.difficulty === diff);
                return found ? found.count : 0;
            };

            return {
                totalSolved: getCount(acStats, 'All'),
                easySolved: getCount(acStats, 'Easy'),
                mediumSolved: getCount(acStats, 'Medium'),
                hardSolved: getCount(acStats, 'Hard'),
                easyTotal: getCount(allQuestions, 'Easy'),
                mediumTotal: getCount(allQuestions, 'Medium'),
                hardTotal: getCount(allQuestions, 'Hard'),
                acceptanceRate: 0, // Calculated client-side if needed
                ranking: matchedUser.profile?.ranking || 0,
                contributionPoints: 0,
                reputation: matchedUser.profile?.reputation || 0,
            };
        } catch (error: any) {
            console.error('Error fetching LeetCode profile:', error.message);
            throw new Error('Failed to fetch LeetCode profile');
        }
    }

    /**
     * Fetch the yearly submission calendar (for heatmap)
     * Returns a map of unix timestamps (start of day) to submission counts
     */
    static async getSubmissionCalendar(username: string): Promise<SubmissionCalendarData> {
        const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submissionCalendar
        }
      }
    `;

        try {
            const response = await axios.post(
                LEETCODE_API_ENDPOINT,
                {
                    query,
                    variables: { username }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Referer': 'https://leetcode.com',
                    }
                }
            );

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            const calendarStr = response.data.data.matchedUser.submissionCalendar;
            
            // submissionCalendar is a JSON string like {"1609459200": 3, "1609545600": 1, ...}
            const calendar: SubmissionCalendarData = JSON.parse(calendarStr || '{}');
            return calendar;
        } catch (error: any) {
            console.error('Error fetching submission calendar:', error.message);
            throw new Error('Failed to fetch submission calendar');
        }
    }

    // Helper to map status string to Enum
    static mapStatus(status: string): SubmissionStatus {
        switch (status) {
            case 'Accepted': return 'ACCEPTED';
            case 'Wrong Answer': return 'WRONG_ANSWER';
            case 'Time Limit Exceeded': return 'TLE';
            case 'Runtime Error': return 'RUNTIME_ERROR';
            case 'Compile Error': return 'COMPILE_ERROR';
            default: return 'OTHER';
        }
    }
}
