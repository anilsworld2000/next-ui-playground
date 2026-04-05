import { statusColors } from "@/app/types";

export function getGoalStatusColors(status: string) {
    switch (status) {
        case "Underfunded":
            return `${statusColors["Warning-bg"]} ${statusColors["Warning-text"]}`;
        case "On Track":
            return `${statusColors["Success-bg"]} ${statusColors["Success-text"]}`;
        case "Off Track":
            return `${statusColors["Error-bg"]} ${statusColors["Error-text"]}`;
        case "Completed":
            return `${statusColors["Completed-bg"]} ${statusColors["Completed-text"]}`;
    }
}