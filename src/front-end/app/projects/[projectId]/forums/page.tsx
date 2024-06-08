'use client';
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {useRouter} from "next/navigation";
import {useEffect, useState} from 'react';
import ThreadList from "./_components/thread-list";
import Cookies from "js-cookie";
import { getUserRole } from "@/lib/utils";
import {ClipLoader} from "react-spinners";


function Page({params}:{params:{projectId: string, threadId: string}}) {
    const router = useRouter();
    const {projectId} = params;
    const [threads, setThreads] = useState([])
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const getThreads = async ()=> {
        try {
            const token = Cookies.get('token')!;

            const response = await fetch(`https://lp-koala-backend-c0a69db0f618.herokuapp.com/projects/${projectId}/forums/threads/`,{
                method: "GET",
                headers: {
                    "Authorization": token!
                }
            }).then(async r => {
                if (r.ok) {
                    const result = await r.json();
                    console.log(result);
                    setIsLoading(false);
                    setThreads(result.data.data);
                }
            });


        }catch (error){
            console.log(error)
        }
    }

    useEffect(() => {
        getThreads();
    }, []);

    useEffect(() => {
        const fetchUserRole = async () => {
          const role = await getUserRole(Cookies.get('token'));
          setUserRole(role);
        };
      
        fetchUserRole();
    }, []);

    return (
        <div className="p-6 space-y-4">
            <div className="flex flex-row justify-between">
                {userRole !== 'rater' && (
                    <Button className='w-48 bg-[#1c407f]' onClick={()=>router.push(`/projects/${projectId}/forums/create`)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                        New Thread
                    </Button>
                )}
            </div>

            <ThreadList threads={threads} projectId={projectId} />
            {threads.length === 0 && !isLoading && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No Threads found
                </div>
            )}
            <div className='justify-center flex'>
                <ClipLoader loading={isLoading} size={50} className='!border-sky-700 !border-b-transparent' />
            </div>
        </div>
    );
}

export default Page;