"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import PetForm from "./petForm";
import { PetFormData } from "./schema";
import { PawPrint } from "lucide-react";

interface PetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  defaultValues: PetFormData;
  onSubmit: (data: PetFormData) => Promise<void>;
  isLoading: boolean;
  label: string;
}

export default function PetModal({
  isOpen,
  onClose,
  title,
  subtitle,
  defaultValues,
  onSubmit,
  isLoading,
  label,
}: PetModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="2xl"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
          },
          exit: {
            y: 20,
            opacity: 0,
            transition: { duration: 0.2, ease: [0.5, 0, 0.75, 0] },
          },
        },
      }}
      classNames={{
        backdrop: "bg-black/50 backdrop-blur-sm",
        base: "border border-steel-blue/15 dark:border-white/10 bg-white dark:bg-[#0d1020] rounded-xl max-h-[85vh]  p-4",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-0">
              <h2 className="text-base font-bold text-steel-blue dark:text-white/90">
                <PawPrint
                  className="inline-block mr-1 mb-2 text-steel-blue dark:text-lime-burst"
                  size={16}
                />
                {title}
              </h2>
              <p className="text-xs font-normal text-gray-500 dark:text-white/50">
                {subtitle}
              </p>
            </ModalHeader>
            <ModalBody className="pb-6 overflow-y-auto custom-scrollbar">
              <PetForm
                defaultValues={defaultValues}
                onSubmit={async (data) => {
                  await onSubmit(data);
                  onClose();
                }}
                isLoading={isLoading}
                submitLabel={label}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
