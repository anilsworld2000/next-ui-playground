export interface FutureValueSIPParams {
    monthlyAmount: number;
    annualRate: number;
    years: number;
}

export interface FutureValueStepUpSIPParams {
    monthlyAmount: number;
    annualRate: number;
    stepUpRate: number;
    years: number;
}

export interface RequiredMonthlySIPParams {
    targetFV: number;
    annualRate: number;
    years: number;
}

export interface RequiredStepUpSIPParams {
    targetFV: number;
    annualRate: number;
    stepUpRate: number;
    years: number;
}

export interface RetirementCorpusFixedDurationParams {
    costBasisToday: number;
    multiplier: number;
    inflationRate: number;
    nominalReturn: number;
    yearsToGoal: number;
    drawdownYears: number;
    taxHaircut: number;
}

export interface SimulateSWPParams {
    initialCorpus: number;
    firstWithdrawal: number;
    annualReturn: number;
    withdrawalGrowthRate: number;
    totalYears: number;
    periodsPerYear?: number;
}

export interface SWPScheduleEntry {
    period: number;
    startingBalance: number;
    withdrawal: number;
    growth: number;
    endingBalance: number;
}

export interface SimulateSWPResult {
    schedule: SWPScheduleEntry[];
    depletedAtPeriod: number | null;
}

export interface MonteCarloParams {
    existingCorpus: number;
    monthlyAmount: number;
    stepUpRate: number;
    yearsToRetirement: number;
    drawdownYears: number;
    meanReturn: number;
    stdDevReturn: number;
    inflationRate: number;
    taxHaircut: number;
    firstYearAnnualWithdrawal: number;
}

export interface PathResult {
    yearlyBalances: number[];
    corpusAtRetirement: number;
    finalBalance: number;
    survived: boolean;
    depletedAtYear: number | null;
}

export interface MonteCarloPercentiles {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
}

export interface MonteCarloResult {
    iterations: number;
    successRate: number;
    corpusAtRetirementPercentiles: MonteCarloPercentiles;
    finalBalancePercentiles: MonteCarloPercentiles;
    fanChartData: Array<{ year: number; p10: number; p50: number; p90: number }>;
    medianDepletionYear: number | null;
}

const DEFAULT_MONTE_CARLO_ITERATIONS = 2000;

function assertFiniteNumber(name: string, value: number): void {
    if (!Number.isFinite(value)) {
        throw new RangeError(`${name} must be a finite number.`);
    }
}

function validateMonteCarloParams(params: MonteCarloParams): void {
    const finiteParams: Array<[string, number]> = [
        ["existingCorpus", params.existingCorpus],
        ["monthlyAmount", params.monthlyAmount],
        ["stepUpRate", params.stepUpRate],
        ["yearsToRetirement", params.yearsToRetirement],
        ["drawdownYears", params.drawdownYears],
        ["meanReturn", params.meanReturn],
        ["stdDevReturn", params.stdDevReturn],
        ["inflationRate", params.inflationRate],
        ["taxHaircut", params.taxHaircut],
        ["firstYearAnnualWithdrawal", params.firstYearAnnualWithdrawal],
    ];

    finiteParams.forEach(([name, value]) => assertFiniteNumber(name, value));

    if (params.existingCorpus < 0 || params.monthlyAmount < 0 || params.firstYearAnnualWithdrawal < 0) {
        throw new RangeError("Corpus, SIP, and withdrawal amounts must be non-negative.");
    }

    if (!Number.isInteger(params.yearsToRetirement) || params.yearsToRetirement < 0) {
        throw new RangeError("yearsToRetirement must be a non-negative integer.");
    }

    if (!Number.isInteger(params.drawdownYears) || params.drawdownYears < 0) {
        throw new RangeError("drawdownYears must be a non-negative integer.");
    }

    if (params.stepUpRate < -1) {
        throw new RangeError("stepUpRate must be at least -1.");
    }

    if (params.stdDevReturn < 0) {
        throw new RangeError("stdDevReturn must be non-negative.");
    }

    if (params.inflationRate <= -1) {
        throw new RangeError("inflationRate must be greater than -1.");
    }

    if (params.taxHaircut < 0 || params.taxHaircut >= 1) {
        throw new RangeError("taxHaircut must be between 0 (inclusive) and 1 (exclusive).");
    }
}

function assertFiniteBalance(balance: number): void {
    if (!Number.isFinite(balance)) {
        throw new RangeError("Monte Carlo calculation produced a non-finite balance.");
    }
}

