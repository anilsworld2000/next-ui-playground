export type DashboardRoute = {
    id: string;
    name: string;
    path: string;
    description: string;
};

export const dashboardRegistry: DashboardRoute[] = [
    {
        id: "_ui_playground",
        name: "UI Playground",
        path: "/playground",
        description: "A playground to visualize components",
    },
    {
        id: "_counter",
        name: "Counter",
        path: "/counter",
        description: "Counter for you",
    },
    {
        id: "_wallet",
        name: "Wallet",
        path: "/wallet",
        description: "A Wallet for you",
    },
    {
        id: "_devotional",
        name: "Devotional",
        path: "/devotional",
        description: "Let's pay devotional God",
    },
    {
        id: "_reading",
        name: "Reading",
        path: "/reading",
        description: "Read and print Markdown files",
    },
];

export function getDashboardTitle(pathname: string): string {
    const dashboard = dashboardRegistry.find(({ path }) => pathname === path || pathname.startsWith(`${path}/`));
    return dashboard?.name ?? "";
}