import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

import { ProjectSidebar } from "./project-sidebar";



export const ProjectMobileSidebar = ({projectId}:{projectId:string}) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <ProjectSidebar projectId={projectId}
        />
      </SheetContent>
    </Sheet>
  )
}