/**
 * Grows a present lump sum at an annual rate for a fixed number of years.
 * Formula: present value multiplied by one plus the annual rate, raised to the number of years.
 */
export function futureValueLumpSum(pv: number, annualRate: number, years: number): number {
    return pv * Math.pow(1 + annualRate, years);
}

/**
 * Projects today's expense after annual inflation for a fixed number of years.
 * Formula: value today multiplied by one plus inflation, raised to the number of years.
 */
export function inflatedValue(valueToday: number, inflationRate: number, years: number): number {
    return futureValueLumpSum(valueToday, inflationRate, years);
}

/**
 * Converts a nominal annual return to its inflation-adjusted real return.
 * Formula: one plus nominal return divided by one plus inflation, minus one.
 */
export function realReturn(nominalRate: number, inflationRate: number): number {
    return (1 + nominalRate) / (1 + inflationRate) - 1;
}

/**
 * Projects the future value of a fixed monthly SIP with monthly compounding.
 * Formula: monthly amount multiplied by the monthly-compounded annuity factor, or by months at zero rate.
 */
export function futureValueSIP({ monthlyAmount, annualRate, years }: FutureValueSIPParams): number {
    const monthlyRate = annualRate / 12;
    const months = years * 12;

    if (annualRate === 0) {
        return monthlyAmount * months;
    }

    return monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
}

/**
 * Projects a monthly SIP that increases once per year and compounds monthly.
 * Formula: monthly amount times the annual deposit factor and the step-up geometric factor, with its equal-factor limit.
 */
export function futureValueStepUpSIP({
    monthlyAmount,
    annualRate,
    stepUpRate,
    years,
}: FutureValueStepUpSIPParams): number {
    if (annualRate === 0) {
        throw new Error("annualRate must not be zero for step-up SIP calculations.");
    }

    const monthlyRate = annualRate / 12;
    const annualGrowthFactor = Math.pow(1 + monthlyRate, 12);
    const annualDepositFactor = (annualGrowthFactor - 1) / monthlyRate;
    const stepUpFactor = 1 + stepUpRate;

    if (annualGrowthFactor === stepUpFactor) {
        return monthlyAmount * annualDepositFactor * years * Math.pow(annualGrowthFactor, years - 1);
    }

    return monthlyAmount
        * annualDepositFactor
        * (Math.pow(annualGrowthFactor, years) - Math.pow(stepUpFactor, years))
        / (annualGrowthFactor - stepUpFactor);
}

/**
 * Solves for the fixed monthly SIP needed to reach a target future value.
 * Formula: target future value times monthly rate divided by the monthly annuity accumulation factor, or target divided by months at zero rate.
 */
export function requiredMonthlySIP({ targetFV, annualRate, years }: RequiredMonthlySIPParams): number {
    const monthlyRate = annualRate / 12;
    const months = years * 12;

    if (annualRate === 0) {
        return targetFV / months;
    }

    return targetFV * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
}

/**
 * Solves for the initial monthly SIP needed with an annual contribution step-up.
 * Formula: target future value divided by the same annual deposit and step-up factors used by the forward calculation.
 */
export function requiredStepUpSIP({
    targetFV,
    annualRate,
    stepUpRate,
    years,
}: RequiredStepUpSIPParams): number {
    if (annualRate === 0) {
        throw new Error("annualRate must not be zero for step-up SIP calculations.");
    }

    const monthlyRate = annualRate / 12;
    const annualGrowthFactor = Math.pow(1 + monthlyRate, 12);
    const annualDepositFactor = (annualGrowthFactor - 1) / monthlyRate;
    const stepUpFactor = 1 + stepUpRate;

    if (annualGrowthFactor === stepUpFactor) {
        return targetFV / (annualDepositFactor * years * Math.pow(annualGrowthFactor, years - 1));
    }

    return targetFV / (
        annualDepositFactor
        * (Math.pow(annualGrowthFactor, years) - Math.pow(stepUpFactor, years))
        / (annualGrowthFactor - stepUpFactor)
    );
}

/**
 * Calculates the goal-date corpus for a lump sum or finite inflation-growing withdrawal period.
 * Formula: inflate the multiplied cost to the goal date, apply the finite growing-annuity factor when needed, then divide by one minus the tax haircut.
 */
