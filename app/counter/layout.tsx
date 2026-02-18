import { ReactNode } from 'react'
import DashboardLayout from '../components/Layouts/DashboardLayout'

export default function CounterLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <DashboardLayout
                horizontalItems={[]}
                verticalGroups={[]}
                verticalNavbarTitle=''
            >
                {children}
            </DashboardLayout>
        </>
    )
}
