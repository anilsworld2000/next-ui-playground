"use client";

import { useTheme } from '@/app/hooks/ThemeContext';
import cnClassNames from '@/app/utils';
import { notFound } from 'next/navigation';
import { GetPrayerContent } from '../../data';

interface DevotionalPageProps {
    params: { god: string; category: string };
}

export default function DevotionalPage({ params }: DevotionalPageProps) {
    const { theme } = useTheme();
    const { god, category } = params;
    if (!god || !category) {
        notFound();
    }

    const prayer = GetPrayerContent(god, category);

    return (
        <div className={cnClassNames(theme.primaryText, theme.bg, 'p-4 justify-center')}>
            <h1 className='justify-center flex p-2'>{god.toLocaleUpperCase()}</h1>
            <h2 className='justify-center flex p-2'>{category.toLocaleUpperCase()}</h2>
            <p className={cnClassNames('justify-center flex p-1 shadow-md', theme.accent)}>
                {prayer}
            </p>
        </div>
    )
}
