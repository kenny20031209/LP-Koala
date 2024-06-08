
import { NavbarRoutes } from "@/app/(dashboard)/_components/navbar-routes";

import { ProjectMobileSidebar } from "./project-mobile-sidebar";
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"



export const ProjectNavbar = ({projectId}:{projectId:string}) => {
    console.log(projectId, 'navbar')
  return (
      <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
          <p className='text-center right-52 left-52 md:right-28 md:left-80 absolute text-3xl md:text-6xl text-sky-700 z-0'>DLASSP</p>
          <ProjectMobileSidebar projectId={projectId}
          />
      <Link href="/projects">
        <Button style={{ width: '100px', position: 'relative', zIndex: 1 }} className="mt-auto mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
        </Button>
      </Link>
      <NavbarRoutes />
  </div>
  )
}