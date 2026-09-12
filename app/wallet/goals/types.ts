export type Goal = {
    id: string;
    name: string;
    startYear: number;
    endYear: number;
    tenure: number;
    inflation: number;
    monthlyInvestment: number;
    stepUp: number;
    expectedReturn: number;
    costToday: number;
    futureValue: number;
    invested: number;
    currentValue: number;
    achievedPercent: number;
    fundingRatio: number;
    status: GoalStatus;
};

export type GoalStatus = "Underfunded" | "On Track" | "Off Track" | "Completed";
