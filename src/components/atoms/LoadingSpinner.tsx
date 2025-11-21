import { Spinner } from '@heroui/spinner'

export default function LoadingSpinner(){
    return(
        <div className='flex items-center gap-2'>
            <Spinner/>
            Cargando...
        </div>
    )
}