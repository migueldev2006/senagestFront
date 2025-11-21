import { Search } from "lucide-react";

export default function SearchInput({setValue} : {setValue : React.Dispatch<React.SetStateAction<string>>}) {
    return (
        <div className="relative w-64 ms-auto mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
            onChange={(e) => setValue(e.target.value)}
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    )
}