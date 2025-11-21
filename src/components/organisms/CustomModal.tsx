import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal"

interface props {
    isOpen: boolean;
    onOpenChange: () => void;
    title: string;
    children: React.ReactNode;
}

export default function CustomModal({ isOpen, onOpenChange, title, children }: props) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} scrollBehavior="inside" backdrop="blur" hideCloseButton={true} isKeyboardDismissDisabled={false}>
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    {children}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}