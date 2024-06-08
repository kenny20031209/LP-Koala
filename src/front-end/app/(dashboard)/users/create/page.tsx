
import AddUserForm from "@/app/(dashboard)/users/_component/add-user-form";
import {cookies} from "next/headers";
import {Project} from "@/type";

async function Page() {

    const token = cookies().get('token')?.value
    const response = await fetch('https://lp-koala-backend-c0a69db0f618.herokuapp.com/projects', {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": token!
        }
    })

    const responseObject = await response.json();
    const projects = responseObject.data as Project [];

    return (
        <AddUserForm projects={projects}/>

    )

}

export default Page;
