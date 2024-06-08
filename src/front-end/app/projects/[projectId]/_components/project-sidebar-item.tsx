"use client";

import { LucideIcon, Trash, Edit } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { getUserRole } from "@/lib/utils"; 
import React, {useEffect, useState } from 'react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  onDelete?: () => void;
  onEdit?: () => void;
  showDeleteIcon?: boolean;
};

export const ProjectSidebarItem = ({
  icon: Icon,
  label,
  href,
  onDelete,
  onEdit,
  showDeleteIcon = false
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  const isActive =
    (pathname === "/" && href === "/") ||
      pathname === href ||
      pathname?.startsWith(`${href}/`) ||
      pathname.endsWith(href);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole(Cookies.get('token'));
      setUserRole(role);
    };
  
    fetchUserRole();
  }, []);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      router.push(href)
  };

  return (
      <>
        <button
          onClick={onClick}
          type="button"
          className={cn(
            "flex justify-between items-center w-full gap-x-2 text-slate-500 text-sm font-[500] pl-6 py-4 transition-all hover:text-slate-600 hover:bg-slate-300/20",
            isActive && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
          )}
        >
          <div className="flex items-center gap-x-2">
            <Icon
              size={22}
              className={cn(
                "text-slate-500",
                isActive && "text-sky-700"
              )}
            />
            {label}
          </div>
          {userRole !== 'rater' && showDeleteIcon &&(
            <>
              <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents the navigation event
                onEdit();
              }}
              className="p-1 opacity-80 hover:opacity-100"
              >
                  <Edit size={18} className="text-blue-500 m-1" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents the navigation event
                  onDelete();
                }}
                className="p-1 opacity-80 hover:opacity-100"
                >
                    <Trash size={18} className="text-red-500 m-1" />
                </button>
            </>
          )}
        </button>
      </>
  );
};