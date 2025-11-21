import { Mail } from "lucide-react";

export default function ForgotPasswordOk() {

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <img
        src="/logodark.png"
        alt="logoSenagest"
        className="absolute top-0 left-0 h-20 pt-6 ps-6"
      />
      <div className="w-full max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow-lg">
        <Mail size={64} className="mx-auto"/>
        <h2 className="text-2xl font-semibold text-center mb-4">
          Revisa tu E-Mail
        </h2>
        <p className="text-sm text-gray-600 text-center my-6">
          Se ha enviado un link de recuperación a tu correo!
        </p>
      </div>
    </div>
  );
}
