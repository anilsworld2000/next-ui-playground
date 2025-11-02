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
        <div className="pl-4">
          <h1 className="mb-2">Dashboards</h1>
            {routes.map(route => (
              <Link key={route.id} className="border p-2 rounded-2xl text-center w-2xl mr-2" title={route.name} href={route.path}>
                {route.name}
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
}