import {redirect} from "next/navigation";
import {cookies} from "next/headers";


interface ProjectProps  {
    params: {projectId: string}
}

async function Page({params}:ProjectProps) {
    const token = cookies().get('token')?.value

    const response = await fetch(`https://lp-koala-backend-c0a69db0f618.herokuapp.com/projects/${params.projectId}`, {
            method: "GET",
            headers: {
                "Authorization": token!
            }
        });
    const {data: {data}} = await response.json();

    if (data.modules.length !== 0){
        redirect(`/projects/${params.projectId}/modules/${data.modules[0]._id}`)
    }

    return(
        <div className="text-center text-sm text-muted-foreground mt-10">
            No Modules found
        </div>
    )

}



export default Page;