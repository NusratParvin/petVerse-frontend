"use client";

import { useState } from "react";
import {
  useGetVetsQuery,
  useCreateVetMutation,
  useUpdateVetMutation,
  useDeleteVetMutation,
  TVet,
} from "@/redux/features/vets/vetsApi";

const EMIRATES = [
  { value: "dubai", label: "Dubai" },
  { value: "abu-dhabi", label: "Abu Dhabi" },
  { value: "sharjah", label: "Sharjah" },
  { value: "ajman", label: "Ajman" },
  { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
  { value: "fujairah", label: "Fujairah" },
  { value: "umm-al-quwain", label: "Umm Al Quwain" },
];

const ALL_SPECIALITIES = [
  "dogs",
  "cats",
  "birds",
  "fish",
  "rabbits",
  "reptiles",
  "exotic",
  "small-animals",
  "emergency",
  "surgery",
  "dental",
  "dermatology",
  "ophthalmology",
  "nutrition",
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_FORM = {
  name: "",
  clinicName: "",
  emirate: "dubai",
  area: "",
  address: "",
  phone: "",
  whatsapp: "",
  email: "",
  website: "",
  coverPhoto: "",
  about: "",
  googleMapsUrl: "",
  specialities: [] as string[],
  workingHours: DAYS.map((day) => ({
    day,
    open: "09:00",
    close: "18:00",
    closed: false,
  })),
  serviceRates: [{ service: "Consultation", priceFrom: 150, priceTo: 300 }],
  rating: 4.5,
  reviewCount: 0,
};

type FormState = typeof DEFAULT_FORM;

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4682B4]/60 transition-all placeholder:text-white/30";

function VetFormModal({
  initial,
  onClose,
  onSave,
  loading,
}: {
  initial: FormState;
  onClose: () => void;
  onSave: (data: FormState) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<FormState>(initial);

  const toggleSpeciality = (s: string) => {
    setForm((f) => ({
      ...f,
      specialities: f.specialities.includes(s)
        ? f.specialities.filter((x) => x !== s)
        : [...f.specialities, s],
    }));
  };

  const updateHours = (i: number, field: string, value: string | boolean) => {
    setForm((f) => {
      const wh = [...f.workingHours];
      wh[i] = { ...wh[i], [field]: value };
      return { ...f, workingHours: wh };
    });
  };

  const updateRate = (i: number, field: string, value: string | number) => {
    setForm((f) => {
      const sr = [...f.serviceRates];
      sr[i] = {
        ...sr[i],
        [field]: field === "service" ? value : Number(value),
      };
      return { ...f, serviceRates: sr };
    });
  };

  const addRate = () =>
    setForm((f) => ({
      ...f,
      serviceRates: [
        ...f.serviceRates,
        { service: "", priceFrom: 0, priceTo: 0 },
      ],
    }));
  const removeRate = (i: number) =>
    setForm((f) => ({
      ...f,
      serviceRates: f.serviceRates.filter((_, idx) => idx !== i),
    }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0a1628] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2
            className="text-white font-bold text-lg"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            {initial.clinicName ? "Edit Vet Clinic" : "Add Vet Clinic"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-white/60 text-xs mb-1 block">
                Clinic Name *
              </label>
              <input
                value={form.clinicName}
                onChange={(e) =>
                  setForm({ ...form, clinicName: e.target.value })
                }
                className={inputClass}
                placeholder="e.g. German Vet Clinic"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">
                Doctor Name *
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="Dr. Ahmed..."
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">
                Emirate *
              </label>
              <select
                value={form.emirate}
                onChange={(e) => setForm({ ...form, emirate: e.target.value })}
                className={inputClass}
              >
                {EMIRATES.map((e) => (
                  <option
                    key={e.value}
                    value={e.value}
                    className="bg-[#020812]"
                  >
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">Area *</label>
              <input
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className={inputClass}
                placeholder="Jumeirah"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">
                Phone *
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
                placeholder="+971 4 ..."
              />
            </div>
            <div className="col-span-2">
              <label className="text-white/60 text-xs mb-1 block">
                Address *
              </label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputClass}
                placeholder="Full address"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">
                WhatsApp
              </label>
              <input
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className={inputClass}
                placeholder="+971 50 ..."
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                placeholder="info@clinic.com"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">
                Website
              </label>
              <input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">
                Cover Photo URL
              </label>
              <input
                value={form.coverPhoto}
                onChange={(e) =>
                  setForm({ ...form, coverPhoto: e.target.value })
                }
                className={inputClass}
                placeholder="Cloudinary URL"
              />
            </div>
            <div className="col-span-2">
              <label className="text-white/60 text-xs mb-1 block">
                Google Maps URL
              </label>
              <input
                value={form.googleMapsUrl}
                onChange={(e) =>
                  setForm({ ...form, googleMapsUrl: e.target.value })
                }
                className={inputClass}
                placeholder="https://maps.google.com/..."
              />
            </div>
            <div className="col-span-2">
              <label className="text-white/60 text-xs mb-1 block">About</label>
              <textarea
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
                className={`${inputClass} resize-none h-20`}
                placeholder="Clinic description..."
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">
                Rating (0-5)
              </label>
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: parseFloat(e.target.value) })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">
                Review Count
              </label>
              <input
                type="number"
                min={0}
                value={form.reviewCount}
                onChange={(e) =>
                  setForm({ ...form, reviewCount: parseInt(e.target.value) })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Specialities */}
          <div>
            <label className="text-white/60 text-xs mb-2 block">
              Specialities *
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_SPECIALITIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpeciality(s)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${form.specialities.includes(s) ? "bg-[#4682B4]/30 border-[#4682B4] text-[#4682B4]" : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <label className="text-white/60 text-xs mb-2 block">
              Working Hours
            </label>
            <div className="flex flex-col gap-2">
              {form.workingHours.map((h, i) => (
                <div key={h.day} className="flex items-center gap-2 text-sm">
                  <span className="text-white/60 w-20 text-xs">
                    {h.day.slice(0, 3)}
                  </span>
                  <input
                    type="time"
                    value={h.open}
                    disabled={h.closed}
                    onChange={(e) => updateHours(i, "open", e.target.value)}
                    className={`${inputClass} w-28 text-xs ${h.closed ? "opacity-30" : ""}`}
                  />
                  <span className="text-white/30">–</span>
                  <input
                    type="time"
                    value={h.close}
                    disabled={h.closed}
                    onChange={(e) => updateHours(i, "close", e.target.value)}
                    className={`${inputClass} w-28 text-xs ${h.closed ? "opacity-30" : ""}`}
                  />
                  <label className="flex items-center gap-1 text-white/50 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={h.closed}
                      onChange={(e) =>
                        updateHours(i, "closed", e.target.checked)
                      }
                      className="accent-[#FF4D6D]"
                    />
                    Closed
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Service Rates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/60 text-xs">Service Rates</label>
              <button
                type="button"
                onClick={addRate}
                className="text-[#4682B4] text-xs hover:underline"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {form.serviceRates.map((r, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={r.service}
                    onChange={(e) => updateRate(i, "service", e.target.value)}
                    className={`${inputClass} flex-1`}
                    placeholder="Service name"
                  />
                  <input
                    type="number"
                    value={r.priceFrom}
                    onChange={(e) => updateRate(i, "priceFrom", e.target.value)}
                    className={`${inputClass} w-20`}
                    placeholder="From"
                  />
                  <input
                    type="number"
                    value={r.priceTo}
                    onChange={(e) => updateRate(i, "priceTo", e.target.value)}
                    className={`${inputClass} w-20`}
                    placeholder="To"
                  />
                  <button
                    type="button"
                    onClick={() => removeRate(i)}
                    className="text-[#FF4D6D] hover:opacity-80 text-sm px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-[#B8FF2E] text-[#020812] font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Clinic"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminVetsPage() {
  const { data: vets, isLoading } = useGetVetsQuery();
  const [createVet, { isLoading: creating }] = useCreateVetMutation();
  const [updateVet, { isLoading: updating }] = useUpdateVetMutation();
  const [deleteVet] = useDeleteVetMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingVet, setEditingVet] = useState<TVet | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleSave = async (form: FormState) => {
    try {
      if (editingVet) {
        await updateVet({
          id: editingVet._id,
          body: form as Partial<TVet>,
        }).unwrap();
      } else {
        await createVet(form as Partial<TVet>).unwrap();
      }
      setShowModal(false);
      setEditingVet(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteVet(id).unwrap();
    setDeleteConfirm(null);
  };

  const openEdit = (vet: TVet) => {
    setEditingVet(vet);
    setShowModal(true);
  };

  const formatEmirate = (e: string) =>
    e
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-white text-2xl font-bold"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Vet Clinics
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {vets?.length ?? 0} clinics in database
          </p>
        </div>
        <button
          onClick={() => {
            setEditingVet(null);
            setShowModal(true);
          }}
          className="bg-[#B8FF2E] text-[#020812] font-bold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          + Add Clinic
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-white/40 text-xs font-medium px-5 py-3">
                Clinic
              </th>
              <th className="text-left text-white/40 text-xs font-medium px-4 py-3">
                Emirate
              </th>
              <th className="text-left text-white/40 text-xs font-medium px-4 py-3">
                Specialities
              </th>
              <th className="text-left text-white/40 text-xs font-medium px-4 py-3">
                Rating
              </th>
              <th className="text-left text-white/40 text-xs font-medium px-4 py-3">
                Status
              </th>
              <th className="text-right text-white/40 text-xs font-medium px-5 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-4 rounded bg-white/5 animate-pulse" />
                    </td>
                  </tr>
                ))
              : vets?.map((vet) => (
                  <tr
                    key={vet._id}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {vet.coverPhoto && (
                          <img
                            src={vet.coverPhoto}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover opacity-80"
                          />
                        )}
                        <div>
                          <p className="text-white text-sm font-medium">
                            {vet.clinicName}
                          </p>
                          <p className="text-white/40 text-xs">{vet.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-white/60 text-sm">
                      {formatEmirate(vet.emirate)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {vet.specialities.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] bg-[#4682B4]/15 border border-[#4682B4]/25 text-[#4682B4] px-1.5 py-0.5 rounded-full capitalize"
                          >
                            {s}
                          </span>
                        ))}
                        {vet.specialities.length > 2 && (
                          <span className="text-[10px] text-white/30">
                            +{vet.specialities.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[#F5D020] text-sm">
                        ★ {vet.rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {vet.isClaimed ? (
                        <span className="text-[10px] bg-[#00E5CC]/15 border border-[#00E5CC]/30 text-[#00E5CC] px-2 py-0.5 rounded-full">
                          Claimed
                        </span>
                      ) : (
                        <span className="text-[10px] bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full">
                          Unclaimed
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(vet)}
                          className="text-xs text-[#4682B4] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(vet._id)}
                          className="text-xs text-[#FF4D6D] hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <VetFormModal
          initial={
            editingVet
              ? {
                  name: editingVet.name,
                  clinicName: editingVet.clinicName,
                  emirate: editingVet.emirate,
                  area: editingVet.area,
                  address: editingVet.address,
                  phone: editingVet.phone,
                  whatsapp: editingVet.whatsapp || "",
                  email: editingVet.email || "",
                  website: editingVet.website || "",
                  coverPhoto: editingVet.coverPhoto || "",
                  about: editingVet.about || "",
                  googleMapsUrl: editingVet.googleMapsUrl || "",
                  specialities: editingVet.specialities,
                  workingHours: editingVet.workingHours?.length
                    ? editingVet.workingHours
                    : DEFAULT_FORM.workingHours,
                  serviceRates: editingVet.serviceRates?.length
                    ? editingVet.serviceRates
                    : DEFAULT_FORM.serviceRates,
                  rating: editingVet.rating,
                  reviewCount: editingVet.reviewCount,
                }
              : DEFAULT_FORM
          }
          onClose={() => {
            setShowModal(false);
            setEditingVet(null);
          }}
          onSave={handleSave}
          loading={creating || updating}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-white font-bold mb-2">Delete Clinic?</h3>
            <p className="text-white/50 text-sm mb-5">
              This will soft-delete the clinic and remove it from the public
              listing.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-white/10 rounded-xl text-white/60 text-sm hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-[#FF4D6D] rounded-xl text-white font-bold text-sm hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
