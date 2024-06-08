

import React from 'react';
import ChangePasswordForm from "@/components/change-password-form";

const Page = () => {

    return (
        <div className='px-6 flex flex-col h-1/3'>
            <p className='my-8 text-2xl text-center'>Change Your Password</p>
            <ChangePasswordForm/>
        </div>
    );
};

export default Page;