export function retirementCorpusFixedDuration({
    costBasisToday,
    multiplier,
    inflationRate,
    nominalReturn,
    yearsToGoal,
    drawdownYears,
    taxHaircut,
}: RetirementCorpusFixedDurationParams): number {
    const costAtGoalStart = costBasisToday * multiplier;
    const expenseAtGoalDate = costAtGoalStart * Math.pow(1 + inflationRate, yearsToGoal);

    if (drawdownYears === 0) {
        return expenseAtGoalDate / (1 - taxHaircut);
    }

    const spread = nominalReturn - inflationRate;

    if (spread === 0) {
        throw new Error("return rate must differ from inflation rate.");
    }

    const growingAnnuityFactor = 1 - Math.pow(
        (1 + inflationRate) / (1 + nominalReturn),
        drawdownYears,
    );

    return (expenseAtGoalDate / spread) * growingAnnuityFactor / (1 - taxHaircut);
}

/**
 * Calculates perpetual corpus using a safe withdrawal rate.
 * Formula: annual expense at the goal date divided by the safe withdrawal rate.
 */
export function retirementCorpusPerpetualSWR(
    annualExpenseAtGoalDate: number,
    safeWithdrawalRate: number,
): number {
    return annualExpenseAtGoalDate / safeWithdrawalRate;
}

/**
 * Calculates perpetual corpus using the real return rate.
 * Formula: annual expense at the goal date divided by the real return rate.
 */
export function retirementCorpusPerpetualRealReturn(
    annualExpenseAtGoalDate: number,
    realRate: number,
): number {
    return annualExpenseAtGoalDate / realRate;
}

/**
 * Calculates the fraction of a required corpus already achieved.
 * Formula: current value divided by required corpus, returning zero when the requirement is zero.
 */
export function percentAchieved(currentValue: number, requiredCorpus: number): number {
    return requiredCorpus === 0 ? 0 : currentValue / requiredCorpus;
}

/**
 * Simulates periodic withdrawals and returns over a fixed duration or until depletion.
 * Formula: each period adds starting-balance growth, subtracts an annually stepped-up withdrawal, and clamps depleted balances to zero.
 */
export function simulateSWP({
    initialCorpus,
    firstWithdrawal,
    annualReturn,
    withdrawalGrowthRate,
    totalYears,
    periodsPerYear = 12,
}: SimulateSWPParams): SimulateSWPResult {
    const totalPeriods = totalYears * periodsPerYear;

    if (!Number.isInteger(periodsPerYear) || periodsPerYear <= 0) {
        throw new RangeError("periodsPerYear must be a positive integer.");
    }

    if (!Number.isInteger(totalPeriods) || totalPeriods < 0) {
        throw new RangeError("totalYears and periodsPerYear must produce a non-negative integer number of periods.");
    }

    const periodicRate = annualReturn / periodsPerYear;
    const schedule: SWPScheduleEntry[] = [];
    let startingBalance = initialCorpus;
    let depletedAtPeriod: number | null = null;

    for (let period = 1; period <= totalPeriods; period += 1) {
        const withdrawal = firstWithdrawal
            * Math.pow(1 + withdrawalGrowthRate, Math.floor((period - 1) / periodsPerYear));
        const growth = startingBalance * periodicRate;
        const calculatedEndingBalance = startingBalance + growth - withdrawal;
        const endingBalance = Math.max(calculatedEndingBalance, 0);

        schedule.push({ period, startingBalance, withdrawal, growth, endingBalance });

        if (calculatedEndingBalance <= 0) {
            depletedAtPeriod = period;
            break;
        }

        startingBalance = endingBalance;
    }

    return { schedule, depletedAtPeriod };
}

/**
 * Draws a normally distributed annual return with the Box-Muller transform.
 * Returns are floored at -95% so a single year cannot compound the balance below zero.
 */
export function gaussianRandom(mean: number, stdDev: number): number {
    assertFiniteNumber("mean", mean);
    assertFiniteNumber("stdDev", stdDev);

    if (stdDev < 0) {
        throw new RangeError("stdDev must be non-negative.");
    }

    let u1 = Math.random();
    const u2 = Math.random();

    while (u1 === 0) {
        u1 = Math.random();
    }

    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const result = Math.max(mean + z0 * stdDev, -0.95);
    assertFiniteNumber("generated return", result);
    return result;
}

/**
 * Simulates one randomized accumulation and retirement drawdown path.
 * Monthly growth uses annualReturn / 12 and occurs before each SIP or withdrawal.
 */
