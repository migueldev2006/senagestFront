import { Divider } from "@heroui/react";
import { FileWarning, MailWarning } from "lucide-react";
import PasswordForm from "./components/PasswordForm";

export default function SettingsPage(){
    return(
        <div className="my-10">
            <div>
                <div className="my-3 flex">
                    <FileWarning className="mr-2"/> Cambiar contraseña
                </div>
                <div className="mb-12 mt-6 lg:ms-12 w-full lg:w-1/2">
                    <PasswordForm/>
                </div>
            </div>

            <div>
                <Divider/>
                <div className="my-3 flex">
                    <MailWarning className="mr-2"/> Cambiar correo electrónico
                </div>
            </div>
        </div>
    )
}