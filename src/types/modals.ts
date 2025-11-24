export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

export type ConfirmActionModalProps = ModalProps & {
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
}

export type DeleteModalProps = ModalProps & {
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
}
