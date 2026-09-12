import DashboardGrid from "./components/DashboardRegistry/DashboardGrid";
import { dashboardRegistry } from "./config/dashboardRegistry";

export default function Home() {
  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Dashboards</h1>
      <DashboardGrid dashboards={dashboardRegistry} />
    </main>
  );
}
