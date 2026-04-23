import { ReactNode } from 'react'
import DashboardLayout from '../components/Layouts/DashboardLayout'
import { NavGroup, UserSectionPosition } from '@/app/types';
import { Clover } from 'lucide-react';
import { ICON_SIZES } from '../utils';
import { categories, godNames } from './data';

const iconSize: number = ICON_SIZES.lg;

function GenerateVerticalNavBarItems(): NavGroup[] {
   
    const navGroups: NavGroup[] = [];

    for (const god of godNames) {
        const navGroup: NavGroup = {
            id: god,
            title: god,
            items: []
        };
        for (const category of categories) {
            navGroup.items.push({
                id: category,
                name: category,
                icon: <Clover size={iconSize} />,
                href: `/devotional/${god}/${category}`,
            });

        }
        navGroups.push(navGroup);
    }

    return navGroups
}

export default function DevotionalLayout({ children }: { children: ReactNode }) {
    return (
        <DashboardLayout
            horizontalItems={[]}
            verticalNavbarTitle='Devotional'
            verticalNavbarIcon={<Clover className="text-white" size={ICON_SIZES.xlg} />}
            verticalGroups={GenerateVerticalNavBarItems()}
            userSectionPosition={UserSectionPosition.Undefined}
        >
            {children}
        </DashboardLayout>
    )
}
