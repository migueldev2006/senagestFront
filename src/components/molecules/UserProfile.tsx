import { AuthData } from "@/providers/AuthProvider"
import { Auth } from "@/types/default/Auth"
import { User } from "lucide-react";

export default function UserProfile(){
    const { user} = AuthData() as Auth;
    return(
        <div className="flex items-center">
            { user?.nombre ? <p>{user.nombre}</p> : <p>Usuario</p>}
            
            { user?.img ?
                <img width={'24px'} height={'24px'} src={`${import.meta.env.VITE_API_URL}uploads/${user.img}`} className="mx-2 rounded-full aspect-square object-cover" />
            : 
                <User className="mx-2" />
            }
        </div>
    )
}