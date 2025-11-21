import { iconsConfig } from "@/config/icons";

export default function SidebarItemDropdown({icon, name } : {icon : string, name : string}){

    return(
        <div
            className="
              bg-gray-800
                cursor-pointer
                flex
                items-center
                w-56
                py-2
                rounded-3xl
                shadow-lg
                mx-auto
                ps-4
                md:w-48
                transition-colors
                hover:bg-gray-700
        ">
            {iconsConfig[icon]}
            <p className="ms-2">{name}</p>
        </div>
    )
}