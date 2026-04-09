import axios from 'axios';

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

export class LeetCodeFetcher {
    static async getRecentSubmissions(username: string) {
        const query = `
            query recentAcSubmissions($username: String!, $limit: Int!) {
                recentAcSubmissionList(username: $username, limit: $limit) {
                    id
                    title
                    titleSlug
                    timestamp
                }
            }
        `;
        const res = await axios.post(LEETCODE_GRAPHQL, {
            query,
            variables: { username, limit: 20 },
        });
        return res.data.data.recentAcSubmissionList;
    }

    static async getUserProfile(username: string) {
        const query = `
            query userProblemsSolved($username: String!) {
                allQuestionsCount {
                    difficulty
                    count
                }
                matchedUser(username: $username) {
                    submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }
                    profile {
                        ranking
                    }
                }
            }
        `;
        const res = await axios.post(LEETCODE_GRAPHQL, {
            query,
            variables: { username },
        });
        return res.data.data;
    }

    static async getSubmissionCalendar(username: string) {
        const query = `
            query userProfileCalendar($username: String!) {
                matchedUser(username: $username) {
                    submissionCalendar
                }
            }
        `;
        const res = await axios.post(LEETCODE_GRAPHQL, {
            query,
            variables: { username },
        });
        return res.data.data.matchedUser?.submissionCalendar;
    }
}
