import {
  Home,
  Globe,
  PlayCircle,
  AlertTriangle,
  FileText,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import EyeIcon from '@/assets/icons/eye.svg?react';
export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Sites', icon: Globe, path: '/sites' },
    { label: 'Crawl Jobs', icon: PlayCircle, path: '/crawl-jobs' },
    { label: 'Issues', icon: AlertTriangle, path: '/issues' },
    { label: 'Reports', icon: FileText, path: '/reports' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="md:w-64 w-10 h-screen bg-white shadow-xl flex flex-col md:gap-0 gap-15">
      <div className="text-2xl hidden md:block m-4 font-bold mb-10 text-blue-600">
        CompliScan
      </div>
      <div className="text-2xl md:hidden block m-2 font-bold mt-5  text-blue-600">
        <EyeIcon />
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
