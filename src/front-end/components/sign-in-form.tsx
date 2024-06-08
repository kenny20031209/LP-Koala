'use client';
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {redirect, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {ClipLoader} from "react-spinners";
import Cookies from 'js-cookie';
import {isUserLoggedIn} from "@/lib/utils";
const SignInForm = () => {
    const router = useRouter()
    const [isErrorMessageDisplayed, setErrorMessageDisplayed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({username:'', password:''});

    useEffect(() => {
        const token = Cookies.get('token');
        if (isUserLoggedIn(token)) {
            return redirect('/projects');
        }
    }, []);

    const onClick = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessageDisplayed(false);
        try {
            const response = await fetch('https://lp-koala-backend-c0a69db0f618.herokuapp.com/users/login', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            setErrorMessageDisplayed(false);
            const data = await response.json();
            Cookies.set('token','Bearer ' + data.token);
            Cookies.set('user', JSON.stringify(data.data.user));

            router.push('/projects');
        }catch(error) {
            console.log(error)
            setIsLoading(false)
            setErrorMessageDisplayed(true)
            setFormData((prevState) => ({...prevState, password: ''}))
        }
    }

    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = event.target;
        setFormData((prevState)=> ({...prevState, [name]:value}))
    }
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="mx-auto w-full max-w-lg">
                <p className='text-center text-[40px] font-bold'>
                    Welcome to DLASSP
                </p>
                <Image
                    className="mx-auto w-auto my-2"
                    src="/unimelb-logo.png"
                    alt="Your Company"
                    width={200}
                    height={150}

                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
                <p className='text-red-600 my-4' hidden={!isErrorMessageDisplayed}>
                    Incorrect Username or Password
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={onClick} action="#" method="POST">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Username
                        </label>
                        <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                type="usernane"
                                autoComplete="username"
                                required
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={formData.username}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={formData.password}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            disabled={isLoading}
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-[#1c407f] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <ClipLoader hidden={!isLoading} loading={isLoading} size={20} className='!border-sky-700 !border-b-transparent'/>
                            Sign in
                        </Button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Need an account?{' '}
                    <a href="#" className="font-semibold leading-6 hover:text-blue-600">
                        Email us on <span className='text-[#1c407f]'>dlassp@unimelb.edu.au</span>
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignInForm;