export default function Title({children, className} : {children : React.ReactNode, className?: string | undefined}){
    return(
        <h1 className={`text-2xl font-semibold ${className ?? ""}`}>
            {children}
        </h1>
    )
}