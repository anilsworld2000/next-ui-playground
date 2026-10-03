import { ReactNode } from 'react'
import DashboardLayout from '../components/Layouts/DashboardLayout'
import { devotionalNavigation } from './navigation';

export default function DevotionalLayout({ children }: { children: ReactNode }) {
    return (
        <DashboardLayout
            horizontalItems={devotionalNavigation.horizontalItems ?? []}
            verticalNavbarTitle={devotionalNavigation.title}
            verticalNavbarIcon={devotionalNavigation.icon}
            verticalGroups={devotionalNavigation.groups}
            userSectionPosition={devotionalNavigation.userSectionPosition}
        >
            {children}
        </DashboardLayout>
    )
}
