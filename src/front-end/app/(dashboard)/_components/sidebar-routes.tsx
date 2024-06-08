"use client";

import {BarChart, Compass, Layout, List, UserRound} from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";
import Cookies from "js-cookie";
import {getUserRole} from "@/lib/utils";
import {useEffect, useState} from "react";

const raterRoutes = [
  {
    icon: Layout,
    label: "Projects",
    href: "/projects",
  },
];

const adminRoutes = [
  {
    icon: Layout,
    label: "Projects",
    href: "/projects",
  },
  {
    icon: UserRound,
    label: "Users",
    href: "/users"
  }
];

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    getUserRole(Cookies.get('token')).then(r => setIsAdmin(r === 'admin'))
  }, []);

  const routes = isAdmin ? adminRoutes : raterRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}