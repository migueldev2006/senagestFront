export default function FormCard({children}:{children:JSX.Element}){
    return(
        <div className="w-full md:w-1/2 p-6 bg-white shadow-lg rounded-2xl border-1 border-solid">
            {children}
        </div>
    )
}
