import z from 'zod';
import { Modulo } from './Modulo';

export const LoginSchema = z.object({
    correo: z.string().refine((val) => {
        return val === 'admin' || z.string().email().safeParse(val).success;
    }, {
        message: 'Ingrese un correo válido',
    }),
    contrasena: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres")
})

export type Login = z.infer<typeof LoginSchema>

export type LoginResponse = {
    access_token: string;
    message: string;
    status: number;
    error: string | undefined;
    modulos: Modulo[] | undefined
}