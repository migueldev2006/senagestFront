import { axiosAPI } from "@/api/axiosAPI"
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Profile = {
    id: number;
    identificacion: number;
    primerNombre: string;
    segundoNombre: string | null;
    primerApellido: string;
    segundoApellido: string | null;
    correo: string;
    fichaId: number | null;
    img: string;
    fechaNacimiento: string;
    rol: {
        id: number;
        nombre: string;
        icono: string;
        permisos: {
            id: number;
            nombre: string;
            descripcion: string;
            tipo: string;
        }[];
        numberOfPermissions: number
    } | undefined;
    estado: boolean;
}

export default function useProfile(){

    const queryClient = useQueryClient();

    async function getProfile(){
        try{
            const { data } = await axiosAPI.get('usuarios/perfil');
            return data.data;
        }
        catch(error){
            console.log(error);
        }
    }

    const { data : profile, isLoading, isError, error } = useQuery<Profile>({
        queryKey : ['profile'],
        queryFn : getProfile
    })

    async function updateProfilePictude(file: File){
        const formData = new FormData();
        formData.append('img',file);
        await axiosAPI.post('usuarios/update/profile-picture',formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        queryClient.invalidateQueries({
            queryKey: ["profile"]
        });
    }

    return { profile, isLoading, isError, error, updateProfilePictude }
}