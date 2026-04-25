// "use client";

// import { useState } from "react";
// import { EMIRATES, VET_SPECIALITIES } from "@/src/constant";
// import {
//   inputClass,
//   labelClass,
// } from "../../../user/my-pets/components/modal/petInfo/constants";

// type WorkingHour = {
//   day: string;
//   open: string;
//   close: string;
//   closed: boolean;
// };

// type ServiceRate = {
//   service: string;
//   priceFrom: number;
//   priceTo: number;
// };

// type VetFormData = {
//   name: string;
//   clinicName: string;
//   emirate: string;
//   area: string;
//   address: string;
//   phone: string;
//   whatsapp: string;
//   email: string;
//   website: string;
//   coverPhoto: string;
//   about: string;
//   googleMapsUrl: string;
//   specialities: string[];
//   workingHours: WorkingHour[];
//   serviceRates: ServiceRate[];
//   rating: number;
//   reviewCount: number;
// };

// interface VetFormProps {
//   initial: VetFormData;
//   onSubmit: (data: VetFormData) => Promise<void>;
//   isLoading: boolean;
// }

// export default function VetForm({
//   initial,
//   onSubmit,
//   isLoading,
// }: VetFormProps) {
//   const [form, setForm] = useState<VetFormData>(initial);

//   const toggleSpeciality = (s: string) => {
//     setForm((f) => ({
//       ...f,
//       specialities: f.specialities.includes(s)
//         ? f.specialities.filter((x) => x !== s)
//         : [...f.specialities, s],
//     }));
//   };

//   const updateHours = (
//     index: number,
//     field: keyof WorkingHour,
//     value: string | boolean,
//   ) => {
//     setForm((f) => {
//       const updated = [...f.workingHours];
//       updated[index] = { ...updated[index], [field]: value };
//       return { ...f, workingHours: updated };
//     });
//   };

//   const updateRate = (
//     index: number,
//     field: keyof ServiceRate,
//     value: string | number,
//   ) => {
//     setForm((f) => {
//       const updated = [...f.serviceRates];
//       updated[index] = {
//         ...updated[index],
//         [field]: field === "service" ? (value as string) : Number(value),
//       };
//       return { ...f, serviceRates: updated };
//     });
//   };

//   const addRate = () =>
//     setForm((f) => ({
//       ...f,
//       serviceRates: [
//         ...f.serviceRates,
//         { service: "", priceFrom: 0, priceTo: 0 },
//       ],
//     }));

//   const removeRate = (index: number) =>
//     setForm((f) => ({
//       ...f,
//       serviceRates: f.serviceRates.filter((_, i) => i !== index),
//     }));

