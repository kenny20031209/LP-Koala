'use client';

import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import Cookies from "js-cookie";
import {ClipLoader} from "react-spinners";
import {Eye, EyeOff} from "lucide-react";

const ChangePasswordForm = () => {

    const [isErrorMessageDisplayed, setErrorMessageDisplayed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({passwordCurrent:'', newPassword:''});
    const [isSuccessMessageDisplayed, setSuccessMessageDisplayed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Your current password is incorrect');
    const [showPassword, setShowPassword] = useState(false)
    const onClick = async (e: React.FormEvent)=>{
        e.preventDefault();
        setIsLoading(true);
        setErrorMessageDisplayed(false);
        try {
            const response = await fetch('https://lp-koala-backend-c0a69db0f618.herokuapp.com/users/updateMyPassword', {
                method: 'PATCH',
                body: JSON.stringify(formData),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "authorization": Cookies.get('token')!
                }
            })
            setErrorMessageDisplayed(false);
            if (response.ok) {
                const data = await response.json();
                setErrorMessageDisplayed(false);
                setSuccessMessageDisplayed(true);
                setIsLoading(false);
                Cookies.set('token','Bearer ' + data.token);
            }
            else if (response.status == 401) {
                handleError('Your current password is incorrect')
            } else if (response.status === 500) {
                handleError('New password should at least have 8 characters')
            }
            // router.push('/projects');
        }catch(error) {
            console.log(error)
            setIsLoading(false);
            setErrorMessageDisplayed(true);
            setFormData((prevState) => ({...prevState, password: ''}))
        }
    }

    const handleError = (message:string)=>{
        setSuccessMessageDisplayed(false);
        setErrorMessageDisplayed(true);
        setErrorMessage(message);
        setIsLoading(false);
    }

    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = event.target;
        setFormData((prevState)=> ({...prevState, [name]:value}))
    }
    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col flex-1  ">
            <p className='text-red-600 my-4' hidden={!isErrorMessageDisplayed}>
                {errorMessage}
            </p>
            <p className='text-green-500 my-4' hidden={!isSuccessMessageDisplayed}>
                Password successfully updated!
            </p>
            <form className="space-y-6" onSubmit={onClick} action="#" method="POST">
                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Current Password
                        </label>
                    </div>
                    <div className="mt-2">
                        <input
                            onChange={onChange}
                            value={formData.passwordCurrent}
                            id="current-password"
                            name="passwordCurrent"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>

                <div className="flex items-center justify-between">
                    <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
                        New Password
                    </label>
                 </div>
                 <div className="mt-2 relative">
                     <input
                        onChange={onChange}
                        value={formData.newPassword}
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="newPassword"
                        required
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                     />
                    <span 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    >
                    {showPassword ? <Eye/> : <EyeOff/>}
                    </span>
                </div>
              </div>
                <div className='flex space-x-3'>
                    <Button
                        type="button"
                        onClick={()=>{
                            setFormData((prevState) => ({...prevState, newPassword: ''}))
                            console.log(formData)
                        }

                    }
                        className="flex w-full justify-center rounded-md bg-red-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Clear
                    </Button>
                    <Button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-[#1c407f] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <ClipLoader hidden={!isLoading} loading={isLoading} size={20} className='!border-sky-700 !border-b-transparent'/>
                        Confirm
                    </Button>
                </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
                Issues?{' '}
                <a href="#" className="font-semibold leading-6 hover:text-blue-600">
                    Email us on <span className='text-[#1c407f]'>dlassp@unimelb.edu.au</span>
                </a>
            </p>
        </div>

    );
};

export default ChangePasswordForm;