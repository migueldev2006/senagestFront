import { z } from "zod";

export const UsuarioSchema = z.object({
    identificacion: z.number({required_error:"Ingrese una identificación"}),
    primerNombre: z.string({required_error:"Ingrese un nombre"}).min(3,"Al menos 3 caractéres").max(20,"Máximo 20 caracteres"),
    segundoNombre: z.string().optional().nullable(),
    primerApellido: z.string({required_error:"Ingrese un nombre"}).min(3,"Al menos 3 caractéres").max(20,"Máximo 20 caracteres"),
    segundoApellido: z.string().optional().nullable(),
    correo: z.string({required_error:"Ingrese un correo"}).email(),
    fechaNacimiento: z.string({required_error:"Ingrese una fecha"}),
    fichaId: z.number({required_error:"Ingrese una ficha"}).optional().nullable(),
    rolId: z.number({required_error:"Ingrese un rol"}).optional().nullable(),
    img: z.any().optional(),
    estado: z.boolean().default(true).optional()
})

export type Usuario = z.infer<typeof UsuarioSchema>

export const UsuarioUpdateSchema = z.object({
    id: z.number(),
    primerNombre: z.string({required_error:"Ingrese un nombre"}).min(3,"Al menos 3 caractéres").max(20,"Máximo 20 caracteres"),
    segundoNombre: z.string().optional().nullable(),
    primerApellido: z.string({required_error:"Ingrese un nombre"}).min(3,"Al menos 3 caractéres").max(20,"Máximo 20 caracteres"),
    segundoApellido: z.string().optional().nullable(),
    fichaId: z.number({required_error:"Ingrese un ID ficha"}).optional().nullable(),
    rolId: z.number({required_error:"Ingrese un rol"}).optional().nullable(),
    img: z.string().optional()
})

export type UsuarioUpdate = z.infer<typeof UsuarioUpdateSchema>