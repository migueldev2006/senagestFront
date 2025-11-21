import { axiosAPI } from "@/api/axiosAPI";
import { Module } from "@/types/modules/Module";
import { Permiso, PermisoUpdate } from "@/types/modules/Permiso";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function usePermiso(){

    const queryClient = useQueryClient();
    const [selectedModule,setSelectedModule] = useState(1);
    const [modules,setModules] = useState<Module[] | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState<string>("");
    const [totalPages, setTotalPages] = useState(1);

    useEffect(()=>{
        async function getModules(){
            try{
                const {data} = await axiosAPI.get('modulos/all');
                setModules(data.data);
            }
            catch(error){
                console.log(error);
            }
        }
        getModules();
    },[])


    async function getPermisos(){
        try{
            const {data} = await axiosAPI.get(`permisos/module/${selectedModule}?page=${page}&search=${search}`);
            setTotalPages(data.totalPages);
            return data.data;
        }
        catch(error){
            console.log(error);
        }
    }

    const {data : moduleWithPermisos, isLoading, isError, error} = useQuery({
        queryKey: ['permisos',selectedModule,page,search],
        queryFn: getPermisos,
    });

    async function createPermiso(data : Permiso){
        try{
            const response = await axiosAPI.post('permisos',data);
            const newRecord = response.data.data;
            queryClient.invalidateQueries({
                queryKey: ["permisos"],
                exact: false
            });
            return newRecord;
        }
        catch(error){
            console.log(error);
        }
    }

    async function updatePermiso(id:number, data: PermisoUpdate) {
    try {
      const response = await axiosAPI.patch(`permisos/update/${id}`, data);
      const updatedRecord = response.data.data;
      queryClient.invalidateQueries({
        queryKey: ["permisos"],
        exact: false
      })

      return updatedRecord;
    } catch (error) {
      console.log(error);
    }
  }

  async function updateStatus(id: number) {
    try{
      const response = await axiosAPI.patch(`permisos/status/${id}`);
      const updatedRecord = response.data.data;
      queryClient.invalidateQueries({
        queryKey: ["permisos"],
        exact: false
      });
      return updatedRecord;
    }
    catch(error){
      console.log(error);
    }
  }

    return { moduleWithPermisos, isLoading, isError, error, createPermiso, selectedModule, setSelectedModule, setPage, totalPages, modules, updatePermiso, updateStatus, setSearch };
}