import React from "react";
import {
    ChartCandlestick,
    Goal,
    Landmark,
    TicketSlash,
    TrendingUp,
    Wallet,
    WalletMinimal,
    HandCoins,
    PiggyBank,
} from "lucide-react";
import type { DashboardNavigationConfig } from "@/app/types/navigation";
import { UserSectionPosition } from "@/app/types/navigation";
import { ICON_SIZES } from "@/app/utils";

const iconSize = ICON_SIZES.lg;

export const walletNavigation: DashboardNavigationConfig = {
    title: "Wallet",
    icon: <WalletMinimal className="text-white" size={ICON_SIZES.xlg} />,
    horizontalItems: [],
    groups: [
        {
            id: "wallet",
            title: "Wallet",
            items: [
                {
                    id: "overview",
                    name: "Overview",
                    icon: <Wallet size={iconSize} />,
                    href: "/wallet/overview",
                },
                {
                    id: "goals",
                    name: "Goals",
                    icon: <Goal size={iconSize} />,
                    href: "/wallet/goals",
                },
            ],
        },
        {
            id: "assets",
            title: "Assets",
            items: [
                {
                    id: "stocks",
                    name: "Stocks",
                    icon: <ChartCandlestick size={iconSize} />,
                    href: "/wallet/stocks",
                },
                {
                    id: "mutual-funds",
                    name: "Mutual Funds",
                    icon: <TicketSlash size={iconSize} />,
                    href: "/wallet/mutual-funds",
                },
                {
                    id: "banks",
                    name: "Banks",
                    icon: <Landmark size={iconSize} />,
                    href: "/wallet/banks",
                },
                {
                    id: "ppf",
                    name: "PPF",
                    icon: <HandCoins size={iconSize} />,
                    href: "/wallet/ppf",
                },
                {
                    id: "pf",
                    name: "PF",
                    icon: <PiggyBank size={iconSize} />,
                    href: "/wallet/pf",
                },
                {
                    id: "assetAllocation",
                    name: "Asset Allocation",
                    icon: <PiggyBank size={iconSize} />,
                    href: "/wallet/asset-allocation",
                },
            ],
        },
        {
            id: "settings",
            title: "Settings",
            items: [
                {
                    id: "preferences",
                    name: "Preferences",
                    icon: <TrendingUp size={iconSize} />,
                    href: "/wallet/preferences",
                },
            ],
        },
    ],
    userSectionPosition: UserSectionPosition.Undefined,
};
