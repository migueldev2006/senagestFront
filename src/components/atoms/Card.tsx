import { Card, CardHeader, CardBody } from "@heroui/react";

type Props = {
  title: string;
  img?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function CustomCard({ title, img, children, className }: Props) {
  return (
    <Card className={`p-4 ${className ?? ""}`}>
      {img && (
        <CardHeader className="p-0">
          <img
            src={img}
            alt={title}
            className="w-full h-32 object-cover rounded-t-xl"
          />
        </CardHeader>
      )}

      <CardBody>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        {children}
      </CardBody>
    </Card>
  );
}
