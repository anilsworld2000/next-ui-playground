import DashboardGrid from "./components/DashboardRegistry/DashboardGrid";
import { dashboardRegistry } from "./config/dashboardRegistry";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-2 pb-8 pt-6 sm:px-4">
      <div className="mb-8 max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
        <h1 className="text-3xl font-bold tracking-tight">Dashboards</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">A focused collection of tools and experiments, ready to open.</p>
      </div>
      <DashboardGrid dashboards={dashboardRegistry} />
    </main>
  );
}
