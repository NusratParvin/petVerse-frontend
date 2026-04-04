"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  useGetSinglePetQuery,
  useDeletePetMutation,
  useDeleteHealthRecordMutation,
} from "@/src/redux/features/pets/petsApi";
import EditPetModal from "../components/editPetModal";
import AddHealthRecordModal from "../components/addHealthRecordModal";

const speciesEmoji: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🦜",
  fish: "🐠",
  rabbit: "🐇",
  reptile: "🦎",
  other: "🐾",
};

const recordIcon: Record<string, string> = {
  vaccine: "💉",
  "vet-visit": "🏥",
  medication: "💊",
  grooming: "✂️",
  other: "📋",
};

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
  const { theme } = useTheme();
  const isDark = theme === "petverse-dark";
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading } = useGetSinglePetQuery(id);
  const [deletePet] = useDeletePetMutation();
  const [deleteHealthRecord] = useDeleteHealthRecordMutation();
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showEditPet, setShowEditPet] = useState(false);

  const pet = data?.data;

  const cardStyle = {
    background: isDark ? "rgba(255,255,255,0.04)" : "#ffffff",
    border: isDark
      ? "1px solid rgba(255,255,255,0.07)"
      : "1px solid rgba(70,130,180,0.1)",
    boxShadow: isDark ? "none" : "0 2px 10px rgba(70,130,180,0.05)",
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

  const handleDeleteRecord = async (recordId: string) => {
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
      <div className="p-6 text-center">
        <p
          style={{
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(30,30,60,0.4)",
          }}
        >
          Pet not found
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-5 text-sm transition-colors hover:opacity-80"
        style={{
          color: isDark ? "rgba(255,255,255,0.4)" : "rgba(30,30,60,0.4)",
        }}
      >
        <ArrowLeft size={14} />
        My Pets
      </button>

      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden mb-5" style={cardStyle}>
        {/* Banner */}
        <div
          className="h-32 flex items-center justify-center text-6xl relative"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(70,130,180,0.15), rgba(30,50,120,0.1))"
              : "linear-gradient(135deg, rgba(70,130,180,0.08), rgba(30,100,200,0.05))",
          }}
        >
          {pet.profilePhoto ? (
            <img
              src={pet.profilePhoto}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          ) : (
            speciesEmoji[pet.species] || "🐾"
          )}

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => setShowEditPet(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(255,255,255,0.8)",
                color: isDark ? "#fff" : "#4682B4",
              }}
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={handleDeletePet}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: isDark
                  ? "rgba(255,77,109,0.2)"
                  : "rgba(255,77,109,0.1)",
                color: "#FF4D6D",
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h1
            className="font-grotesk text-xl font-bold mb-1"
            style={{ color: isDark ? "rgba(255,255,255,0.92)" : "#1a1a2e" }}
          >
            {pet.name}
          </h1>
          <p
            className="text-sm mb-4"
            style={{
              color: isDark ? "rgba(255,255,255,0.35)" : "rgba(30,30,60,0.45)",
            }}
          >
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
                className="rounded-xl p-3 text-center"
                style={{
                  background: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(70,130,180,0.06)",
                }}
              >
                <div
                  className="font-grotesk font-bold text-sm"
                  style={{ color: isDark ? "#B8FF2E" : "#4682B4" }}
                >
                  {stat.val}
                </div>
                <div
                  className="text-[10px] mt-0.5"
                  style={{
                    color: isDark
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(30,30,60,0.4)",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Health Passport */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-grotesk font-bold text-sm"
              style={{ color: isDark ? "rgba(255,255,255,0.85)" : "#1a1a2e" }}
            >
              Health Passport
            </h2>
            <button
              onClick={() => setShowAddRecord(true)}
              className="text-[10px] font-semibold px-3 py-1 rounded-full transition-all"
              style={{
                background: isDark
                  ? "rgba(184,255,46,0.12)"
                  : "rgba(70,130,180,0.1)",
                color: isDark ? "#B8FF2E" : "#4682B4",
                border: isDark
                  ? "1px solid rgba(184,255,46,0.2)"
                  : "1px solid rgba(70,130,180,0.2)",
              }}
            >
              + Add Record
            </button>
          </div>

          {pet.healthRecords?.length === 0 ? (
            <div className="text-center py-8">
              <p
                className="text-xs"
                style={{
                  color: isDark
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(30,30,60,0.35)",
                }}
              >
                No health records yet
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {pet.healthRecords?.map((record: any, idx: number) => {
                const daysLeft = record.nextDueDate
                  ? getDaysLeft(record.nextDueDate)
                  : null;
                const dueColor =
                  daysLeft === null
                    ? null
                    : daysLeft <= 3
                      ? "#FF4D6D"
                      : daysLeft <= 7
                        ? "#4682B4"
                        : "#B8FF2E";
                const dueDark =
                  daysLeft === null
                    ? null
                    : daysLeft <= 3
                      ? "#FF4D6D"
                      : daysLeft <= 7
                        ? "#4682B4"
                        : "#5aab1e";

                return (
                  <div
                    key={record._id || idx}
                    className="flex gap-3 py-2.5 relative group"
                    style={{
                      borderBottom:
                        idx < pet.healthRecords.length - 1
                          ? `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(70,130,180,0.07)"}`
                          : "none",
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5"
                      style={{
                        background: isDark
                          ? "rgba(70,130,180,0.15)"
                          : "rgba(70,130,180,0.1)",
                      }}
                    >
                      {recordIcon[record.type] || "📋"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold"
                        style={{
                          color: isDark ? "rgba(255,255,255,0.85)" : "#1a1a2e",
                        }}
                      >
                        {record.title}
                      </p>
                      <p
                        className="text-[10px] mt-0.5"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.28)"
                            : "rgba(30,30,60,0.38)",
                        }}
                      >
                        {new Date(record.date).toLocaleDateString()}
                        {record.vetName && ` · ${record.vetName}`}
                        {record.cost && ` · AED ${record.cost}`}
                      </p>
                      {daysLeft !== null && (
                        <p
                          className="text-[10px] font-medium mt-1"
                          style={{ color: isDark ? dueColor! : dueDark! }}
                        >
                          {daysLeft <= 0
                            ? "Overdue!"
                            : `Next due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
                        </p>
                      )}
                    </div>

                    {/* Delete record */}
                    <button
                      onClick={() => handleDeleteRecord(record._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{
                        color: "#FF4D6D",
                        background: isDark
                          ? "rgba(255,77,109,0.1)"
                          : "rgba(255,77,109,0.08)",
                      }}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pet Details */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <h2
            className="font-grotesk font-bold text-sm mb-4"
            style={{ color: isDark ? "rgba(255,255,255,0.85)" : "#1a1a2e" }}
          >
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
            ].map((row, idx, arr) => (
              <div
                key={row.label}
                className="flex justify-between items-center py-2"
                style={{
                  borderBottom:
                    idx < arr.length - 1
                      ? `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(70,130,180,0.07)"}`
                      : "none",
                }}
              >
                <span
                  className="text-xs"
                  style={{
                    color: isDark
                      ? "rgba(255,255,255,0.35)"
                      : "rgba(30,30,60,0.4)",
                  }}
                >
                  {row.label}
                </span>
                <span
                  className="text-xs font-medium capitalize"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.85)" : "#1a1a2e",
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
            {pet.microchipNumber && (
              <div
                className="mt-3 pt-3"
                style={{
                  borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(70,130,180,0.07)"}`,
                }}
              >
                <p
                  className="text-[10px] mb-1"
                  style={{
                    color: isDark
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(30,30,60,0.4)",
                  }}
                >
                  Microchip ID
                </p>
                <span
                  className="font-mono text-[11px] px-2 py-1 rounded-md"
                  style={{
                    background: isDark
                      ? "rgba(0,229,204,0.1)"
                      : "rgba(0,150,136,0.08)",
                    color: isDark ? "#00E5CC" : "#007a70",
                  }}
                >
                  {pet.microchipNumber}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddRecord && (
        <AddHealthRecordModal
          petId={id}
          onClose={() => setShowAddRecord(false)}
        />
      )}
      {showEditPet && (
        <EditPetModal pet={pet} onClose={() => setShowEditPet(false)} />
      )}
    </div>
  );
}
