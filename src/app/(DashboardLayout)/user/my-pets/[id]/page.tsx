"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, Plus, PawPrint, Pen } from "lucide-react";
import { toast } from "sonner";
import {
  useGetSinglePetQuery,
  useDeletePetMutation,
  useDeleteHealthRecordMutation,
} from "@/src/redux/features/pets/petsApi";
import { recordIcon, speciesEmoji, THealthRecord } from "@/src/types";
import EditPetModal from "../components/editPetModal";
import EditHealthRecord from "../components/editHealthRecord";

import AddHealthRecord from "../components/addHealthRecord";
function getDaysLeft(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function calculateAge(dob?: string) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  return years < 1 ? "< 1 yr" : `${years} yr${years > 1 ? "s" : ""}`;
}

export default function PetProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: petDetails, isLoading } = useGetSinglePetQuery(id);
  const [deletePet] = useDeletePetMutation();
  const [deleteHealthRecord] = useDeleteHealthRecordMutation();
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showEditPet, setShowEditPet] = useState(false);
  const [showEditRecord, setShowEditRecord] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<THealthRecord | null>(
    null,
  );

  const pet = petDetails?.data;

  const handleEditHealthRecord = (record: THealthRecord) => {
    // console.log(record);
    setSelectedRecord(record);
    setShowEditRecord(true);
  };

  const handleDeletePet = async () => {
    if (!confirm(`Delete ${pet?.name}? This cannot be undone.`)) return;
    try {
      await deletePet(id).unwrap();
      toast.success("Pet deleted");
      router.push("/user/pets");
    } catch {
      toast.error("Failed to delete pet");
    }
  };

  const handleDeleteHealthRecord = async (recordId: string) => {
    if (!confirm("Delete this health record?")) return;
    try {
      await deleteHealthRecord({ petId: id, recordId }).unwrap();
      toast.success("Record deleted");
    } catch {
      toast.error("Failed to delete record");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-2xl animate-pulse">🐾</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-white/40">
        Pet not found
      </div>
    );
  }

  const getDueColor = (daysLeft: number | null) => {
    if (daysLeft === null) return "";
    if (daysLeft <= 3) return "text-coral dark:text-coral";
    if (daysLeft <= 7) return "text-steel-blue dark:text-steel-blue";
    return "text-lime-burst dark:text-lime-burst";
  };

  return (
    <div className="px-3 py-1 w-full">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-500 dark:text-lime-burst hover:text-steel-blue dark:hover:text-white/90 transition-opacity"
      >
        <ArrowLeft size={14} />
        <div className="flex gap-1">
          My Pets
          <PawPrint size={15} className="mt-0.5" />
        </div>
      </button>

      {/* Hero card */}
      <div className="rounded-lg overflow-hidden mb-2 bg-white dark:bg-white/5 border border-steel-blue/10 dark:border-white/10 shadow-sm">
        {/* Banner */}
        <div className="h-32 flex items-center justify-center text-6xl relative bg-gradient-to-br from-steel-blue/10 to-steel-blue/5 dark:from-steel-blue/15 dark:to-steel-blue/5">
          {pet.profilePhoto ? (
            <img
              src={pet.profilePhoto}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{speciesEmoji[pet.species] || "🐾"}</span>
          )}

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => setShowEditPet(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-white/80 dark:bg-white/10 text-steel-blue dark:text-white hover:bg-white dark:hover:bg-white/20"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={handleDeletePet}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-coral/10 dark:bg-coral/20 text-coral hover:bg-coral/20 dark:hover:bg-coral/30"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h1 className="font-grotesk text-xl font-bold mb-1 text-gray-900 dark:text-white/90">
            {pet.name}
          </h1>
          <p className="text-sm mb-4 text-gray-500 dark:text-white/50">
            {pet.breed || pet.species}
            {pet.gender && ` · ${pet.gender}`}
            {pet.emirate &&
              ` · ${pet.emirate
                .split("-")
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}`}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { val: pet.weight ? `${pet.weight}kg` : "—", label: "Weight" },
              { val: calculateAge(pet.dateOfBirth) || "—", label: "Age" },
              { val: pet.healthRecords?.length || 0, label: "Records" },
              { val: pet.microchipNumber ? "✓" : "✗", label: "Chipped" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-3 text-center bg-steel-blue/5 dark:bg-white/5"
              >
                <div className="font-grotesk font-bold text-sm text-steel-blue dark:text-lime-burst">
                  {stat.val}
                </div>
                <div className="text-[10px] mt-0.5 text-gray-500 dark:text-white/30">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Health Passport */}
        <div className="rounded-lg p-5 bg-white dark:bg-white/5 border border-steel-blue/10 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-grotesk font-bold text-sm text-gray-900 dark:text-white/85">
              Health Passport
            </h2>
            <button
              onClick={() => setShowAddRecord(true)}
              className="text-[10px] font-semibold px-3 py-1 rounded-full transition-all bg-steel-blue/10 dark:bg-lime-burst/15 text-steel-blue dark:text-lime-burst border border-steel-blue/20 dark:border-lime-burst/25 hover:bg-steel-blue/20 dark:hover:bg-lime-burst/25"
            >
              + Add Record
            </button>
          </div>

          {pet.healthRecords?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-gray-500 dark:text-white/25">
                No health records yet
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {pet.healthRecords?.map((record: any, index: number) => {
                const daysLeft = record.nextDueDate
                  ? getDaysLeft(record.nextDueDate)
                  : null;
                const dueColor = getDueColor(daysLeft);

                return (
                  <div
                    key={record._id}
                    className="flex gap-3 py-2.5 relative group border-b border-steel-blue/10 dark:border-white/10 "
                  >
                    {/* Timeline dot */}
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5 bg-steel-blue/10 dark:bg-steel-blue/15">
                      {recordIcon[record.type] || "📋"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white/85">
                        {record.title}
                      </p>
                      <p className="text-[10px] mt-0.5 text-gray-500 dark:text-white/28">
                        {new Date(record.date).toLocaleDateString()}
                        {record.vetName && ` · ${record.vetName}`}
                        {record.cost && ` · AED ${record.cost}`}
                      </p>
                      {daysLeft !== null && (
                        <p
                          className={`text-[10px] font-medium mt-1 ${dueColor}`}
                        >
                          {daysLeft <= 0
                            ? "Overdue!"
                            : `Next due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditHealthRecord(record)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-green bg-green/10 dark:bg-green/20 hover:bg-green/20 dark:hover:bg-green/30"
                      >
                        <Pen size={11} />
                      </button>
                      {/* Delete record */}
                      <button
                        onClick={() => handleDeleteHealthRecord(record._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-coral bg-coral/10 dark:bg-coral/20 hover:bg-coral/20 dark:hover:bg-coral/30"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pet Details */}
        <div className="rounded-lg p-5 bg-white dark:bg-white/5 border border-steel-blue/10 dark:border-white/10">
          <h2 className="font-grotesk font-bold text-sm mb-4 text-gray-900 dark:text-white/85">
            Pet Details
          </h2>
          <div className="flex flex-col">
            {[
              { label: "Species", val: pet.species },
              { label: "Breed", val: pet.breed || "—" },
              { label: "Gender", val: pet.gender || "—" },
              {
                label: "Date of Birth",
                val: pet.dateOfBirth
                  ? new Date(pet.dateOfBirth).toLocaleDateString()
                  : "—",
              },
              { label: "Weight", val: pet.weight ? `${pet.weight} kg` : "—" },
              { label: "Emirate", val: pet.emirate || "—" },
              { label: "Neutered", val: pet.isNeutered ? "Yes" : "No" },
              {
                label: "WhatsApp Alerts",
                val: pet.whatsappAlerts ? "On" : "Off",
              },
              { label: "WhatsApp Number", val: pet.whatsappNumber || "—" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center py-2 border-b border-steel-blue/10 dark:border-white/5 last:border-0"
              >
                <span className="text-xs text-gray-500 dark:text-white/35">
                  {row.label}
                </span>
                <span className="text-xs font-medium capitalize text-gray-900 dark:text-white/85">
                  {row.val}
                </span>
              </div>
            ))}
            {pet.microchipNumber && (
              <div className="mt-3 pt-3 border-t border-steel-blue/10 dark:border-white/5">
                <p className="text-[10px] mb-1 text-gray-500 dark:text-white/30">
                  Microchip ID
                </p>
                <span className="font-mono text-[11px] px-2 py-1 rounded-md bg-teal/10 dark:bg-teal/10 text-teal dark:text-teal">
                  {pet.microchipNumber}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddRecord && (
        <AddHealthRecord
          petId={id}
          onClose={() => setShowAddRecord(false)}
          isOpen={showAddRecord}
        />
      )}
      {showEditPet && (
        <EditPetModal
          pet={pet}
          onClose={() => setShowEditPet(false)}
          isOpen={showEditPet}
        />
      )}
      {showEditRecord && selectedRecord && (
        <EditHealthRecord
          isOpen={showEditRecord}
          onClose={() => setShowEditRecord(false)}
          petId={id}
          healthRecord={selectedRecord}
        />
      )}
    </div>
  );
}
