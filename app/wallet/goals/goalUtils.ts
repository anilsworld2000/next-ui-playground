import type { GoalCreateFormData } from "./GoalCreateForm";
import type { Goal } from "./types";

export function getGoalStatusFromFundingRatio(fundingRatio: number): Goal["status"] {
    if (fundingRatio >= 1) {
        return "Completed";
    }

    if (fundingRatio >= 0.9) {
        return "On Track";
    }

    return "Underfunded";
}

export function goalToFormData(goal: Goal): GoalCreateFormData {
    return {
        name: goal.name,
        riskProfile: "Moderate",
        startYear: goal.startYear,
        targetYear: goal.endYear,
        postGoalYears: 0,
        targetAmount: goal.costToday,
        inflationRate: goal.inflation,
        initialInvestment: goal.invested,
        monthlyContribution: goal.monthlyInvestment,
        expectedReturnRate: goal.expectedReturn,
    };
}

export function buildGoalFromForm(
    formData: GoalCreateFormData,
    id?: string,
    existingGoal?: Partial<Goal>,
): Goal {
    const targetAmount = Number(formData.targetAmount) || 0;
    const initialInvestment = Number(formData.initialInvestment) || 0;
    const inflationRate = Number(formData.inflationRate) || 0;
    const expectedReturnRate = Number(formData.expectedReturnRate) || 0;
    const startYear = Number(formData.startYear) || new Date().getFullYear();
    const targetYear = Number(formData.targetYear) || startYear + 1;
    const tenure = Math.max(targetYear - startYear, 1);
    const futureValue = targetAmount * Math.pow(1 + inflationRate / 100, tenure);
    const achievedPercent = targetAmount > 0 ? Math.min(Math.round((initialInvestment / targetAmount) * 100), 100) : 0;
    const fundingRatio = targetAmount > 0 ? initialInvestment / targetAmount : 0;

    return {
        id: id ?? existingGoal?.id ?? `${Date.now()}`,
        name: formData.name.trim() || existingGoal?.name || "New Goal",
        startYear,
        endYear: targetYear,
        tenure,
        inflation: inflationRate,
        monthlyInvestment: Number(formData.monthlyContribution) || 0,
        stepUp: existingGoal?.stepUp ?? 0,
        expectedReturn: expectedReturnRate,
        costToday: targetAmount,
        futureValue: Math.round(futureValue),
        invested: initialInvestment,
        currentValue: initialInvestment,
        achievedPercent,
        fundingRatio,
        status: getGoalStatusFromFundingRatio(fundingRatio),
    };
}
