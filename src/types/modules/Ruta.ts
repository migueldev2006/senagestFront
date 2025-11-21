import z from "zod";

export const RutaSchema = z.object({
    id: z.number().optional(),
    moduloId : z.number({required_error:"Ingrese un módulo",invalid_type_error:"Ingrese un valor"}).min(1,"Ingrese un módulo"),
    nombre : z.string({required_error:"Ingrese un nombre para la ruta"}).min(6,"Ingrese mínimo 6 caracteres"),
    ruta : z.string({required_error:"Ingrese la ruta"}).min(3,"Ingrese mínimo 3 caracteres"),
})

export type Ruta = z.infer<typeof RutaSchema>;