import {NextRequest, NextResponse} from "next/server";
import {getUserRole, isUserLoggedIn} from "@/lib/utils";

export async function middleware  (request: NextRequest){

    const token = request.cookies.get('token')?.value;
    if (!isUserLoggedIn(token)) {
        return NextResponse.redirect(new URL('/log-in', request.url))
    }


    let role = await getUserRole(token).catch(error=>{
        console.log(error)
    });

    if (request.nextUrl.pathname.startsWith('/users')) {
        if (role === 'rater'){
            return NextResponse.redirect(new URL('/projects', request.url))
        }
    }

    if (request.nextUrl.pathname.startsWith('/projects/create')) {
        if (role === 'rater'){
            return NextResponse.redirect(new URL('/projects', request.url))
        }
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|favicon.ico|log-in|_next/image|.*\\.png$).*)'],
}