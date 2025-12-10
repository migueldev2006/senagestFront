    import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal"

interface props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    title: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}

export default function CustomModal({ isOpen, onOpenChange, title, children, size="xl" }: props) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} scrollBehavior="inside" backdrop="blur" hideCloseButton={true} isKeyboardDismissDisabled={false} size={size}>
            <ModalContent>
                <ModalHeader className="flex justify-center">{title}</ModalHeader>
                <ModalBody>
                    {children}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}