import { useLocation,Link } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logout } from "../lib/api.js"
import {ShipWheelIcon,BellIcon, LogOutIcon} from "lucide-react"
import ThemeSelector from "./ThemeSelector.jsx"


const Navbar = () => {
    const {authUser}=useAuthUser()
    const location=useLocation()
    const isChatPage=location.pathname?.startsWith("/chat")
    const queryClient=useQueryClient()
    const {mutate:logoutMutation}=useMutation({
        mutationFn:logout,
        onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUser"]})
    })

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-end h-full">
        {/* LOGO - ONLY IN THE CHAT PAGE */}
        {isChatPage && (
            <div className="pl-5">
                <Link to="/" className="flex items-center gap-2.5">
                    <ShipWheelIcon className="size-9 text-primary" />
                    <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                        Veylo_Chat
                    </span>
                        </Link>
                    </div>
                )}
            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/notification"}>
                <button className="btn btn-ghost btn-circle">
                    <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                </button>
            </Link>
        </div>
        <ThemeSelector/>

            <Link to="/profile" className="avatar" aria-label="Open your profile" title="Edit profile">
        <div className="w-9 rounded-full">
            {authUser?.profilePic ? (
                <img src={authUser.profilePic} alt="User Avatar" />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-base-300 font-semibold" aria-label="User Avatar">
                    {authUser?.fullName?.charAt(0)?.toUpperCase() || "?"}
                </div>
            )}
        </div>
        </Link>
        {/* logout button */}
        <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6text-base-content opacity-70"/>
        </button>
        </div>
        </div> 
    </nav>
  )
}

export default Navbar
