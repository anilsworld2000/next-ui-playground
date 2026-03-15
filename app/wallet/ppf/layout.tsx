import WalletSectionLayout from "../WalletSectionLayout";
import { ReactNode } from "react";

export default function PPFLayout({ children }: { children: ReactNode }) {
    return (
        <WalletSectionLayout
            title="PPF"
            subtitle="Manage your Public Provident Fund investments"
        >
            {children}
        </WalletSectionLayout>
    );
}