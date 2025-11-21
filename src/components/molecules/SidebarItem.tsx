import { LayoutData } from "@/providers/LayoutProvider";
import { iconsConfig } from "@/config/icons";
import { Link } from "react-router-dom";

export default function SidebarItem({icon, name, path} : {icon : string, name : string, path : string}){

    const { setSidebarOpen } = LayoutData();

    return(
        <Link
            onClick={() => setSidebarOpen(false)}
            to={path}
            className="
              bg-gray-800
                flex
                items-center
                w-56
                py-2
                rounded-3xl
                shadow-lg
                mx-auto
                ps-4
                cursor-pointer
                md:w-48
                transition-colors
                hover:bg-gray-700
        ">
            {iconsConfig[icon]}
            <p className="ms-2">{name}</p>
        </Link>
    )
}