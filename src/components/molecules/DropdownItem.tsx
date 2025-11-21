
type props = {icon : JSX.Element, name : string };

export default function DropdownItem( {icon, name} : props ) {
    return (
        <div className="p-3 my-2 cursor-pointer transition-all rounded-xl flex items-center space-x-4 hover:bg-gray-700">
            {icon}
            <p>{name}</p>
        </div>
    )
}