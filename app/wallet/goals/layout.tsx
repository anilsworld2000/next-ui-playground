import WalletSectionLayout from "../WalletSectionLayout";
import { ReactNode } from "react";

export default function GoalsLayout({ children }: { children: ReactNode }) {
    return (
        <WalletSectionLayout
            title="Goals"
            subtitle="Manage your financial goals"
        >
            {children}
        </WalletSectionLayout>
    );
}