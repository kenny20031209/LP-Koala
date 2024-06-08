import Image from "next/image";
import Link from "next/link";
import { Trash, MoreHorizontal, Edit } from "lucide-react"
import ConfirmModal from './confirm-modal';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";


interface ProjectCardProps {
  id: string;
  name: string;
  image: string;
  isRater: boolean;
};

export const ProjectCard  = ({
  id,
  name,
  image,
  isRater
                             }: ProjectCardProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  const handleConfirmDelete = async () => {
      console.log("Deleting project", id);
      setShowConfirmModal(false)
      const token = Cookies.get('token')!;
      const user = Cookies.get('user')!


      // Implement deletion logic here, such as API calls
        try {
          const response = await fetch(`https://lp-koala-backend-c0a69db0f618.herokuapp.com/projects/${id}`,{
              method: 'DELETE',
              headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  'authorization': token
              },
              body: `{"user": ${user}}`
          })

          if (response.status === 204) {
              console.log('project',id,' deleted');
              location.reload();
          }

      } catch (error){
          console.log(error)
          // setIsLoading(false);
      }
  };

  return (

      <div className="relative group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">

        { !isRater && ( <div className='absolute right-1 z-20'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-4 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/projects/${id}/edit`}>
                <DropdownMenuItem>
                  <Edit size={16} className="text-blue-500 m-1" />
                  Edit
                </DropdownMenuItem>
              </Link>
              <button onClick={() => setShowConfirmModal(true)} className="w-full text-left">
                <DropdownMenuItem>
                  <Trash size={16} className="text-red-500 m-1" />
                  Delete
                </DropdownMenuItem>
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>)}
        <Link href={`/projects/${id}`}>
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt={name}
            src={image}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {name}
          </div>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
            </div>
          </div>
        </div>
        </Link>

        <ConfirmModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={handleConfirmDelete} />
      </div>
  )
}