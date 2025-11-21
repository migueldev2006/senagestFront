import { axiosAPI } from "@/api/axiosAPI";
import { UsuarioUpdate } from "@/types/modules/Usuario";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useUsuario(){

    const queryClient = useQueryClient();

    const [page,setPage] = useState(1);
    const [search,setSearch] = useState<string>("");
    const [totalPages,setTotalPages] = useState(1);

    async function getUsers() {
       try{
            const {data} = await axiosAPI.get(`usuarios?page=${page}&search=${search}`);
            setTotalPages(data.totalPages);
            return data.data;
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }

    const {data: users,isLoading,isError,error} = useQuery({
        queryKey: ["users",page,search],
        queryFn: getUsers
    });

    async function createUser(data: FormData){
        try{
            const response = await axiosAPI.post('usuarios',data,{
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            const newRecord = response.data.data;
            queryClient.invalidateQueries({
                queryKey: ["users"],
                exact: false
            });
            return newRecord;
        }
        catch(error){
            console.log(error);
        }
    }

    async function updateUser(id: number, data: UsuarioUpdate) {
        try{
            const response = await axiosAPI.patch(`usuarios/${id}`, data);
            const updatedRecord = response.data.data;
            queryClient.invalidateQueries({
                queryKey: ["users"],
                exact: false
            });
            return updatedRecord;
        }
        catch(error){
            console.log(error);
        }
    }

    async function updateStatus(id: number) {
        try{
            const response = await axiosAPI.patch(`usuarios/status/${id}`);
            const updatedRecord = response.data.data;
            queryClient.invalidateQueries({
                queryKey: ["users"],
                exact: false
            });
            return updatedRecord;
        }
        catch(error){
            console.log(error);
        }
    }

    async function getFichas() {
        try{
            const response = await axiosAPI.get(`fichas/all`);
            return response.data.data;
        }
        catch(error){
            console.log(error);
        }
    }

    const {data: fichas, isLoading: isFichasLoading, isError: isFichasError, error: fichasError} = useQuery({
        queryKey: ["fichas"],
        queryFn: getFichas
    })

    return { users, isLoading, isError, error, setPage, totalPages, createUser, updateUser, updateStatus, setSearch, fichas, isFichasLoading, isFichasError, fichasError };

}