//   return (
//     <div className="p-6 flex flex-col gap-5">
//       {/* Basic Info - Same as before */}
//       <div className="grid grid-cols-2 gap-3">
//         <div className="col-span-2">
//           <label className={labelClass}>Clinic Name *</label>
//           <input
//             value={form.clinicName}
//             onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
//             className={inputClass}
//             placeholder="e.g. German Vet Clinic"
//           />
//         </div>
//         <div>
//           <label className={labelClass}>Doctor Name *</label>
//           <input
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             className={inputClass}
//             placeholder="Dr. Ahmed..."
//           />
//         </div>
//         <div>
//           <label className={labelClass}>Emirate *</label>
//           <select
//             value={form.emirate}
//             onChange={(e) => setForm({ ...form, emirate: e.target.value })}
//             className={inputClass}
//           >
//             {EMIRATES.map((e) => (
//               <option
//                 key={e.value}
//                 value={e.value}
//                 className="dark:text-gray-800 dark:bg-steel-blue/30 text-[11px]"
//               >
//                 {e.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={labelClass}>Area *</label>
//           <input
//             value={form.area}
//             onChange={(e) => setForm({ ...form, area: e.target.value })}
//             className={inputClass}
//             placeholder="Jumeirah"
//           />
//         </div>
//         <div>
//           <label className={labelClass}>Phone *</label>
//           <input
//             value={form.phone}
//             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//             className={inputClass}
//             placeholder="+971 4 ..."
//           />
//         </div>
//         <div className="col-span-2">
//           <label className={labelClass}>Address *</label>
//           <input
//             value={form.address}
//             onChange={(e) => setForm({ ...form, address: e.target.value })}
//             className={inputClass}
//             placeholder="Full address"
//           />
//         </div>
//         <div>
//           <label className={labelClass}>WhatsApp</label>
//           <input
//             value={form.whatsapp}
//             onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
//             className={inputClass}
//             placeholder="+971 50 ..."
//           />
//         </div>
//         <div>
//           <label className={labelClass}>Email</label>
//           <input
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             className={inputClass}
//             placeholder="info@clinic.com"
//           />
//         </div>
//         <div>
//           <label className={labelClass}>Website</label>
//           <input
//             value={form.website}
//             onChange={(e) => setForm({ ...form, website: e.target.value })}
//             className={inputClass}
//             placeholder="https://..."
//           />
//         </div>
//         <div>
//           <label className={labelClass}>Cover Photo URL</label>
//           <input
//             value={form.coverPhoto}
//             onChange={(e) => setForm({ ...form, coverPhoto: e.target.value })}
//             className={inputClass}
//             placeholder="Cloudinary URL"
//           />
//         </div>
//         <div className="col-span-2">
//           <label className={labelClass}>Google Maps URL</label>
//           <input
//             value={form.googleMapsUrl}
//             onChange={(e) =>
//               setForm({ ...form, googleMapsUrl: e.target.value })
//             }
//             className={inputClass}
//             placeholder="https://maps.google.com/..."
//           />
//         </div>
//         <div className="col-span-2">
//           <label className={labelClass}>About</label>
//           <textarea
//             value={form.about}
//             onChange={(e) => setForm({ ...form, about: e.target.value })}
//             className={`${inputClass} resize-none h-20`}
//             placeholder="Clinic description..."
//           />
//         </div>
//         <div>
//           <label className={labelClass}>Rating (0-5)</label>
//           <input
//             type="number"
//             min={0}
//             max={5}
//             step={0.1}
//             value={form.rating}
//             onChange={(e) =>
//               setForm({ ...form, rating: parseFloat(e.target.value) })
//             }
//             className={inputClass}
//           />
//         </div>
//         <div>
//           <label className={labelClass}>Review Count</label>
//           <input
//             type="number"
//             min={0}
//             value={form.reviewCount}
//             onChange={(e) =>
//               setForm({ ...form, reviewCount: parseInt(e.target.value) })
//             }
//             className={inputClass}
//           />
//         </div>
//       </div>
//       {/* Specialities */}
//       <div>
//         <label className={labelClass}>Specialities *</label>
//         <div className="flex flex-wrap gap-2">
//           {VET_SPECIALITIES.map((s) => (
//             <button
//               key={s}
//               type="button"
//               onClick={() => toggleSpeciality(s)}
//               className={`text-xs px-3 py-1 rounded-full border transition-all ${form.specialities.includes(s) ? "bg-[#4682B4]/30 border-[#4682B4] text-[#4682B4]" : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"}`}
//             >
//               {s}
//             </button>
//           ))}
//         </div>
//       </div>
//       {/* Working Hours */}
//       <div>
//         <label className={labelClass}>Working Hours</label>
//         <div className="flex flex-col gap-2 md:w-1/2 w-full mt-3 ms-3">
//           {form.workingHours.map((h, i) => (
//             <div key={h.day} className="flex items-center gap-2 text-sm">
//               <span className="text-steel-blue  dark:text-lime-burst font-semibold  w-20 text-xs">
//                 {h.day.slice(0, 3)}
//               </span>
//               <input
//                 type="time"
//                 value={h.open}
//                 disabled={h.closed}
//                 onChange={(e) => updateHours(i, "open", e.target.value)}
//                 className={`${inputClass} w-28 text-xs ${h.closed ? "opacity-30" : ""}`}
//               />
//               <span className="dark:text-white/70 text-gray-500">–</span>
//               <input
//                 type="time"
//                 value={h.close}
//                 disabled={h.closed}
//                 onChange={(e) => updateHours(i, "close", e.target.value)}
//                 className={`${inputClass} w-28 text-xs ${h.closed ? "opacity-30" : ""}`}
//               />
//               <label className="flex items-center gap-1 dark:text-white/70 text-gray-500 text-xs cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={h.closed}
//                   onChange={(e) => updateHours(i, "closed", e.target.checked)}
//                   className="accent-[#FF4D6D]"
//                 />
//                 Closed
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* Service Rates */}
//       <div>
//         <div className="flex items-center justify-between mb-2">
//           <label className={labelClass}>Service Rates</label>
//           <button
//             type="button"
//             onClick={addRate}
//             className="text-[#4682B4] text-xs hover:underline"
//           >
//             + Add
//           </button>
//         </div>
//         <div className="flex flex-col gap-2">
//           {form.serviceRates.map((r, i) => (
//             <div key={i} className="flex gap-2 items-center">
//               <input
//                 value={r.service}
//                 onChange={(e) => updateRate(i, "service", e.target.value)}
//                 className={`${inputClass} flex-1`}
//                 placeholder="Service name"
//               />
//               <input
//                 type="number"
//                 value={r.priceFrom}
//                 onChange={(e) => updateRate(i, "priceFrom", e.target.value)}
//                 className={`${inputClass} w-20`}
//                 placeholder="From"
//               />
//               <input
//                 type="number"
//                 value={r.priceTo}
//                 onChange={(e) => updateRate(i, "priceTo", e.target.value)}
//                 className={`${inputClass} w-20`}
//                 placeholder="To"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeRate(i)}
//                 className="text-[#FF4D6D] hover:opacity-80 text-sm px-1"
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* </div> */}

