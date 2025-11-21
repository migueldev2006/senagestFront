import { AuthData } from "@/providers/AuthProvider";
import { Auth } from "@/types/default/Auth";
import { ChevronDown, Menu } from "lucide-react";
import UserProfile from "../molecules/UserProfile";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { LayoutData } from "@/providers/LayoutProvider";

export default function Navbar(){
  
  const { isAuthenticated } = AuthData() as Auth;
  const { sidebarOpen, setSidebarOpen } = LayoutData();

  const navigate = useNavigate();

  return(
        <div className="bg-gray-800 text-white p-2 shadow-lg z-0 h-12 w-full flex align-middle">

          <Menu className="cursor-pointer md:hidden" size={32} strokeWidth={3} onClick={() => setSidebarOpen(!sidebarOpen)} />
          
          <span className="ms-auto flex items-center">
            { isAuthenticated ?
              <div className="relative group">
                <div className="flex">
                  <UserProfile/>
                  <ChevronDown className="transition-all ease-in-out group-hover:rotate-180"/>
                </div>
                <ProfileDropdown/>
              </div>
              :
              <Button color="success" variant="bordered" onPress={()=>navigate('/login')}>Log In</Button>
            }
            
          </span>
        </div>
    )
}