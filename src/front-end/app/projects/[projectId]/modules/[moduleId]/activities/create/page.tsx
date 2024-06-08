"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomEditor from "@/components/custom-editor";
import {Label} from "@/components/ui/label";
import {useState} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


const CreateActivityPage = ({params}:{params:{projectId: string, moduleId:string}}) => {

  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const onClick = async ()=> {
    const token = Cookies.get('token')!
    const response = await fetch(`https://lp-koala-backend-c0a69db0f618.herokuapp.com/activity/${params.moduleId}`, {
      method: "POST",
      body: JSON.stringify({description, content}),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        'Authorization': token
      }
    })

    if (response.ok){
        const result = await response.json();
        console.log(result);
        router.push(`/projects/${params.projectId}/modules/${params.moduleId}`);

    }
  }

  return (

    <div className='p-6 h-full flex flex-col items-center justify-center' style={{ minHeight: '100vh', overflowY: 'auto' }}>
      <div className='my-4 w-full text-center gap-1.5'>
        <p className='text-center text-xl'>Create Activity</p>
        <Label>Description</Label>
        <Input required value={description} onChange={(event) => setDescription(event.target.value)} />
      </div>
      <CustomEditor onUpdate={(content) => {
        setContent(content);
      }} />
      <div style={{ marginTop: '200px' }}> {/* Adjust the margin as needed */}
        <Button type='button' onClick={onClick} className='m-auto'>
          Create
        </Button>
      </div>
    </div>

  );
}

export default CreateActivityPage;