//       {/* Submit Buttons */}
//       <div className="flex gap-3 pt-4 border-t border-white/10">
//         <button
//           type="button"
//           onClick={() => window.history.back()}
//           className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/60 font-bold text-sm hover:bg-white/5 transition-colors"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={() => onSubmit(form)}
//           disabled={isLoading}
//           className="flex-1 py-2.5 rounded-xl bg-lime-burst text-gray-900 font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
//         >
//           {isLoading ? "Saving..." : "Save Clinic"}
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useForm } from "react-hook-form";
import { EMIRATES, VET_SPECIALITIES } from "@/src/constant";
import {
  inputClass,
  labelClass,
} from "../../../user/my-pets/components/modal/petInfo/constants";

type WorkingHour = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

type ServiceRate = {
  service: string;
  priceFrom: number;
  priceTo: number;
};

type PriceRange = {
  basePrice: number;
  maxPrice: number;
};

type VetFormData = {
  name: string;
  clinicName: string;
  emirate: string;
  area: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  coverPhoto: string;
  about: string;
  googleMapsUrl: string;
  specialities: string[];
  workingHours: WorkingHour[];
  priceRange: PriceRange;
  rating: number;
  reviewCount: number;
};

interface VetFormProps {
  initial: VetFormData;
  onSubmit: (data: VetFormData) => Promise<void>;
  isLoading: boolean;
}

