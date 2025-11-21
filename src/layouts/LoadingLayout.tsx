import { Spinner } from "@heroui/react"

export default function LoadingLayout(){
    return(
        <div className="flex flex-col h-screen w-screen justify-center items-center">
            <img src="/logodark.png" alt="loading icon" className="w-60" />
            <Spinner/>
        </div>
    )
}