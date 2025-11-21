import { z } from "zod";

export const PermisoSchema = z.object({
    nombre : z.string().min(3,"Ingrese mínimo 3 caracteres"),
    descripcion : z.string().min(10,"Ingrese mínimo 10 caracteres"),
    tipo : z.string({required_error:"Ingrese un tipo"}).min(1,"Tipo requerido"),
    rutaId : z.number({required_error:"Ingrese un módulo",invalid_type_error:"Ingrese un valor"}),
    estado: z.boolean().default(true)
})

export type Permiso = z.infer<typeof PermisoSchema>

export const PermisoUpdateSchema = z.object({
    nombre : z.string().min(3,"Ingrese mínimo 3 caracteres"),
    descripcion : z.string().min(10,"Ingrese mínimo 10 caracteres"),
    tipo : z.string({required_error:"Ingrese un tipo"}).min(1,"Tipo requerido"),
})

export type PermisoUpdate = z.infer<typeof PermisoUpdateSchema>

export type Rol = {
    id : number,
    nombre : string,
    descripcion : string,
    icono : string
}