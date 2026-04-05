// /components/goals/GoalDetailsDrawer.tsx

import { Goal } from "@/app/types";
import ProgressRing from "@/app/components/Charts/ProgressRing";
import BarChart from "@/app/components/Charts/BarChart";

type Props = {
    goal: Goal | null;
    onClose: () => void;
};

export default function GoalDetailsDrawer({ goal, onClose }: Props) {
    if (!goal) return null;

    return (
        <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-lg p-5">
            <button onClick={onClose} className="mb-4 text-sm">Close</button>

            <h2 className="text-xl font-semibold mb-4">{goal.name}</h2>

            <div className="flex justify-center mb-4">
                <ProgressRing value={goal.fundingRatio} size={0} thickness={0} color={""} />
            </div>

            <BarChart
                invested={goal.currentValue}
                required={goal.futureValue}
            />

            <div className="mt-4 text-sm space-y-2">
                <p>Monthly SIP: ₹{goal.monthlyInvestment}</p>
                <p>Future Value: ₹{goal.futureValue}</p>
                <p>Current Value: ₹{goal.currentValue}</p>
            </div>
        </div>
    );
}