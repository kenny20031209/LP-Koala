"use client";

import * as z from "zod";
import React, {useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ArrowRight } from "lucide-react"
import Allocation from '@/components/allocate-user';
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
  image: z.string().min(1, {
    message: "image is required",
  }),
});
type FormData = z.infer<typeof formSchema>;

interface PageProps {
  params: { projectId: string };
}

interface Project {
  title: string;
  image: string;
  researchers: string[];
  raters: string[];
}

const EditPage: React.FC<PageProps> = ({params}) =>{
  const router = useRouter(); 
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: ""
    },
  });

  const [project, setProject] = useState<Project | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const {formState: { isSubmitting, isValid }, reset } = form;
  const [isRaterModalOpen, setRaterModalOpen] = useState(false);
  const [isResearcherModalOpen, setResearcherModalOpen] = useState(false);
  const [selectedRaters, setSelectedRaters] = useState<string[]>(['']);
  const [selectedResearchers, setselectedResearchers] = useState<string[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch(`https://lp-koala-backend-c0a69db0f618.herokuapp.com/projects/${params.projectId}`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': Cookies.get('token')!
        },
      });
      const {data: {data}} = await response.json();
      setProject(data);
      reset({ // Reset form with fetched data
        title: data.title,
        image: data.image,
      });
      setImageURL(data.image);
      const ratersId: string[] = [];
      const researchersId: string[] = [];
      data.raters.map((rater)=>{
          ratersId.push(rater._id)
      });
      data.researchers.map((researcher)=>{
          researchersId.push(researcher._id)
      })
      setSelectedRaters(ratersId);
      setselectedResearchers(researchersId);
    };

    fetchProject();
  }, [params.projectId, reset]);

  const handleOpenRaterModal = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setRaterModalOpen(true);
  };

  const handleOpenResearcherModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setResearcherModalOpen(true);
};

  const handleRaterCloseModal = () => {
      setRaterModalOpen(false);
  };

  const handleResearcherCloseModal = () => {
    setResearcherModalOpen(false);
  };

  const handleConfirm = () => {
      console.log("Rater allocation confirmed");
      updateRaters(selectedRaters);
      setRaterModalOpen(false);
  };

  const handleConfirm2 = () => {
    console.log("Researcher allocation confirmed");
    updateResearchers(selectedResearchers);
    setResearcherModalOpen(false);
};

  const updateRaters = (raters: string[]) => {
    setSelectedRaters(raters);
  };

  const updateResearchers = (researchers: string[]) => {
    setselectedResearchers(researchers);
  };

  const onSubmit = async (data: FormData) => {
    const fullData = {
      title: data.title,
      image: data.image,
      researchers: selectedResearchers,
      raters: selectedRaters
    };
      console.log(fullData);

    try {
      const response = await fetch(`https://lp-koala-backend-c0a69db0f618.herokuapp.com/projects/${params.projectId}`, {
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
      router.push(`/projects`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        {!(isRaterModalOpen || isResearcherModalOpen) && (
          <Link href='/projects'>
            <Button style={{ width: '100px', position: 'relative', zIndex: 1 }} className="mt-auto mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        )}
        <h1 className="text-2xl">
          Edit your project
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
                    Project title
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
            {/* Image Upload Field */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Project image
                  </FormLabel><br></br>
                  <FormControl>
                    <>
                      {/* {imageURL && <img src={imageURL} alt="Project" width="300" height="300"/>} */}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isSubmitting}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                              const reader = new FileReader()
                              reader.readAsDataURL(e.target.files[0])
                              reader.onload = () => {
                                  console.log('called: ', reader)
                                  // console.log(reader.result)
                                  field.onChange(reader.result)
                              }
                            field.onChange(e.target.files[0]);
                          } else {
                            field.onChange(null); // Set field value to null if no file is selected
                          }
                        }}
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /><br></br>
            {/* Allocate Raters Button */}
            <Button onClick={handleOpenRaterModal}>
                Allocate Rater
                <ArrowRight className="h-4 w-4 mr-2" />
            </Button>
            <Allocation
                isOpen={isRaterModalOpen}
                onClose={handleRaterCloseModal}
                onConfirm={handleConfirm}
                onUpdateUsers={updateRaters}
                allocatedUsers={selectedRaters}
                userType='rater'

            /><br></br>
            {/* Allocate Researchers Button */}
            <Button onClick={handleOpenResearcherModal}>
                Allocate Researcher
                <ArrowRight className="h-4 w-4 mr-2" />
            </Button>
            <Allocation
                isOpen={isResearcherModalOpen}
                onClose={handleResearcherCloseModal}
                onConfirm={handleConfirm2}
                onUpdateUsers={updateResearchers}
                allocatedUsers={selectedResearchers}
                userType='researcher'
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
                disabled={!isValid || isSubmitting || isRaterModalOpen || isResearcherModalOpen}
                className={cn((isRaterModalOpen || isResearcherModalOpen) && 'z-[-10]')}
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