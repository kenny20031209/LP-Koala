import React, {useState} from 'react';
import {CircleUserRound} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";






function UserIcon() {
    const router = useRouter()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger  className='focus:outline-none'
            >
                <CircleUserRound className='mx-3 hover:stroke-gray-400' color='#1c407f' size={36} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mx-4' >
                <DropdownMenuItem onClick={()=>router.push('/profile')}>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>router.push('/change-password')}>
                    Change Password
                </DropdownMenuItem>
                {/*user should be logged out: clear cookie for jwt?*/}
                <DropdownMenuItem onClick={()=>{
                    Cookies.remove('token');
                    Cookies.remove('user');
                    router.push('/log-in');
                }}>
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserIcon;