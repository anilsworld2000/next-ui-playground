"use client";
import Card from "@/app/components/Cards/Card";
import ProgressRing from "@/app/components/Charts/ProgressRing";
import { useTheme } from "@/app/hooks/ThemeContext";
import { Goal } from "@/app/types";
import cnClassNames, { GENERIC_LABELS, getFormatedCurrency, GOAL_LABELS, ICON_SIZES } from "@/app/utils";
import KeyValueDisplay from "@/app/components/KeyValueDisplay";
import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "@/app/components/Badges/StatusBadge";
import InlineActionButtons from "./InlineActionButtons";

type Props = {
    goal: Goal;
    onEdit: (goal: Goal) => void;
    onDelete: (id: string) => void;
};

export default function GoalCard({ goal, onEdit, onDelete }: Props) {
    const theme = useTheme();

    return (
        <Card onClick={() => onEdit(goal)} className={cnClassNames("cursor-pointer transition-shadow", theme.theme.bg, theme.theme.border, theme.theme.hoverBg)}>
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold">{goal.name}</h2>
                <StatusBadge status={goal.status}/>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-6 text-xs">
                <KeyValueDisplay label={GOAL_LABELS.monthlyInvestment} value={getFormatedCurrency(goal.monthlyInvestment)} inLine={false} />

                <div className="grid grid-cols-2">
                    <KeyValueDisplay label={GOAL_LABELS.achievedPercent} value={`${goal.achievedPercent}%`} inLine={false} />
                    <div className="flex justify-end items-center">
                        {/* Progress Bar */}
                        <ProgressRing
                            value={goal.achievedPercent / 100}
                            size={ICON_SIZES.xlg}
                            thickness={6}
                            color={theme.theme.textMain}
                        />
                    </div>
                </div>

                <KeyValueDisplay label={GOAL_LABELS.futureValue} value={getFormatedCurrency(goal.futureValue)} inLine={false} />

                <KeyValueDisplay label={GOAL_LABELS.currentValue} value={getFormatedCurrency(goal.currentValue)} inLine={false} />
            </div>

            <div className={cnClassNames("flex items-center")}>
                {InlineActionButtons(() => onEdit(goal), GENERIC_LABELS.edit, Pencil)}
                {InlineActionButtons(() => onDelete(goal.id), GENERIC_LABELS.delete, Trash2)}
            </div>
        </Card>
    );
}