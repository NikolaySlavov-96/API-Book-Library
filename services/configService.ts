import 'dotenv/config';

export const getGoalStatusIds = (): number[] => {
    const raw = process.env.GOAL_STATUS_IDS ?? '';
    return raw
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => Number.isFinite(n) && n > 0);
};
