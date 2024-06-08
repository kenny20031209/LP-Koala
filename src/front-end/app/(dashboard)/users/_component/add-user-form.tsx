'use client';
import React, {useState} from 'react';
import {Project} from "@/type";
import * as z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import Cookies from "js-cookie";
import {useToast} from "@/components/ui/use-toast";
import {CircleCheck} from "lucide-react";
import {ClipLoader} from "react-spinners";
import {useRouter} from "next/navigation";
import {Eye, EyeOff} from "lucide-react";



const AddUserForm = ({projects}: { projects: Project[] }) =>{
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [showPassword, setShowPassword] = useState(false)
    const roleEnum = z.enum(['admin', 'researcher', 'rater'])
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();
    const router = useRouter();
    const userSchema = z.object({
        name: z.string().min(1, {
              message: "Name is required"
        }),
        username: z.string().min(1, {
            message: "User name is required"
        }),
        password: z.string().min(8, {
            message: "Password should be at least 8 characters"
        }),
        role: roleEnum,
        projects: z.array(z.string())
    })

    const form = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            username: "",
            password: "",
            role: roleEnum.Enum.admin,
            projects: []
        }
    })

    const onSubmit = async (values: z.infer<typeof userSchema>) => {
        values.projects = selectedProjects;
        setIsLoading(false);
        setIsLoading(true);
        const token = Cookies.get('token')!
        const response = await fetch("https://lp-koala-backend-c0a69db0f618.herokuapp.com/users/createUser", {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': token
            }
        })

        if (response.ok) {
            toast({
                title:(<div className='flex-row text-xl'>User created! <CircleCheck className='stroke-green-600' /> </div>),
            })
            setIsLoading(false);
            router.push('/users');
        }


    }

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 ">Add User</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 px-6 py-8 bg-white shadow-md rounded-lg space-y-4">
                    <FormField control={form.control} name='name' render={({field})=>(
                        <FormItem>
                            <FormLabel className="block text-sm font-medium leading-6 text-gray-800">
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder='Enter name'
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name='username' render={({field})=>(
                        <FormItem >
                            <FormLabel className="block text-sm font-medium leading-6 text-gray-800">
                                User name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder='Enter user name'
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />



        <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem className="relative">
                <FormLabel className="block text-sm font-medium leading-6 text-gray-800">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} placeholder="Enter password" type={showPassword ? 'text' : 'password'}/>
                    <span 
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? <Eye/> : <EyeOff/>}
                    </span>
                  </div>
                </FormControl>
              </FormItem>
              
            )}
          ></FormField>

                    <FormField control={form.control} name='role' render={({field})=>(
                        <FormItem>
                            <FormLabel className="block text-sm font-medium leading-6 text-gray-800">
                                Role
                            </FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select a role'/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={roleEnum.Enum.admin}>Admin</SelectItem>
                                        <SelectItem value={roleEnum.Enum.researcher}>Researcher</SelectItem>
                                        <SelectItem value={roleEnum.Enum.rater}>Rater</SelectItem>
                                    </SelectContent>
                                </Select>

                            </FormControl>
                            <FormMessage/>

                        </FormItem>
                    )} />


                    <FormField
                        control={form.control} name='projects' render={({field})=>(
                        <FormItem >
                            <FormLabel className="block text-sm font-medium leading-6 text-gray-800">
                                Allocate Projects
                            </FormLabel>
                            <FormDescription>
                                Allocate the projects for this user
                            </FormDescription>
                            <div className="overflow-auto h-32 border border-gray-300 rounded-md shadow-sm space-y-4 p-3"
                            >
                                {projects.map((project) => (
                                <FormField key={project._id} control={form.control} name='projects' render={({field})=>(
                                    <FormItem
                                               className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                        <FormControl>
                                            <Checkbox
                                                checked={selectedProjects.includes(project._id)}
                                                onCheckedChange={(checked) => {
                                                    setSelectedProjects((prev: string[]) => {
                                                        if (checked) return [...prev, project._id];
                                                        return prev.filter(p => p !== project._id);
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel>
                                            {project.title}
                                        </FormLabel>
                                    </FormItem>
                                )} />


                            ))}
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )} />

                    <div className='flex flex-row justify-between'>
                        <Button disabled={isLoading} type='submit' className="bg-[#1c407f] text-white font-semibold px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                            <ClipLoader hidden={!isLoading} loading={isLoading} size={20} className='!border-sky-700 !border-b-transparent'/>

                            Create
                        </Button>
                        <Button type='button' onClick={()=>{
                            form.reset();
                        }} className='bg-red-600'>
                            Clear
                        </Button>
                    </div>
            </form>
            </Form>

        </div>
    );
}

export default AddUserForm;