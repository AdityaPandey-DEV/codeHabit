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
