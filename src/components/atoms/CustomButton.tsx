import { Button } from "@heroui/button";

type props = {
    onPress?: () => void;
    className?: string;
    children: React.ReactNode,
    type?: "button" | "submit" | "reset"
}

export default function CustomButton({onPress, className, children, type}: props){
    return(
        <Button
          onPress={onPress}
          className={`my-4 border-gray-800 text-gray-800 ${className ?? ""}`}
          color="success"
          variant="bordered"
          type={type ?? "button"}
        >
          {children}
        </Button>
    )
}