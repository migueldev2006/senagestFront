import ErrorMessage from "@/components/atoms/text/ErrorMessage";
import useAuth from "@/hooks/auth/useAuth";
import { UpdatePassword, UpdatePasswordSchema } from "@/types/default/ResetPassword";
import { Button, Divider, Form, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function PasswordForm(){

    const { updatePassword } = useAuth();
    
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: zodResolver(UpdatePasswordSchema)
    })

    async function onSubmit(data: UpdatePassword){
        await updatePassword(data);
        reset();
    }

    return(
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Input {...register("oldPassword")} type="password" placeholder="password123" label="Contraseña anterior" labelPlacement="outside"/>
            {errors.oldPassword && <ErrorMessage>{errors.oldPassword.message}</ErrorMessage>}
            <Divider className="my-2 w-11/12 mx-auto"/>
            <Input {...register("newPassword")} className="mb-4" type="password" placeholder="newpassword123" label="Nueva contraseña" labelPlacement="outside"/>
            {errors.newPassword && <ErrorMessage>{errors.newPassword.message}</ErrorMessage>}
            <Input {...register("confirmPassword")} className="mb-4" type="password" placeholder="newpassword123" label="Confirme nueva contraseña" labelPlacement="outside"/>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
            <Button variant="bordered" color="danger" type="submit">Cambiar contraseña</Button>
        </Form>
    )
}