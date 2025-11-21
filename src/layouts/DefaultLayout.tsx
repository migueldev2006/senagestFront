//Components
import Navbar from "@/components/organisms/Navbar";
import Sidebar from "@/components/organisms/Sidebar";


//Icons
//import { Menu, User } from "lucide-react";

export default function DefaultLayout({ children } : { children: React.ReactNode; }) {

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="w-full md:ms-64">

        <Navbar/>

        <div className="box-border px-6 md:px-10 overflow-y-auto">
        {children}
        </div>

      </div>
    </div>
  );
}
