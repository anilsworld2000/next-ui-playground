import { redirect } from "next/navigation";
import { ReactNode } from "react";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import { getSessionUser, hasRole } from "../auth/session";
import { walletNavigation } from "./navigation";

export default async function WalletLayout({ children }: { children: ReactNode }) {
    const user = await getSessionUser();

    if (!user || !hasRole(user, "user")) {
        redirect("/login");
    }

    return (
        <DashboardLayout
            horizontalItems={walletNavigation.horizontalItems ?? []}
            verticalNavbarTitle={walletNavigation.title}
            verticalNavbarIcon={walletNavigation.icon}
            verticalGroups={walletNavigation.groups}
            userSectionPosition={walletNavigation.userSectionPosition}
        >
            {children}
        </DashboardLayout>
    );
}
