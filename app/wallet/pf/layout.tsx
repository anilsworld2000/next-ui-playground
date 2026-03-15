import WalletSectionLayout from "../WalletSectionLayout";
import { ReactNode } from "react";

export default function PFLayout({ children }: { children: ReactNode }) {
    return (
        <WalletSectionLayout
            title="PF"
            subtitle="Track your Provident Fund contributions"
        >
            {children}
        </WalletSectionLayout>
    );
}