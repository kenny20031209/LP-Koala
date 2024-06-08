"use client";

import * as z from "zod";
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { ArrowLeft } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
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
  description: z.string().min(1, {
    message: "Content is required",
  }),
});
type FormData = z.infer<typeof formSchema>;

function CreatePage({params}: {params:{projectId: string}}) {
  const router = useRouter();
  const {projectId} = params;
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description:"",
    },
  });
  const {formState: { isSubmitting, isValid }, reset } = form;

  const onSubmit = async (data: FormData) => {
    const fullData = {
      description: data.description,
      title: data.title,
    };
    console.log(fullData);

    try {
      const response = await fetch(`https://lp-koala-backend-c0a69db0f618.herokuapp.com/projects/${projectId}/forums/threads`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': Cookies.get('token')!
        },
        body: JSON.stringify(fullData)
      });

      if (!response.ok) {
        throw new Error('Failed to create thread');
      }

      const result = await response.json();
      console.log(result);
      reset();
      router.push(`/projects/${projectId}/forums`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return ( 
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <Link href={`/projects/${projectId}/forums`}>
          <Button style={{ width: '100px', position: 'relative', zIndex: 1 }} className="mt-auto mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
          </Button>
        </Link>
        <h1 className="text-2xl">
          Create your Thread
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            {/* Project Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Thread Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'Advanced Spanish'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Content Upload Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Thread Description
                  </FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Enter detailed thread description"
                      rows={10}
                      className="w-full p-2 border rounded"
                    />
                  </FormControl>
                  <FormMessage>
                  </FormMessage>
                </FormItem>
              )}
            />
            {/* Form Buttons */}
            <div className="flex items-center gap-x-2">
              <Link href="/projects">
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
                // className={}？
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