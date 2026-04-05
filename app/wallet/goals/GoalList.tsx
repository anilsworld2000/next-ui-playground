import ProgressRing from "@/app/components/Charts/ProgressRing";
import { useTheme } from "@/app/hooks/ThemeContext";
import { Goal } from "@/app/types";
import cnClassNames, { GENERIC_LABELS, getFormatedCurrency } from "@/app/utils";
import StatusBadge from "@/app/components/Badges/StatusBadge"; // new component
import { Pencil, Trash2 } from "lucide-react";
import InlineActionButtons from "./InlineActionButtons";

type Props = {
    goal: Goal;
    onEdit: (goal: Goal) => void;
    onDelete: (id: string) => void;
};

export default function GoalsList({ goal, onEdit, onDelete }: Props) {
    const theme = useTheme();
    const tableRowCss = "px-3 py-2";

    return (
        <tr className={cnClassNames(theme.theme.bg, theme.theme.hoverBg, "cursor-pointer")}>
            <td className={tableRowCss}>{goal.name}</td>
            <td className={tableRowCss}>{getFormatedCurrency(goal.monthlyInvestment)}</td>
            <td className={tableRowCss}>{getFormatedCurrency(goal.currentValue)}</td>
            <td className={tableRowCss}>{getFormatedCurrency(goal.futureValue)}</td>
            <td className={tableRowCss}>
                <ProgressRing
                    value={goal.achievedPercent / 100}
                    size={35}
                    thickness={6}
                    color={theme.theme.textMain}
                />
            </td>
            <td className={tableRowCss}><StatusBadge status={goal.status}/></td>
            <td className={cnClassNames(tableRowCss, "flex items-center")}>
                {InlineActionButtons(() => onEdit(goal), GENERIC_LABELS.edit, Pencil)}
                {InlineActionButtons(() => onDelete(goal.id), GENERIC_LABELS.delete, Trash2)}
            </td>
        </tr>
    );
}
