import { axiosAPI } from "@/api/axiosAPI";
import { AuthData } from "@/providers/AuthProvider";
import { Login, LoginResponse } from "@/types/default/Login";
import { addToast } from '@heroui/toast';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from "@/types/default/User";
import Cookies from 'universal-cookie';
import { useState } from "react";
import { UpdatePassword } from "@/types/default/ResetPassword";

const cookies = new Cookies();

export default function useAuth(){


    const navigate = useNavigate();
    const { setIsAuthenticated, setUser, setModules, setPermissions } = AuthData();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    async function login( loginData : Login){
        setIsLoading(true);
        setError("");
        try{
            const { data } = await axiosAPI.post<Partial<LoginResponse>>('auth/login',{
                correo : loginData.correo,
                contrasena : loginData.contrasena
            });

            const token = data.access_token;
            if(!token) throw new Error("Error iniciando sesión");

            const payload : JwtPayload = jwtDecode(token);
            const modules = data.modulos ?? [];
            const permissions = modules.flatMap((module) => module.rutas).flatMap((ruta) => ruta.permisos) || [];

            // Info en Cookies
            cookies.set('token',token);
            cookies.set('modules',modules);
            cookies.set('permissions',permissions);

            setIsAuthenticated(true);
            setUser(payload);
            setModules(modules);
            setPermissions(permissions);

            addToast({
                title: "Inicio de sesión correcto",
                description: "Redirigiendo al login",
                color: "success"
            })

            //Retorno al inicio
            navigate('/');
        }
        catch(error : any){
            const message = error.response.data.message ?? null;
            const status = error.status ?? null;
            if(message && status){
                addToast({
                    title : `${status}`,
                    description : `${message}`,
                    color : "danger"
                });
                setError(message);
            }
            else {
                console.log(error);
            }
        }
        finally{
            setIsLoading(false);
        }
    }

    async function logout(){
        cookies.remove('token');
        cookies.remove('modules');
        cookies.remove('permissions');
        setIsAuthenticated(false);
        setUser(null);
        setModules([]);
        setPermissions([]);
        navigate('/');
    }

    async function forgotPasswordPost(email: string){
        try{
            const response = await axiosAPI.post('auth/forgot-password',{email});
            return response.data.status;
        }
        catch(error: any){
            console.error(error);
            throw error;
        }
    }

    async function resetPasswordPost(password: string, token: string){
        try{
            const response = await axiosAPI.post('auth/reset-password',{password, token});
            return response.data.status;
        }
        catch(error: any){
            console.error(error);
            return error.response.data.status
        }
    }

    async function updatePassword(data: UpdatePassword){
        try{
            const response = await axiosAPI.post('auth/update-password',data);
            addToast({
                title: "Contraseña actualizada correctamente",
                description: "Inicie sesión nuevamente para ver los cambios",
                color: "success"
            })
            return response.data;
        }
        catch(error: any){
            console.error(error);
            addToast({
                title: "Error actualizando la contraseña",
                description: error.response.data.message,
                color: "danger"
            })
            return error.response.data.status;
        }
    }

    return { isLoading, login, logout, forgotPasswordPost, resetPasswordPost, error, updatePassword}
}