import { EcoPlayDashboard } from "@/features/Dashboard/EcoPlayDashboard";
export const user = {
    username: "Alex",
    level: 5,
    total_xp: 1250,
    streak: 7,
    leaderboard_position: 12,
    weekly_xp: 320
};
export const privateRoutes = [
    {
        path: '/dashboard',
        element: <EcoPlayDashboard user={user} />
    }
];