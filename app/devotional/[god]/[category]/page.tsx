"use client";

import { notFound } from 'next/navigation';
import { GetPrayerContent } from '../../data';

interface DevotionalPageProps {
    params: { god: string; category: string };
}

export default function DevotionalPage({ params }: DevotionalPageProps) {
    const { god, category } = params;
    if (!god || !category) {
        notFound();
    }

    const prayer = GetPrayerContent(god, category);

    return (
        <div className="bg-canvas p-4 text-main">
            <h1 className='justify-center flex p-2'>{god.toLocaleUpperCase()}</h1>
            <h2 className='justify-center flex p-2'>{category.toLocaleUpperCase()}</h2>
            <p className="flex justify-center rounded bg-accent p-1 shadow-md">
                {prayer}
            </p>
        </div>
    )
}
