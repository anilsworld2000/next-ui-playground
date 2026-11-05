# Finance Calculators Architecture

## Route and shell

`app/finance-calculators/page.tsx` is the landing page. Future Value, SIP Planner, Retirement Corpus, Retirement Stress Test, and SWP Simulator are implemented. The route layout composes the shared `DashboardLayout` with a local vertical navigation config.

## Calculation and formatting boundaries

The framework-free calculation module also exports Monte Carlo retirement path generation and aggregation.

Pure, framework-agnostic finance calculations are shared from `lib/financeCalculations.ts`. UI-specific INR display formatting is local to `app/finance-calculators/formatCurrency.ts`; it provides whole-rupee display and compact Indian-grouped axis ticks. Pages should format displayed amounts at the UI boundary rather than changing the numeric calculation results.

## Chart presentation

The SWP Simulator, Retirement Corpus, and Retirement Stress Test render client-side Recharts visualizations in responsive containers. Recharts is an added client dependency; chart rendering increases the client bundle for these routes. SWP line-chart points are derived from the route's yearly snapshots, preserving a zero ending balance when depleted. Retirement comparison chart data is mapped from available calculation figures; unavailable alternatives are omitted from bars and their reasons are displayed in text. The stress-test route runs `runMonteCarlo` in a route-local Web Worker to keep repeated stochastic paths off the main thread; it owns its form and result state locally, terminates a previous run when assumptions change, and terminates the worker on unmount. Axis and series colors use the app's semantic theme CSS variables so visualizations respond to theme changes.

## State and data ownership

Future Value owns its mode, input strings, touched state, validation, and deferred result calculation locally. SIP Planner owns its fixed/step-up mode, input strings, touched state, validation, and deferred reverse-SIP calculation locally. Retirement Corpus owns its assumptions and derived results locally, including finite/perpetual comparisons, projected current savings, and shortfall-based SIP estimates. Retirement Stress Test owns its retirement assumptions, volatility and iteration inputs, worker lifecycle, validation, and simulation result locally. SWP Simulator owns its input state, validation, monthly simulation result, and yearly snapshot aggregation locally. These routes have no persistence or server data dependencies. Other calculator state should remain local to its route unless workflows demonstrate a need to share it.

Update this document when route ownership, calculation dependencies, state boundaries, or persistence changes.