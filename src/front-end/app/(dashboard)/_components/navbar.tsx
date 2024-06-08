import { NavbarRoutes } from "@/app/(dashboard)/_components/navbar-routes"

import { MobileSidebar } from "./mobile-sidebar"

export const Navbar = () => {

    return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
        <p className='text-center right-52 left-52 md:right-28 md:left-80 absolute text-3xl md:text-6xl text-sky-700'>DLASSP</p>
        <MobileSidebar />
        <NavbarRoutes/>
    </div>
  )
}