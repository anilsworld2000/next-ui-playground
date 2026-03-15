import WalletSectionLayout from "../WalletSectionLayout";
import { ReactNode } from "react";

export default function PreferencesLayout({ children }: { children: ReactNode }) {
    return (
        <WalletSectionLayout
            title="Preferences"
            subtitle="Customize your wallet settings"
        >
            {children}
        </WalletSectionLayout>
    );
}