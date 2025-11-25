import { Card, CardHeader, CardBody } from "@heroui/react";

type Props = {
  name: string;
  role: string;
  img: string;
  description: string;
  className?: string;
  children?: React.ReactNode; 
};

export default function CustomUserCard({
  name,
  role,
  img,
  description,
  className,
  children,
}: Props) {
  return (
    <Card className={`max-w-sm p-4 ${className ?? ""}`}>
      <CardHeader className="gap-3">
        <img
          src={img}
          alt={name}
          className="rounded-full w-14 h-14 object-cover"
        />

        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </CardHeader>

      <CardBody>
        <p>{description}</p>

        {/* Si el usuario envía children, lo mostramos */}
        {children}
      </CardBody>
    </Card>
  );
}
