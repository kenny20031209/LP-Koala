"use client";

import { usePathname } from "next/navigation";
import {LogOut} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import UserIcon from "./user-icon";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";


export const NavbarRoutes = () => {
  const pathname = usePathname();
  const [name, setName] = useState('')
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";
  const isTeacher = (userId?: string | null) => {
    return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
  }

  useEffect(() => {
    // getCurrentUser().then(r=>setUsername(r.user.name));
    const user = JSON.parse(Cookies.get('user')!);
    setName(user.name);
  }, []);

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          {/*<SearchInput />*/}
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isTeacher('userId') ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        ) : null}
        <p className='my-auto'> Hello, {name}</p>
        <UserIcon/>
      </div>
    </>
  )
}