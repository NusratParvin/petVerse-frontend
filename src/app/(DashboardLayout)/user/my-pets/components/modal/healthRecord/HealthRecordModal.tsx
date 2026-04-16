"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { RECORD_TYPES } from "./constants";
import HealthRecordForm from "./HealthRecordForm";

interface HealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
}

export default function HealthRecordModal({
  isOpen,
  onClose,
  title,
  subtitle,
  initialData,
  onSubmit,
  isLoading,
  submitLabel,
}: HealthRecordModalProps) {
  const currentType = RECORD_TYPES.find(
    (t) => t.value === initialData?.type,
  )?.icon;
  const CurrentIcon = currentType || RECORD_TYPES[0].icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="lg"
      classNames={{
        backdrop: "bg-black/50 backdrop-blur-sm",
        base: "border border-steel-blue/20 dark:border-white/10 bg-white dark:bg-[#0d1020] rounded-xl",
      }}
    >
      <ModalContent>
        <ModalHeader className="pt-6 px-6 pb-2">
          <h2 className="text-base font-bold text-steel-blue dark:text-white/90">
            <CurrentIcon
              className="inline-block mr-2 text-lime-burst"
              size={16}
            />
            {title}
          </h2>
          <p className="text-xs text-gray-500 dark:text-white/50">{subtitle}</p>
        </ModalHeader>

        <ModalBody className="pb-6 px-6">
          <HealthRecordForm
            initialData={initialData}
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitLabel={submitLabel}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
