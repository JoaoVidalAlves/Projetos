import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";

export function HRLayout() {
  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar />
      <main className="flex-1 min-w-0 px-6 sm:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
