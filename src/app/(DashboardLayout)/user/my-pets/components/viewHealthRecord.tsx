"use client";

import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import {
  Calendar,
  DollarSign,
  User,
  FileText,
  CheckCircle,
  Edit2,
} from "lucide-react";
import { THealthRecord } from "@/src/types";
import { RECORD_TYPES } from "../components/modal/healthRecord/constants";

interface ViewHealthRecordProps {
  isOpen: boolean;
  onClose: () => void;
  healthRecord: THealthRecord;
  onEdit?: () => void;
}

export default function ViewHealthRecord({
  isOpen,
  onClose,
  healthRecord,
  onEdit,
}: ViewHealthRecordProps) {
  if (!healthRecord) return null;

  const typeDetails = RECORD_TYPES.find((t) => t.value === healthRecord.type);
  const Icon = typeDetails?.icon || FileText;
  const typeLabel = typeDetails?.label || "Other";

  const formatDate = (date?: string | Date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEdit = () => {
    onClose();
    onEdit?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="md"
      classNames={{
        backdrop: "bg-black/50 backdrop-blur-sm",
        base: "border border-steel-blue/20 dark:border-white/10 bg-white dark:bg-[#0d1020] rounded-lg max-h-[85vh]  p-4 ",
        // closeButton:
        //   "top-3.5 right-3.5 text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all",
      }}
    >
      <ModalContent className="px-8">
        {/* ── Header ── */}
        <ModalHeader className="px-0 pt-6 pb-0">
          <div className="w-full bg-gray-50 dark:bg-gray-500/10 border-b border-black/10 dark:border-white/10 px-4 pt-4 pb-3.5 relative rounded-lg">
            <div className="flex items-center gap-3 pr-16">
              <div className="w-9 h-9 rounded-xl bg-teal-500 dark:bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                <Icon size={28} className="text-teal dark:text-teal" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-[0.08em] mb-0.5">
                  {typeLabel}
                </p>
                <h2 className="text-[14px] font-semibold text-gray-900 dark:text-white leading-tight truncate">
                  {healthRecord.title}
                </h2>
              </div>
            </div>

            <span className="absolute top-4 right-2 inline-flex items-center gap-1 text-[10px] font-semibold bg-green/10 dark:bg-green/10 text-green dark:text-green px-4 py-0.5 rounded-full border border-green dark:border-green/20">
              <CheckCircle size={9} />
              Completed
            </span>

            {onEdit && (
              <button
                onClick={handleEdit}
                className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 dark:text-white/30 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-all"
              >
                <Edit2 size={13} />
              </button>
            )}
          </div>
        </ModalHeader>

        <ModalBody className="px-0 pt-2  pb-4 overflow-y-auto custom-scrollbar space-y-0">
          {/* ── Date cards ── */}
          <div className="grid grid-cols-2 gap-2">
            {/* Date */}
            <div className="bg-gray-50 dark:bg-white/10 rounded-lg border border-black/10 dark:border-white/20 px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-gray-400 dark:text-white/35 mb-1">
                Date
              </p>
              <div className="flex items-center gap-1.5">
                <Calendar
                  size={11}
                  className="text-gray-400 dark:text-white/30"
                />
                <p className="text-[12px] font-semibold text-gray-800 dark:text-white">
                  {formatDate(healthRecord.date)}
                </p>
              </div>
            </div>

            {/* Next due */}
            {healthRecord.nextDueDate && (
              <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20 px-3 py-2.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-amber-500 dark:text-amber-400/70 mb-1">
                  Next due
                </p>
                <div className="flex items-center gap-1.5">
                  <Calendar
                    size={11}
                    className="text-amber-500 dark:text-amber-400"
                  />
                  <p className="text-[12px] font-semibold text-amber-700 dark:text-amber-400">
                    {formatDate(healthRecord.nextDueDate)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Field rows ── */}
          <div className="rounded-lg border border-black/10 dark:border-white/10 overflow-hidden">
            {/* Vet / Clinic */}
            {healthRecord.vetName && (
              <div className="flex items-start gap-3 px-3 py-2.5 bg-white dark:bg-white/[0.02] border-b border-black/[0.05] dark:border-white/[0.06]">
                <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User
                    size={12}
                    className="text-gray-400 dark:text-white/35"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-gray-400 dark:text-white/35 mb-0.5">
                    Vet / Clinic
                  </p>
                  <p className="text-[12px] font-medium text-gray-800 dark:text-white/85">
                    {healthRecord.vetName}
                  </p>
                </div>
              </div>
            )}

            {/* Cost */}
            {healthRecord.cost && (
              <div className="flex items-start gap-3 px-3 py-2.5 bg-white dark:bg-white/[0.02] border-b border-black/[0.05] dark:border-white/[0.06]">
                <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <DollarSign
                    size={12}
                    className="text-gray-400 dark:text-white/35"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-gray-400 dark:text-white/35 mb-0.5">
                    Cost
                  </p>
                  <p className="text-[12px] font-medium text-gray-800 dark:text-white/85">
                    AED {healthRecord.cost.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            {healthRecord.notes && (
              <div className="flex items-start gap-3 px-3 py-2.5 bg-white dark:bg-white/[0.02]">
                <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText
                    size={12}
                    className="text-gray-400 dark:text-white/35"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-gray-400 dark:text-white/35 mb-0.5">
                    Notes
                  </p>
                  <p className="text-[12px] font-medium text-gray-700 dark:text-white/80 leading-relaxed">
                    {healthRecord.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
