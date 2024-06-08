"use client"
import Link from "next/link"
import { PlusCircle , Puzzle, MessageCircle } from "lucide-react"
import {Logo} from "./logo";
import {ProjectSidebarItem} from "@/app/projects/[projectId]/_components/project-sidebar-item";
import {useRouter} from "next/navigation";
import ConfirmModal from '@/components/confirm-modal';
import React, {useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { getUserRole } from "@/lib/utils"; 

interface Module {
  _id: string;
  title: string;
  open: string;
}

export const ProjectSidebar =  ({projectId}: {projectId:string}) => {

  const router = useRouter();
  // const [isActive, setIsActive] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [moduleIdToDelete, setModuleIdToDelete] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const requestDelete = (moduleId: string) => {
      setModuleIdToDelete(moduleId);
      setShowConfirmModal(true);
  };
  // const toggleActive = () => {
  //   setIsActive(!isActive);
  //   console.log("IsActive now:", !isActive);
  // };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = Cookies.get('token')!

        const response = await fetch(`https://lp-koala-backend-c0a69db0f618.herokuapp.com/projects/${projectId}`, {
                method: "GET",
                headers: {
                    "Authorization": token!
                }
            });
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        const {data: {data}} = await response.json();
        console.log(data.modules)
        setModules(data.modules);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
      fetchModules();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole(Cookies.get('token'));
      setUserRole(role);
    };
  
    fetchUserRole();
  }, []);

  const navigateToEditPage = (moduleId: string) => {
    router.push(`/projects/${projectId}/modules/${moduleId}/edit`);
  };

  const handleDelete = async (id: string) => {
    console.log("Deleting module", id);
    setShowConfirmModal(false)
    const token = Cookies.get('token')!;
    const user = Cookies.get('user')!
    // Implement deletion logic here, such as API calls
      try {
        const response = await fetch(`https://lp-koala-backend-c0a69db0f618.herokuapp.com/modules/${id}`,{
            method: 'DELETE',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'authorization': token
            },
            body: `{"user": ${user}}`
        })

        if (response.status === 204) {
            console.log('module',id,' deleted');
            location.reload();
        }
    } catch (error){
        console.log(error)
    }
};

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm w-full">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
          {modules.map((module) => (
            (userRole === 'researcher' || (userRole === 'rater' && module.open === 'Yes')) && (
              <ProjectSidebarItem
                    key={module._id}
                    icon={Puzzle}
                    label={module.title}
                    href={`/projects/${projectId}/modules/${module._id}`}
                    onEdit={() => navigateToEditPage(module._id)}
                    onDelete={() => requestDelete(module._id)}
                    showDeleteIcon={true}
                />
            )
          ))}
      </div>
      <ProjectSidebarItem
            key="forum"
            icon={MessageCircle}
            label="Forum"
            href={`/projects/${projectId}/forums`}
      />
      {userRole !== 'rater' && (
        <Button className="my-5 mx-auto flex-row bg-[#1c407f]" onClick={() => router.push(`/projects/${projectId}/modules/create`)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      )}
      <ConfirmModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={() => moduleIdToDelete && handleDelete(moduleIdToDelete)} />
    </div>
  )
};