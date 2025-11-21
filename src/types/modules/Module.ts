import z from 'zod';

export const ModuleSchema = z.object({
    id: z.number().optional(),
    nombre : z.string().min(3,"Name must be longer than 3 chars"),
    descripcion : z.string().min(10,"Description must be longer than 10 chars"),
    icono : z.string().default("Book"),
    estado: z.boolean().default(true)
})

export type Module = z.infer<typeof ModuleSchema>