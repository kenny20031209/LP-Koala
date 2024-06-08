import { redirect } from "next/navigation";
import {ProjectNavbar} from "./_components/project-navbar";
import {ProjectSidebar} from "./_components/project-sidebar";


const ProjectLayout =  ({
                              children,
                              params
                            }: {
  children: React.ReactNode;
  params: { projectId: string };
  
}) => {
  return (
      <div className="h-full">
        <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
          <ProjectNavbar projectId={params.projectId}
          />
        </div>
        <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
          <ProjectSidebar projectId={params.projectId}
          />
        </div>
        <main className="md:pl-56 pt-[80px] h-full">
          {children}
        </main>
      </div>
  )
}

export default ProjectLayout;