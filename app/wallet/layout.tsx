import { ReactNode } from 'react'
import DashboardLayout from '../components/Layouts/DashboardLayout'
import { NavGroup } from '../types';

//import { FaWallet, FaChartLine, FaCog } from "react-icons/fa";

const navGroups: NavGroup[] = [
    {
        id: "wallet",
        title: "Wallet",
        items: [
            {
                id: "overview",
                name: "Overview",
                href:'/wallet'
            },
            {
                id: "transactions",
                name: "Transactions",
                href:'/wallet'
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
                href:'/wallet'
            },
        ],
    },
];

export default function WalletLayout({ children }: { children: ReactNode }) {

    return (
        <DashboardLayout
            horizontalItems={[]}
            verticalGroups={navGroups}
        >
            {children}
        </DashboardLayout>
    )
}
