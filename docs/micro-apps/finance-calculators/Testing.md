# Finance Calculators Testing

## Automated cases

- `formatCurrency` formats lakh/crore digit grouping as INR and rounds to whole rupees.
- Future Value validates required values, negative amounts, non-positive years, and rates outside -100% to 100%.
- Future Value composes the shared lump-sum, fixed SIP, and step-up SIP formulas and computes invested totals, including a fractional final step-up year.
- Step-up SIP reports zero annual return as a validation error before invoking the calculation function.
- SIP Planner validates target amount, duration, and rate inputs for fixed and step-up modes.
- SIP Planner composes the shared required fixed/step-up SIP formulas, displays the year-one and final-year contribution amounts, and exercises the equal-growth-factor limit branch.
- SIP Planner rejects zero annual return in step-up mode before invoking the formula while allowing zero return in fixed mode.
- Retirement Corpus validates required, nonnegative, and rate-boundary inputs, including the tax divisor boundary.
- Retirement Corpus calculates fixed-duration, perpetual SWR, and perpetual real-return figures with their distinct assumptions.
- Retirement Corpus warns on equal nominal return/inflation for positive drawdown while preserving independently valid perpetual results.
- Retirement Corpus grows current savings before calculating the shortfall and fixed/step-up monthly SIPs.
- Retirement Corpus handles zero shortfall, immediate retirement, unavailable perpetual rates, and zero-return step-up SIP without throwing.
- Retirement Corpus progress reports the uncapped achieved percentage while capping only the visual bar.
- SWP Simulator validates required values, nonnegative amounts, expected annual returns from 0% to 100%, withdrawal growth rates from -100% to 100%, and simulation durations resolving to whole months.
- SWP Simulator aggregates monthly schedule entries into full or partial yearly withdrawal totals and ending balances.
- SWP Simulator marks the yearly snapshot containing depletion and surfaces non-finite schedule results as an explicit error.
- SWP chart data retains the zero ending-balance point and marks whether a point is the depletion year.
- Retirement Corpus chart data includes available methods and omits unavailable methods while preserving their reasons.
- Monte Carlo retirement draws retry a zero Box-Muller input, floor returns at -95%, and preserve monthly growth/contribution/withdrawal ordering.
- Monte Carlo paths apply the one-time retirement haircut, replace the retirement-year chart mark with the post-tax balance, and retain zero balances after depletion.
- Percentile interpolation, input/iteration validation, success rate, balance percentiles, yearly fan-chart data, and median failed-path depletion year are covered deterministically.
- Zero-volatility Monte Carlo accumulation matches the step-up SIP formula and the lump-sum formula using the effective annual rate equivalent to twelve months of `annualReturn / 12`; repeated identical paths produce a binary success rate.
- At 18% volatility and 2,000 iterations, Monte Carlo tests check bounded success rate, ordered retirement percentiles, one fan-chart entry per year including year zero, and repeated-run success rates within five percentage points.
- Retirement Stress Test defaults to the Retirement Corpus assumptions, 18% volatility, and 2,000 paths; its prepared plan uses the existing-corpus projection, fixed-duration target, required step-up SIP, and inflation-adjusted year-one retirement expense.
- Retirement Stress Test validates annual whole-year durations, 0%-100% volatility, supported simulation-count options through 10,000, maximum horizon, and maximum year-path workload.
- Retirement Stress Test worker responses report success or explicit errors, and changing assumptions/unmounting terminates active work so stale results are not displayed.
- Retirement Stress Test result UI shows threshold-labeled success probability, p10/p25/p50/p75/p90 retirement corpus, yearly p10/median/p90 fan data, and median failed-path depletion timing.
- Build validation confirms all five routes resolve under the shared route layout.

## Manual cases

