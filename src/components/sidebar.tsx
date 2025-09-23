"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  LineChart,
  BarChart2,
  PieChart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define types for navigation items
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: LineChart,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart2,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  return <SidebarContent pathname={pathname} />;
};

const SidebarContent = ({ pathname }: { pathname: string }) => {
  return (
    <aside
      className="hidden border-r bg-muted/40 md:block w-64"
      aria-label="Sidebar Navigation"
    >
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <PieChart className="h-6 w-6" />
            <span className="text-lg">Analytics</span>
          </Link>
        </div>
        <nav className="flex-1 px-2 py-4" role="navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors",
                  "hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300",
                  isActive &&
                    "bg-blue-600 text-white dark:bg-blue-700 dark:text-white shadow"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

// Export the Sidebar component as default for dynamic imports
export default Sidebar;
