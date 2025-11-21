import { Divider } from "@heroui/react";
import { PowerOff, Settings, User } from "lucide-react";
import DropdownItem from "../molecules/DropdownItem";
import useAuth from "@/hooks/auth/useAuth";
import { Link } from "react-router-dom";

export default function ProfileDropdown() {

    const { logout } = useAuth();

    return (
        <div className="z-50 pt-4 w-56 -inset-x-28 opacity-0 translate-y-2 absolute transition-all pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0">
            
            <div className="bg-gray-800 text-white box-border px-4 py-2 rounded-xl shadow-lg">

                <Link to="/profile">
                    <DropdownItem icon={<User/>} name="Perfil" />
                </Link>
                
                <Divider />

                <Link to="/settings">
                    <DropdownItem icon={<Settings/>} name="Configuración" />
                </Link>

                <Divider />
                
                <div onClick={logout}>
                    <DropdownItem icon={<PowerOff/>} name="Cerrar sesión" />
                </div>
                
            </div>

        </div>
    )
}