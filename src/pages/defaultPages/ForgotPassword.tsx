import { Mail } from "lucide-react";
import { Input } from "@heroui/input";
import CustomButton from "@/components/atoms/CustomButton";
import { FormEvent, useState } from "react";
import useAuth from "@/hooks/auth/useAuth";
import { addToast } from "@heroui/toast";
import { useNavigate } from "react-router-dom";
import { Form } from "@heroui/react";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const {forgotPasswordPost} = useAuth();
  const [email, setEmail] = useState<string>("");
  async function handleSubmit(e: FormEvent){
    e.preventDefault();
    try{
      await forgotPasswordPost(email);
      addToast({
        title: "E-mail enviado",
        description: "Revisa tu correo",
        color: "success"
      });
      navigate('ok');
    }
    catch(error: any){
      console.error(error);
      addToast({
        title: error.response.data.message,
        description: "Hubo un error enviando el E-mail",
        color: "danger"
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <img
        src="/logodark.png"
        alt="logoSenagest"
        className="absolute top-0 left-0 h-20 pt-6 ps-6"
      />
      <div className="w-full max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-sm text-gray-600 text-center my-6">
          Ingresa tu correo electrónico para enviarte un enlace de recuperación.
        </p>

        <div className="relative mb-4">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="email"
            placeholder="Correo electrónico"
            className="pl-10"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <CustomButton type="submit" className="w-full">
          Enviar enlace de recuperación
        </CustomButton>
      </div>
    </Form>
  );
}
