"use client";

import * as z from "zod";
import React, {useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { ArrowLeft } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {cn} from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  visibility: z.enum(["Yes", "No"], {
    message: "Visibility must be either 'Yes' or 'No'",
  }),
});
type FormData = z.infer<typeof formSchema>;

interface PageProps {
  params: { projectId: string; moduleId: string };
}

interface Module {
  title: string;
  open: string;
}

const EditPage: React.FC<PageProps> = ({params}) =>{
  const router = useRouter(); 
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      visibility: "Yes"
    },
  });

  const [module, setModule] = useState<Module | null>(null);
  const {formState: { isSubmitting, isValid }, reset } = form;

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch(`https://lp-koala-backend-c0a69db0f618.herokuapp.com/modules/${params.moduleId}`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': Cookies.get('token')!
        },
      });
      const {data: {data}} = await response.json();
      setModule(data);
      reset({ // Reset form with fetched data
        title: data.title,
        visibility: data.open,
      });
    };

    fetchProject();
  }, [params.moduleId, reset]);

  const onSubmit = async (data: FormData) => {
    const fullData = {
        title: data.title,
        open: data.visibility,
        // projectId: params.projectId
    };
    console.log(fullData);

    try {
      const response = await fetch(`https://lp-koala-backend-c0a69db0f618.herokuapp.com/modules/${params.moduleId}`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': Cookies.get('token')!
        },
        body: JSON.stringify(fullData)
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const result = await response.json();
      console.log(result);
      reset();
      router.push(`/projects/${params.projectId}/modules/${params.moduleId}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
      <Link href={`/projects/${params.projectId}/modules/${params.moduleId}`}>
          <Button style={{ width: '100px', position: 'relative', zIndex: 1 }} className="mt-auto mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
          </Button>
        </Link>
        <h1 className="text-2xl">
          Edit your Module
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            {/* Module Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Module title
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Visibility Dropdown */}
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Visibility
                  </FormLabel>
                  <FormControl>
                  <div style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '100%',
                      margin: '8px 0'
                    }}>
                      <select {...field} style={{
                        display: 'block',
                        width: '100%',
                        padding: '8px 16px',
                        lineHeight: '1.25',
                        color: '#444',
                        backgroundColor: '#fff',
                        backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M6.6%2010L12%204.5%20H1z%22%2F%3E%3C/svg%3E')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        appearance: 'none'
                      }}>
                        <option value="Yes" style={{ color: "green" }}>✔ Yes</option>
                        <option value="No" style={{ color: "red" }}>✖ No</option>
                      </select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Form Buttons */}
            <div className="flex items-center gap-x-2">
              <Link href={`/projects/${params.projectId}/modules/${params.moduleId}}`}>
                <Button
                  type="button"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={cn()}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
   );
}

export default EditPage;