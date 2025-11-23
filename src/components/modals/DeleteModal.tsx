
import React from "react";
import ConfirmActionModal from "./ConfirmActionModal";
import { DeleteModalProps } from "@/types/modals";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
}: DeleteModalProps) => {
  const modalDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : description;

  return (
    <ConfirmActionModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      description={modalDescription}
      confirmText="Delete"
      cancelText="Cancel"
      variant="destructive"
    />
  );
};

export default DeleteModal;
