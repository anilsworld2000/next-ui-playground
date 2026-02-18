import { ReactNode } from 'react'
import DashboardLayout from '../components/Layouts/DashboardLayout'
import { NavGroup } from '../types';
import { TrendingUp } from 'lucide-react';

//import { FaWallet, FaChartLine, FaCog } from "react-icons/fa";

const navGroups: NavGroup[] = [
    {
        id: "wallet",
        title: "Wallet",
        items: [
            {
                id: "overview",
                name: "Overview",
                icon: <TrendingUp size={18} />,
                href: '/overview'
            },
            {
                id: "transactions",
                name: "Transactions",
                icon: <TrendingUp size={18} />,
                href: '/transactions'
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
                icon: <TrendingUp size={18} />,
                href:'/wallet'
            },
        ],
    },
];

export default function WalletLayout({ children }: { children: ReactNode }) {

    return (
        <DashboardLayout
            horizontalItems={[]}
            verticalNavbarTitle='FinPulse'
            verticalNavbarIcon={<TrendingUp className="text-white" size={24} />}
            verticalGroups={navGroups}
        >
            {children}
        </DashboardLayout>
    )
}
