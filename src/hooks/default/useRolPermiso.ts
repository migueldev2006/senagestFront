import { axiosAPI } from "@/api/axiosAPI";
import { useQuery } from "@tanstack/react-query";

export default function useRolPermiso(){
    
    async function getRoles(){
        try{
            const {data} = await axiosAPI.get("roles/all");
            return data.data;
        }
        catch(error){
            console.log(error);
            return error;
        }
    }

    const {data : roles, isLoading, isError, error} = useQuery({
        queryKey : ["permisoRoles"],
        queryFn : getRoles
    })

    async function getPermisoByRol(id : number){
        try{
            const { data } = await axiosAPI.get(`rolpermiso/role/${id}`);
            return data.data;
        }
        catch(error){
            console.log(error);
        }
    }

    async function asignPermiso(permisoId : number,rolId : number,valor : boolean){
        try{
            await axiosAPI.post(`rolpermiso/asign/${permisoId}/${rolId}/${valor}`);
        }
        catch(error : any){
            console.log(error);
        }
    }

    return {roles, isLoading, isError, error, getPermisoByRol, asignPermiso}
}