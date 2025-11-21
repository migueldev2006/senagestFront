import { axiosAPI } from "@/api/axiosAPI"
import { Rol } from "@/types/modules/Rol";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useRol(){

    const queryClient = useQueryClient();

    const [page,setPage] = useState(1);
    const [search,setSearch] = useState<string>("");
    const [totalPages,setTotalPages] = useState(1);

    async function getRoles(){
        try{
            const {data} = await axiosAPI.get(`roles?page=${page}&search=${search}`);
            setTotalPages(data.totalPages);
            return data.data;
        }
        catch(error){
            console.log(error);
            return error;
        }
    }

    const {data : roles, isLoading, isError, error} = useQuery({
        queryKey : ["roles",page,search],
        queryFn : getRoles
    })

    async function getAllRoles(){
        try{
            const {data} = await axiosAPI.get(`roles?page=${page}`);
            setTotalPages(data.totalPages);
            return data.data;
        }
        catch(error){
            console.log(error);
            return error;
        }
    }

    const {data : allRoles} = useQuery({
        queryKey : ["allRoles"],
        queryFn : getAllRoles
    })

    async function createRol(data: Rol){
        try{
            const response = await axiosAPI.post("roles",data);
            const newRecord = response.data.data;
            queryClient.invalidateQueries({
                queryKey: ["roles"],
                exact: false
            });
            return newRecord;
        }
        catch(error: any){
            console.log(error);
        }
    }

    async function updateRol(id: number,data: Rol){
        try{
            const response = await axiosAPI.patch(`roles/update/${id}`,data);
            const newRecord = response.data.data;
            queryClient.invalidateQueries({
                queryKey: ["roles"],
                exact: false
            });
            return newRecord;
        }
        catch(error: any){
            console.log(error);
        }
    }

    async function updateStatus(id: number) {
        try{
        const response = await axiosAPI.patch(`roles/status/${id}`);
        const updatedRecord = response.data.data;
        queryClient.invalidateQueries({
            queryKey: ["roles"],
            exact: false
        });
        return updatedRecord;
        }
        catch(error){
        console.log(error);
        }
    }

    return {roles, isLoading, isError, error, createRol, setPage, totalPages, updateRol, allRoles, updateStatus, setSearch}
}