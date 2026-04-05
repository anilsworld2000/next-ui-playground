import styles from './BarChart.module.css';

type Props = {
    invested: number;
    required: number;
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));
const toBucketClass = (pct: number) => `h${Math.round(clamp(pct) / 5) * 5}`; // 0, 5, 10 ... 100

export default function BarChart({ invested, required }: Props) {
    const max = Math.max(invested, required, 1);
    const investedPct = (invested / max) * 100;
    const requiredPct = (required / max) * 100;

    return (
        <div className="flex items-end gap-6 h-40">
            <div className="flex flex-col items-center">
                <div
                    className={`w-10 rounded ${styles.invested} ${styles[toBucketClass(investedPct)]}`}
                />
                <p className="text-xs mt-1">Invested</p>
            </div>

            <div className="flex flex-col items-center">
                <div
                    className={`w-10 rounded ${styles.required} ${styles[toBucketClass(requiredPct)]}`}
                />
                <p className="text-xs mt-1">Required</p>
            </div>
        </div>
    );
}