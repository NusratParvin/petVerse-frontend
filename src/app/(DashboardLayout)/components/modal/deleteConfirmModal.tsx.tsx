import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useState } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  entityName?: string;
  entityType?: string;
  isLoading?: boolean;
  deleteVariant?: "danger" | "warning" | "primary";
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message,
  entityName,
  entityType = "item",
  isLoading = false,
  deleteVariant = "danger",
}: DeleteConfirmModalProps) => {
  const defaultMessage = entityName
    ? `Are you sure you want to delete "${entityName}"?`
    : `Are you sure you want to delete this ${entityType}?`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <p>{message || defaultMessage}</p>
              <p className="text-danger text-small">
                This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onCloseModal}>
                Cancel
              </Button>
              <Button
                color={deleteVariant}
                onPress={() => {
                  onConfirm();
                  onCloseModal();
                }}
                isLoading={isLoading}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

//  use delete hook
export const useDeleteModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name?: string;
    type?: string;
  } | null>(null);

  const openDeleteModal = (id: string, name?: string, type?: string) => {
    setItemToDelete({ id, name, type });
    setIsOpen(true);
  };

  const closeDeleteModal = () => {
    setIsOpen(false);
    setItemToDelete(null);
  };

  return {
    isOpen,
    itemToDelete,
    openDeleteModal,
    closeDeleteModal,
  };
};