- Open `/finance-calculators` and verify all four cards navigate to their matching routes.
- Open Future Value and Retirement Corpus directly and verify their calculators render.
- Open SIP Planner directly and verify the fixed/step-up modes, live estimate, inline validation, and year-one/final-year summary.
- Open SWP Simulator directly and verify the live form, full-duration/depletion headline, and yearly table.
- Use the sidebar to switch between calculators from every route.
- Verify all links remain within the Finance Calculators route group and dashboard registration opens the landing page.
- Check the landing page, sidebar, and placeholders at narrow and wide viewport sizes and with each theme.
- When calculator forms display monetary values, verify they use `formatCurrency` and Indian digit grouping.
- Future Value: switch all three modes, verify only mode-specific fields appear, enter and edit decimal values, and confirm results update without a submit action.
- Future Value: blur empty fields, enter malformed values, negative amounts, years at or below zero, rates at -100%, 100%, and outside that range; verify errors appear beside the relevant input and no invalid result is shown.
- Future Value: verify a 0% annual return works for Lump Sum and Monthly SIP but is rejected for Step-up SIP; confirm percentage values are converted to decimal rates and all amounts use INR grouping.
- Future Value: verify the invested-total line for each mode and the prorated contribution amount for fractional Step-up SIP years.
- Future Value: navigate the mode controls with the keyboard and check narrow/wide layouts in each theme.
- SIP Planner: switch between fixed and step-up modes, enter decimal inputs, and confirm the estimate updates without a submit action.
- SIP Planner: verify year-one SIP matches the prominent required amount and the final-year SIP applies the annual step-up exponent.
- SIP Planner: check missing, malformed, negative, zero-duration, out-of-range, zero-return step-up, and equal-growth-factor inputs; confirm errors are associated with fields and no invalid result is shown.
- SIP Planner: navigate the mode control and fields with the keyboard and check narrow/wide layouts in each theme.
- Retirement Corpus: verify the sample defaults, multiplier/tax helper text, three methodology labels, fixed-duration visual priority, and INR whole-rupee formatting.
- Retirement Corpus: enter matching return/inflation with positive drawdown and verify the inline warning and unavailable target; change drawdown to zero and verify the fixed lump-sum target remains available.
- Retirement Corpus: test zero SWR, zero/negative real return, and verify only the affected perpetual comparison becomes unavailable.
- Retirement Corpus: increase current savings across and above the target; verify future growth affects SIP shortfall while the progress label uses current savings and the bar caps at 100%.
- Retirement Corpus: test zero years to retirement with positive and covered shortfalls, and zero nominal return with a positive shortfall.
- Retirement Corpus: navigate all fields by keyboard and check narrow/wide layouts in each theme.
- SWP Simulator: verify blank required fields, default 0% withdrawal growth, expected return boundaries at 0% and 100% (reject negative and over-100%), withdrawal-growth boundaries, negative amounts, malformed values, whole-month durations, and the 1,000-year cap.
- SWP Simulator: verify full-duration ending balance, yearly withdrawal totals, a final partial-year row, and depletion headline/year row at the correct month.
- SWP Simulator: verify all displayed amounts use Indian Rupee formatting, form errors are associated with labels, status updates are announced, and table remains usable at narrow/wide sizes and with keyboard navigation.
- SWP Simulator: verify the responsive ending-balance chart follows yearly rows, uses theme colors and INR axes/tooltips, and visibly reaches zero in the depletion year.
- Retirement Corpus: verify the responsive chart compares all three available methods, omits unavailable figures with reasons, and adapts to narrow/wide layouts and active theme.
- Retirement Stress Test: verify changing any assumption clears the displayed results, invalid input disables Run Simulation, worker errors can be retried, and the 500–10,000 simulation options respect the explicit workload limit.
- Retirement Stress Test: run the default simulation and verify the success-rate threshold caption, required-SIP basis, INR percentiles, p10–p90 fan band, median line, retirement marker, and failed-path depletion duration.
- Retirement Stress Test: verify the chart and percentile cards adapt to narrow/wide layouts and active themes, and all controls/results remain keyboard and screen-reader accessible.

Update this checklist as calculator interactions and calculation result views are implemented.