"use client";
import Link from "next/link";

type route = {
  id: string;
  name: string;
  path: string;
};
export default function Home() {

  const routes: route[] = [
    {id: '_ui_playground', name: 'UI Playground', path: '/playground' },
    {id: '_counter', name: 'Counter', path: '/counter' },
  ];

  return (
    <div className="">
      <main className="rounded-2xl flex-1 overflow">
        <div className="p-4">
          <h1 className="mb-2">Dashboards</h1>

          <div className="grid grid-cols-2 gap-8 p-2">
            {routes.map(route => (
              <Link key={route.id} className="border rounded-md text-center grid-cols-2" title={route.name} href={route.path}>
                  {route.name}
                  {route.name}
              </Link>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}