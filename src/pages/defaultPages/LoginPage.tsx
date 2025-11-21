import LoginForm from "@/components/organisms/LoginForm";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <img
        src="/logodark.png"
        alt="logoSenagest"
        className="absolute top-0 left-0 h-20 pt-6 ps-6"
      />
      <div className="flex">
        <div className="h-screen w-full xl:w-1/2 flex items-center justify-center">
            <LoginForm />
        </div>
        <div className="relative hidden h-screen xl:w-1/2 xl:flex overflow-hidden bg-blue-900">
            <img
            src="/loginbackground.png"
            alt="loginbackground"
            className="absolute w-full h-full object-cover object-center opacity-80 z-0"
            />
            <span className="absolute bottom-0 h-64 w-full bg-gradient-to-t from-black to-transparent z-10"></span>
            <div className="absolute bottom-6 left-6 text-white z-20">
                <p className="font-bold text-4xl my-3 flex items-center"><GraduationCap className="w-10 h-10 mr-4"/>SENAGEST</p>
                <p className="font-semibold">La única plataforma TODO EN UNO del Centro de Gestión y Desarrollo Sostenible Surcolombiano</p>
            </div>
        </div>
      </div>
    </div>
  );
}
