import { Modulo, Permiso } from "@/types/default/Modulo";
import { User } from "./User"

export type Auth = {
    appLoading: boolean;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    modules: Modulo[];
    setModules: React.Dispatch<React.SetStateAction<Modulo[]>>;
    permissions: Permiso[];
    setPermissions: React.Dispatch<React.SetStateAction<Permiso[]>>;
}