import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout() {
  return (
    <div className="h-screen flex overflow-hidden bg-linear-to-br from-blue-100 to-blue-300">
 
      <div className="md:w-64 w-auto bg-white shadow-md shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 bg-linear-to-br from-blue-50 via-blue-100 to-blue-200  overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}