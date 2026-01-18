"use client";
import Link from "next/link";
import { useState } from "react";
import { useSelectedDashboard } from "./hooks/SelectedDashboardContext";
import cnClassNames from "./utils";
import { useTheme } from "./hooks/ThemeContext";

type Route = {
  id: string;
  name: string;
  path: string;
  description: string;
};

export default function Home() {
  const { selectDashboard } = useSelectedDashboard();
  selectDashboard("");

  const routesList: Route[] = [
    {
      id: "_ui_playground",
      name: "UI Playground",
      path: "/playground",
      description: "A playground to visualize components",
    },
    {
      id: "_counter",
      name: "Counter",
      path: "/counter",
      description: "Counter for you",
    },
    {
      id: "_wallet",
      name: "Wallet",
      path: "/wallet",
      description: "A Wallet for you",
    },
  ];

  return (
    <main className="">
      <h1 className="text-2xl font-bold mb-4">Dashboards</h1>

      <div className={cnClassNames("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8")}>
        {routesList.map((dash) => (
          <DashboardPreview key={dash.id} dash={dash} />
        ))}
      </div>
    </main>
  );
}

function DashboardPreview({ dash }: { dash: Route }) {
  const [loaded, setLoaded] = useState(false);
  const theme = useTheme();
  return (
    <Link
      aria-label={`Navigate to ${dash.name}`}
      href={dash.path}
      className={cnClassNames(theme.theme.card, theme.theme.border, theme.theme.hover, "group rounded-2xl shadow-md border overflow-hidden hover:shadow-lg transition")}
    >
      {/* 👇 Preview (mini live dashboard) */}
      <div className="relative h-48 overflow-hidden">
        {/* Shimmer placeholder until iframe loads */}
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
        )}

        <iframe
          loading="lazy"
          src={dash.path}
          className={`w-full h-full scale-[1] overflow-hidden pointer-events-none transform ${loaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-500`}
          title={dash.name}
          onLoad={() => setLoaded(true)}
        />

        {/* Overlay for hover effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* 👇 Info */}
      <div className="p-4" role="region" aria-labelledby={`dash-${dash.id}`} >
        <h3 className="text-lg font-semibold">{dash.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{dash.description}</p>
      </div>
    </Link>
  );
}
