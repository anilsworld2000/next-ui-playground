import { ReactNode } from 'react'
import DashboardLayout from '../components/Layouts/DashboardLayout'
import { UserSectionPosition } from '../types'

export default function CounterLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <DashboardLayout
                horizontalItems={[]}
                verticalGroups={[]}
                verticalNavbarTitle=''
                userSectionPosition={UserSectionPosition.Undefined}
            >
                {children}
            </DashboardLayout>
        </>
    )
}
