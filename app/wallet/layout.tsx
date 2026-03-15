import { ReactNode } from 'react'
import DashboardLayout from '../components/Layouts/DashboardLayout'
import { NavGroup, UserSectionPosition } from '@/app/types';
import { ChartCandlestick, Goal, Landmark, TicketSlash, TrendingUp, Wallet, WalletMinimal, HandCoins, PiggyBank } from 'lucide-react';

const iconSize: number = 18;
const navGroups: NavGroup[] = [
    {
        id: "wallet",
        title: "Wallet",
        items: [
            {
                id: "overview",
                name: "Overview",
                icon: <Wallet size={iconSize} />,
                href: '/wallet/overview'
            },
            {
                id: "goals",
                name: "Goals",
                icon: <Goal size={iconSize} />,
                href: '/wallet/goals'
            }
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
                href: '/wallet/stocks'
            },
            {
                id: "mutual-funds",
                name: "Mutual Funds",
                icon: <TicketSlash size={iconSize} />,
                href: '/wallet/mutual-funds'
            },
            {
                id: "banks",
                name: "Banks",
                icon: <Landmark size={iconSize} />,
                href: '/wallet/banks'
            },
            {
                id: "ppf",
                name: "PPF",
                icon: <HandCoins size={iconSize} />,
                href: '/wallet/ppf'
            },
            {
                id: "pf",
                name: "PF",
                icon: <PiggyBank size={iconSize} />,
                href: '/wallet/pf'
            }
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
                href: '/wallet/preferences'
            },
        ],
    },
];

export default function WalletLayout({ children }: { children: ReactNode }) {
    return (
        <DashboardLayout
            horizontalItems={[]}
            verticalNavbarTitle='Wallet'
            verticalNavbarIcon={<WalletMinimal className="text-white" size={24} />}
            verticalGroups={navGroups}
            userSectionPosition={UserSectionPosition.Undefined}
        >
            {children}
        </DashboardLayout>
    )
}
