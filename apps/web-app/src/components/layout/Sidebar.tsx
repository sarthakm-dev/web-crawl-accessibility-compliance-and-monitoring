import {
  Home,
  Globe,
  PlayCircle,
  AlertTriangle,
  FileText,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Sites", icon: Globe, path: "/sites" },
    { label: "Crawl Jobs", icon: PlayCircle, path: "/crawl-jobs" },
    { label: "Issues", icon: AlertTriangle, path: "/issues" },
    { label: "Reports", icon: FileText, path: "/reports" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <div className="md:w-64 w-10 h-screen bg-white shadow-xl flex flex-col md:gap-0 gap-15">
      <div className="text-2xl hidden md:block m-4 font-bold mb-10 text-blue-600">
        CompliScan
      </div >
      <div className="text-2xl md:hidden block m-2 font-bold mt-5  text-blue-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 5c-7.63 0-9.93 6.62-9.95 6.68-.07.21-.07.43 0 .63.02.07 2.32 6.68 9.95 6.68s9.93-6.62 9.95-6.68c.07-.21.07-.43 0-.63C21.93 11.61 19.63 5 12 5m0 12c-5.35 0-7.42-3.84-7.93-5 .5-1.16 2.58-5 7.93-5s7.42 3.85 7.93 5c-.5 1.16-2.58 5-7.93 5"></path>
          <path d="M13.5 12c-.83 0-1.5-.67-1.5-1.5 0-.6.36-1.12.87-1.35-.28-.09-.56-.15-.87-.15-1.64 0-3 1.36-3 3s1.36 3 3 3 3-1.36 3-3c0-.3-.06-.59-.15-.87-.24.51-.75.87-1.35.87"></path>
        </svg>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl transition',
                isActive
                  ? 'bg-linear-to-r from-blue-500 to-blue-700 text-white'
                  : 'hover:bg-gray-100 text-gray-600'
              )}
            >
              <Icon size={18} />
              <span className="text-sm hidden md:block font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}