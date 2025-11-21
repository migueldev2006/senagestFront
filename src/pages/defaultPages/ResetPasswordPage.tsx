import { Lock } from "lucide-react";
import { Input } from "@heroui/input";
import CustomButton from "@/components/atoms/CustomButton";
import useAuth from "@/hooks/auth/useAuth";
import { addToast } from "@heroui/toast";
import {
  useNavigate,
  useSearchParams
} from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { Form } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPassword, ResetPasswordSchema } from "@/types/default/ResetPassword";
import ErrorMessage from "@/components/atoms/text/ErrorMessage";

export default function ResetPasswordPage() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  if(!token) return <NotFoundPage/>
  const {resetPasswordPost} = useAuth();

  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(ResetPasswordSchema)
  });
  
  async function onSubmit(data: ResetPassword){
    try{
      await resetPasswordPost(data.password,token as string);
      addToast({
        title: "Contraseña actualizada correctamente",
        description: "Redirigiendo al login",
        color: "success"
      });
      navigate('/login');
    }
    catch(error: any){
      console.error(error);
      addToast({
        title: error.response.data.message,
        description: "Hubo un error actualizando la contraseña",
        color: "danger"
      })
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <img
        src="/logodark.png"
        alt="logoSenagest"
        className="absolute top-0 left-0 h-20 pt-6 ps-6"
      />
      <div className="w-full max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow-lg">
        <Lock size={64} className="mx-auto"/>
        <h2 className="text-2xl font-semibold text-center mb-4">
          Restaura tu contraseña
        </h2>
        <p className="text-sm text-gray-600 text-center my-6">
          Ingresa la nueva contraseña
        </p>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("password")}
              type="password"
              placeholder="Nueva contraseña"
              className="py-4"
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            
            <Input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirmar contraseña"
              className="py-4"
            />
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}

            <CustomButton className="w-full" type="submit">
              Actualizar contraseña
            </CustomButton>
          </Form>
      </div>
    </div>
  );
}
