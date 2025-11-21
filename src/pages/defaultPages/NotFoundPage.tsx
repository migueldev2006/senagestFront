
import { Button } from "@heroui/button";
import { ArrowLeft, Ghost } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="flex flex-col items-center space-y-6">
        <Ghost className="h-20 w-20 text-muted-foreground" />
        <div>
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            La página que intentas buscar no existe o ha sido relocalizada.
          </p>
        </div>
        <Link to="/">
            <Button variant="bordered">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back Home
            </Button>
        </Link>
      </div>
    </div>
  );
}