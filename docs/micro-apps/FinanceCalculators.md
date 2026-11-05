# Finance Calculators

## Route

The Finance Calculators micro app is rooted at `/finance-calculators`. Its landing page links to Future Value, SIP Planner, Retirement Corpus, Retirement Stress Test, and SWP Simulator routes.

## Shell and formatting

The route group uses the shared `DashboardLayout` with a vertical calculator navigation group and shared `Card` links on the landing page. Monetary output must use the route-local `formatCurrency` helper for Indian Rupee formatting and lakh/crore digit grouping.

## Calculation ownership

Pure finance formulas are provided by [`lib/financeCalculations.ts`](../../lib/financeCalculations.ts). Future Value, SIP Planner, Retirement Corpus, Retirement Stress Test, and SWP Simulator are implemented.

The Future Value route supports Lump Sum, Monthly SIP, and Step-up SIP estimates. Inputs recalculate live, show field-level validation, and display future value and total invested using the local INR formatter.

The SIP Planner route solves for the required fixed or month-one step-up SIP needed to reach a target. It displays the year-one monthly amount and, for step-up SIP, the projected final-year monthly amount.

The SWP Simulator route models monthly withdrawals and shows annual snapshots, including a partial final year or depletion year when applicable.

The SWP Simulator includes a responsive yearly ending-balance line chart. Retirement Corpus includes a responsive comparison chart for available fixed-duration and perpetual estimates; unavailable methodologies are explained separately.

The Retirement Stress Test derives the required step-up SIP from the fixed-duration retirement target, then runs the Monte Carlo engine in a cancellable Web Worker on user request. It presents survival probability, a responsive percentile fan chart, retirement-date corpus percentiles, and median depletion timing for failed paths. Iteration counts are selectable up to 10,000; a combined year-path workload validation prevents oversized result arrays.

## Maintenance

Update this document when calculator routes, workflows, formatting, or calculation dependencies change.

See the [Finance Calculators documentation set](finance-calculators/README.md) for architecture, testing, and decision records.