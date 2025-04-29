import React, { useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {  ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { adminData } from "./navigation/nav-data";
import UserItem from "./navigation/user-items";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-green-50/20">
      <div
        className={cn(
          "bg-white border-r border-border transition-all duration-300 ease-in-out flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex items-center p-4",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          <div
            className={cn(
              "flex items-center",
              collapsed ? "justify-center" : "gap-2"
            )}
          >
            {!collapsed && <span className="text-2xl text-main-green font-bold">Pinjamin</span>}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={collapsed ? "hidden" : ""}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <Separator />

        <nav
          className={cn(
            "flex-1 overflow-y-auto py-4",
            collapsed ? "px-2" : "px-3"
          )}
        >
          <ul className="space-y-2">
            {adminData.map((item) => (
              <li key={item.href}>
                <Button
                  variant={
                    location.pathname === item.href ? "secondary" : "ghost"
                  }
                  className={cn(
                    "w-full justify-start",
                    location.pathname === item.href &&
                      "bg-main-green text-white hover:bg-green-800 st",
                    collapsed ? "" : ""
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {!collapsed && <span className="ml-3">{item.title}</span>}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {collapsed && (
          <div className="p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mx-auto"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white border-b h-14 flex items-center px-6 justify-between shadow-sm">
          <h1 className="text-xl font-semibold">{title}</h1>
          <UserItem />
        </header>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
