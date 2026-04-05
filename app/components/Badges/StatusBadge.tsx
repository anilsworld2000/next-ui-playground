import cnClassNames from "../../utils";
import { getGoalStatusColors } from "../../wallet/goals/utils";

type StatusBadgeProps = {
    status: string;
    cssClass?: string;
};

export default function StatusBadge({ status, cssClass }: StatusBadgeProps) {
    return (
        <span
            className={cnClassNames(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                getGoalStatusColors(status),
                cssClass
            )}
        >
            {status}
        </span>
    );
  }