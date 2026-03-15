import WalletSectionLayout from "../WalletSectionLayout";
import { ReactNode } from "react";

export default function MutualFundsLayout({ children }: { children: ReactNode }) {
    return (
        <WalletSectionLayout
            title="Mutual Funds"
            subtitle="Review your fund holdings and performance"
        >
            {children}
        </WalletSectionLayout>
    );
}