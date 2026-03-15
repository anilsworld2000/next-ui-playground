import WalletSectionLayout from "../WalletSectionLayout";
import { ReactNode } from "react";

export default function OverviewLayout({ children }: { children: ReactNode }) {
    return (
        <WalletSectionLayout
            title="Overview"
            subtitle="A quick snapshot of your wallet performance"
        >
            {children}
        </WalletSectionLayout>
    );
}