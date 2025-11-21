import { Layout } from "@/types/default/Layout";
import { createContext, useContext, useState } from "react";

const LayoutContext = createContext<Layout | null>(null);

export const LayoutData = () => useContext(LayoutContext) as Layout;

export default function LayoutProvider({ children }: { children: React.ReactNode }) {

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    return (
        <LayoutContext.Provider value={{sidebarOpen,setSidebarOpen}}>
            {children}
        </LayoutContext.Provider>
    )
}