type DevotionalData = {
    god: string,
    content: {
        strotram: string[];
        bhajan: string[];
        ashtakam: string[];
    };
};

const devotionalData: DevotionalData[] = [
    {
        god: 'ram',
        content: {
            strotram: ['Ram Strotram content goes here.'],
            bhajan: ['Ram Bhajan content goes here.'],
            ashtakam: ['Ram Ashtakam content goes here.']
        }
    },
    {
        god: 'shiv',
        content: {
            strotram: ['Shiv Strotram content goes here.'],
            bhajan: ['Shiv Bhajan content goes here.'],
            ashtakam: ['Shiv Ashtakam content goes here.']
        }
    },
    {
        god: 'mata',
        content: {
            strotram: ['Mata Strotram content goes here.'],
            bhajan: ['Mata Bhajan content goes here.'],
            ashtakam: ['Mata Ashtakam content goes here.']
        }
    },
    {
        god: 'vishnu',
        content: {
            strotram: ['Vishnu Strotram content goes here.'],
            bhajan: ['Vishnu Bhajan content goes here.'],
            ashtakam: ['Vishnu Ashtakam content goes here.']
        }
    },
    {
        god: 'ganesh',
        content: {
            strotram: ['Ganesh Strotram content goes here.'],
            bhajan: ['Ganesh Bhajan content goes here.'],
            ashtakam: ['Ganesh Ashtakam content goes here.']
        }
    },
    {
        god: 'hanuman',
        content: {
            strotram: ['Hanuman Strotram content goes here.'],
            bhajan: ['Hanuman Bhajan content goes here.'],
            ashtakam: ['Hanuman Ashtakam content goes here.']
        }
    },
    {
        god: 'lakshmi',
        content: {
            strotram: ['Lakshmi Strotram content goes here.'],
            bhajan: ['Lakshmi Bhajan content goes here.'],
            ashtakam: ['Lakshmi Ashtakam content goes here.']
        }
    },
    {
        god: 'saraswati',
        content: {
            strotram: ['Saraswati Strotram content goes here.'],
            bhajan: ['Saraswati Bhajan content goes here.'],
            ashtakam: ['Saraswati Ashtakam content goes here.']
        }
    }
];

export const godNames: string[] = devotionalData ? devotionalData.map((item) => item.god) : [];

export const categories: string[] = devotionalData && godNames.length > 0 ? Object.keys(devotionalData[0].content) : [];

export function GetPrayerContent(god: string, category: string): string {
    const godData = devotionalData.find((item) => item.god === god);
    if (!godData) {
        return `Content for ${god} not found.`;
    }
    const content = godData.content[category as keyof typeof godData.content];
    if (!content) {
        return `Content for ${category} not found for ${god}.`;
    }

    return content.join('\n\n');
}