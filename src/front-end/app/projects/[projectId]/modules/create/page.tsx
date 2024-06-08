"use client";

import * as z from "zod";
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
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

interface ProjectProps  {
    params: {projectId: string}
}

function CreatePage({params}:ProjectProps) {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      visibility: "Yes"
    },
  });
  const {formState: { isSubmitting, isValid }, reset } = form;

  const onSubmit = async (data: FormData) => {
    const fullData = {
      title: data.title,
      open: data.visibility,
      projectId: params.projectId
    };
      console.log(fullData);

    try {
      const response = await fetch('https://lp-koala-backend-c0a69db0f618.herokuapp.com/modules/createModule', {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': Cookies.get('token')!
        },
        body: JSON.stringify(fullData)
      });

      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error('Failed to create module');
      }

      try {
        reset();
        location.replace(`/projects/${params.projectId}/modules/${responseBody.data._id}`)
      } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          throw new Error('Server error: Expected JSON response, received something else.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return ( 
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        {/* <Link href={`/projects/${params.projectId}/modules`}>
          <Button style={{ width: '100px', position: 'relative', zIndex: 1 }} className="mt-auto mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
          </Button>
        </Link> */}
        <h1 className="text-2xl">
          Create your module
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
                      placeholder="e.g., 'Module 1'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Visibility Dropdown Field */}
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
              <Link href={`/projects/${params.projectId}`}>
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
 
export default CreatePage;