export function simulateRetirementPath(params: MonteCarloParams): PathResult {
    validateMonteCarloParams(params);

    let balance = params.existingCorpus;
    let currentSIP = params.monthlyAmount;
    const yearlyBalances = [balance];

    for (let year = 1; year <= params.yearsToRetirement; year += 1) {
        const annualReturn = gaussianRandom(params.meanReturn, params.stdDevReturn);
        const monthlyRate = annualReturn / 12;

        for (let month = 1; month <= 12; month += 1) {
            balance = balance * (1 + monthlyRate) + currentSIP;
            assertFiniteBalance(balance);
        }

        currentSIP *= 1 + params.stepUpRate;
        assertFiniteBalance(currentSIP);
        yearlyBalances.push(balance);
    }

    balance *= 1 - params.taxHaircut;
    assertFiniteBalance(balance);
    yearlyBalances[yearlyBalances.length - 1] = balance;
    const corpusAtRetirement = balance;

    let currentWithdrawal = params.firstYearAnnualWithdrawal;
    let depletedAtYear: number | null = null;

    for (let year = 1; year <= params.drawdownYears; year += 1) {
        const annualReturn = gaussianRandom(params.meanReturn, params.stdDevReturn);
        const monthlyRate = annualReturn / 12;
        const monthlyWithdrawal = currentWithdrawal / 12;

        for (let month = 1; month <= 12; month += 1) {
            balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
            if (balance < 0) {
                balance = 0;
            }
            assertFiniteBalance(balance);
        }

        if (balance <= 0 && depletedAtYear === null) {
            depletedAtYear = params.yearsToRetirement + year;
        }

        currentWithdrawal *= 1 + params.inflationRate;
        assertFiniteBalance(currentWithdrawal);
        yearlyBalances.push(balance);
    }

    return {
        yearlyBalances,
        corpusAtRetirement,
        finalBalance: balance,
        survived: depletedAtYear === null,
        depletedAtYear,
    };
}

/**
 * Finds a value by linear interpolation at percentile p in an ascending sorted array.
 */
export function percentile(sortedValues: number[], p: number): number {
    assertFiniteNumber("p", p);

    if (sortedValues.length === 0) {
        throw new RangeError("sortedValues must not be empty.");
    }

    if (p < 0 || p > 1) {
        throw new RangeError("p must be between 0 and 1.");
    }

    sortedValues.forEach((value, index) => {
        assertFiniteNumber(`sortedValues[${index}]`, value);
        if (index > 0 && value < sortedValues[index - 1]) {
            throw new RangeError("sortedValues must be sorted in ascending order.");
        }
    });

    const position = (sortedValues.length - 1) * p;
    const lowerIndex = Math.floor(position);
    const upperIndex = Math.ceil(position);
    const fraction = position - lowerIndex;

    return sortedValues[lowerIndex]
        + (sortedValues[upperIndex] - sortedValues[lowerIndex]) * fraction;
}

function calculatePercentiles(values: number[]): MonteCarloPercentiles {
    const sortedValues = [...values].sort((first, second) => first - second);

    return {
        p10: percentile(sortedValues, 0.1),
        p25: percentile(sortedValues, 0.25),
        p50: percentile(sortedValues, 0.5),
        p75: percentile(sortedValues, 0.75),
        p90: percentile(sortedValues, 0.9),
    };
}

/**
 * Runs multiple retirement paths and summarizes survival, balance percentiles, and yearly fan-chart ranges.
 */
export function runMonteCarlo(
    params: MonteCarloParams,
    iterations = DEFAULT_MONTE_CARLO_ITERATIONS,
): MonteCarloResult {
    validateMonteCarloParams(params);
    if (!Number.isInteger(iterations) || iterations <= 0) {
        throw new RangeError("iterations must be a positive integer.");
    }

    const paths = Array.from({ length: iterations }, () => simulateRetirementPath(params));
    const yearCount = paths[0].yearlyBalances.length;
    const retirementBalances = paths.map((path) => path.corpusAtRetirement);
    const finalBalances = paths.map((path) => path.finalBalance);
    const depletedYears = paths
        .flatMap((path) => (path.depletedAtYear === null ? [] : [path.depletedAtYear]))
        .sort((first, second) => first - second);
    const fanChartData = Array.from({ length: yearCount }, (_, yearIndex) => {
        const yearBalances = paths.map((path) => path.yearlyBalances[yearIndex])
            .sort((first, second) => first - second);

        return {
            year: yearIndex,
            p10: percentile(yearBalances, 0.1),
            p50: percentile(yearBalances, 0.5),
            p90: percentile(yearBalances, 0.9),
        };
    });

    return {
        iterations,
        successRate: paths.filter((path) => path.survived).length / iterations,
        corpusAtRetirementPercentiles: calculatePercentiles(retirementBalances),
        finalBalancePercentiles: calculatePercentiles(finalBalances),
        fanChartData,
        medianDepletionYear: depletedYears.length === 0 ? null : percentile(depletedYears, 0.5),
    };
}