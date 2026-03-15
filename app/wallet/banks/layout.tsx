import WalletSectionLayout from "../WalletSectionLayout";
import { ReactNode } from "react";

export default function BankLayout({ children }: { children: ReactNode }) {
    return (
        <WalletSectionLayout
            title="Banks"
            subtitle="Manage your linked bank accounts"
        >
            {children}
        </WalletSectionLayout>
    );
}