export default function VetForm({
  initial,
  onSubmit,
  isLoading,
}: VetFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VetFormData>({
    defaultValues: initial,
  });

  // For dynamic arrays
  // const {
  //   fields: rateFields,
  //   append,
  //   remove,
  // } = useFieldArray({
  //   control,
  //   name: "serviceRates",
  // });

  const specialities = watch("specialities");

  const toggleSpeciality = (speciality: string) => {
    const current = specialities || [];
    const updated = current.includes(speciality)
      ? current.filter((s) => s !== speciality)
      : [...current, speciality];
    setValue("specialities", updated);
  };

  // const addRate = () => {
  //   append({ service: "", priceFrom: 0, priceTo: 0 });
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={labelClass}>Clinic Name *</label>
          <input
            {...register("clinicName", { required: "Clinic name is required" })}
            className={inputClass}
            placeholder="e.g. German Vet Clinic"
          />
          {errors.clinicName && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.clinicName.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Doctor Name *</label>
          <input
            {...register("name", { required: "Doctor name is required" })}
            className={inputClass}
            placeholder="Dr. Ahmed..."
          />
          {errors.name && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Emirate *</label>
          <select
            {...register("emirate", { required: "Emirate is required" })}
            className={inputClass}
          >
            <option value="">Select Emirate</option>
            {EMIRATES.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
          {errors.emirate && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.emirate.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Area *</label>
          <input
            {...register("area", { required: "Area is required" })}
            className={inputClass}
            placeholder="Jumeirah"
          />
          {errors.area && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.area.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Phone *</label>
          <input
            {...register("phone", { required: "Phone number is required" })}
            className={inputClass}
            placeholder="+971 4 ..."
          />
          {errors.phone && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Address *</label>
          <input
            {...register("address", { required: "Address is required" })}
            className={inputClass}
            placeholder="Full address"
          />
          {errors.address && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>WhatsApp</label>
          <input
            {...register("whatsapp")}
            className={inputClass}
            placeholder="+971 50 ..."
          />
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input
            {...register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className={inputClass}
            placeholder="info@clinic.com"
          />
          {errors.email && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Website</label>
          <input
            {...register("website")}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className={labelClass}>Cover Photo URL</label>
          <input
            {...register("coverPhoto")}
            className={inputClass}
            placeholder="Cloudinary URL"
          />
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Google Maps URL</label>
          <input
            {...register("googleMapsUrl")}
            className={inputClass}
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div className="col-span-2">
          <label className={labelClass}>About</label>
          <textarea
            {...register("about")}
            className={`${inputClass} resize-none h-20`}
            placeholder="Clinic description..."
          />
        </div>

        <div>
          <label className={labelClass}>Rating (0-5)</label>
          <input
            type="number"
            step="0.1"
            {...register("rating", { min: 0, max: 5 })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Review Count</label>
          <input
            type="number"
            {...register("reviewCount", { min: 0 })}
            className={inputClass}
          />
        </div>
      </div>
      {/* Specialities */}
      <div>
        <label className={labelClass}>Specialities *</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {VET_SPECIALITIES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSpeciality(s)}
              className={`text-xs px-3 py-1 rounded-xl border  transition-all ${
                specialities?.includes(s)
                  ? "bg-steel-blue/30 border-steel-blue text-steel-blue "
                  : "bg-steel-blue/10 dark:bg-lime-burst/30 border-white/10 text-gray-500 dark:text-white/80 hover:border-white/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {errors.specialities && (
          <p className="text-red-500 text-[10px] mt-1">
            {errors.specialities.message}
          </p>
        )}
      </div>
      {/* Working Hours */}
      <div>
        <label className={labelClass}>Working Hours</label>
        <div className="flex flex-col gap-2 md:w-1/2 w-full mt-3 ms-3">
          {initial.workingHours.map((h, i) => (
            <div key={h.day} className="flex items-center gap-2 text-sm">
              <span className="text-steel-blue dark:text-lime-burst font-semibold w-20 text-xs">
                {h.day.slice(0, 3)}
              </span>
              <input
                type="time"
                {...register(`workingHours.${i}.open`)}
                disabled={watch(`workingHours.${i}.closed`)}
                className={`${inputClass} w-28 text-xs`}
              />
              <span className="dark:text-white/70 text-gray-500">–</span>
              <input
                type="time"
                {...register(`workingHours.${i}.close`)}
                disabled={watch(`workingHours.${i}.closed`)}
                className={`${inputClass} w-28 text-xs`}
              />
              <label className="flex items-center gap-1 dark:text-white/70 text-gray-500 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  {...register(`workingHours.${i}.closed`)}
                  className="accent-coral"
                />
                Closed
              </label>
            </div>
          ))}
        </div>
      </div>
      {/* Service Rates */}
      {/* //service fee per service */}
      {/* <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass}>Service Rates</label>
          <button
            type="button"
            onClick={addRate}
            className="text-steel-blue text-xs hover:underline"
          >
            + Add
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {rateFields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input
                {...register(`serviceRates.${i}.service`)}
                className={`${inputClass} flex-1`}
                placeholder="Service name"
              />
              <input
                type="number"
                {...register(`serviceRates.${i}.priceFrom`, {
                  valueAsNumber: true,
                })}
                className={`${inputClass} w-20`}
                placeholder="From"
              />
              <input
                type="number"
                {...register(`serviceRates.${i}.priceTo`, {
                  valueAsNumber: true,
                })}
                className={`${inputClass} w-20`}
                placeholder="To"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-coral hover:opacity-80 text-sm px-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div> */}
      <div>
        <label className={labelClass}>Price Range (AED)</label>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* From */}
          <div className="flex-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-gray-600 dark:text-white/40">
                From
              </label>
              <input
                type="number"
                {...register("priceRange.basePrice", { valueAsNumber: true })}
                className={inputClass}
                placeholder="e.g., 50"
              />
              <p className="text-[9px] text-steel-blue/60 dark:text-white/40">
                Minimum consultation fee
              </p>
            </div>
          </div>

          {/* Up to */}
          <div className="flex-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-gray-600 dark:text-white/40">
                Up to
              </label>
              <input
                type="number"
                {...register("priceRange.maxPrice", { valueAsNumber: true })}
                className={inputClass}
                placeholder="e.g., 500"
              />
              <p className="text-[9px] text-steel-blue/60 dark:text-white/40">
                Maximum consultation fee
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4 border-t border-white/10 mb-8">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all duration-200
    border-steel-blue/30 dark:border-white/20 
    text-gray-700 dark:text-white/80 
    hover:bg-steel-blue/5 dark:hover:bg-white/10
    bg-white dark:bg-transparent"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-xl bg-lime-burst text-gray-900 font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Clinic"}
        </button>
      </div>
    </form>
  );
}
