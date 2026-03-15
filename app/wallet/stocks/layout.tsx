import WalletSectionLayout from "../WalletSectionLayout";
import { ReactNode } from "react";

export default function StocksLayout({ children }: { children: ReactNode }) {
    return (
        <WalletSectionLayout
            title="Stocks"
            subtitle="Track your stock portfolio performance"
        >
            {children}
        </WalletSectionLayout>
    );
}