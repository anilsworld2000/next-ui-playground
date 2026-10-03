import { describe, expect, it } from "vitest";
import { buildGoalFromForm, getGoalStatusFromFundingRatio } from "./goalUtils";

describe("goal utils", () => {
    it("creates a goal with a derived status and updated totals from form data", () => {
        const goal = buildGoalFromForm({
            name: "Vacation Fund",
            riskProfile: "Moderate",
            startYear: 2024,
            targetYear: 2028,
            postGoalYears: 2,
            targetAmount: 500000,
            inflationRate: 5,
            initialInvestment: 450000,
            monthlyContribution: 15000,
            expectedReturnRate: 8,
        }, "goal-7");

        expect(goal.id).toBe("goal-7");
        expect(goal.name).toBe("Vacation Fund");
        expect(goal.tenure).toBe(4);
        expect(goal.status).toBe("On Track");
        expect(goal.achievedPercent).toBeGreaterThan(0);
        expect(goal.futureValue).toBeGreaterThan(goal.costToday);
    });

    it("classifies the funding ratio consistently", () => {
        expect(getGoalStatusFromFundingRatio(0.4)).toBe("Underfunded");
        expect(getGoalStatusFromFundingRatio(0.9)).toBe("On Track");
        expect(getGoalStatusFromFundingRatio(1.1)).toBe("Completed");
    });
});
