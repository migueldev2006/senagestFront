import { z } from "zod";

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type ResetPassword = z.infer<typeof ResetPasswordSchema>

export const UpdatePasswordSchema = z.object({
  oldPassword: z.string().min(6,"Mínimo 6 caracteres"),
  newPassword: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type UpdatePassword = z.infer<typeof UpdatePasswordSchema>