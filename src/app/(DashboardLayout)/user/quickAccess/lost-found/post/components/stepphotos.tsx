import { CloudinaryUpload } from "@/src/components/home/cloudinaryUpload ";

interface StepPhotosProps {
  form: {
    photos: string[];
    type: string;
    species: string;
    petName: string;
    area: string;
    emirate: string;
    dateLostFound: string;
    posterPhone: string;
    color: string;
  };
  errors: Record<string, string>;
  // photos is string[], so updateField won't work directly — use this instead
  updatePhotos: (urls: string[]) => void;
}

export const StepPhotos = ({ form, errors, updatePhotos }: StepPhotosProps) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="text-center space-y-1">
      <div className="text-4xl">📸</div>
      <h2 className="text-lg font-bold">Add photos</h2>
      <p className="text-xs text-default-500">
        Photos help people recognise your pet faster
      </p>
    </div>

    {/* Upload component */}
    <CloudinaryUpload
      value={form.photos}
      onChange={(val) => updatePhotos(val as string[])}
      mode="multiple"
      maxImages={5}
      label="Pet photos (optional)"
      hint="Up to 5 photos · JPG, PNG, WEBP"
      error={errors.photos}
    />

    {/* Summary card */}
    <div className="rounded-lg border border-default-200 dark:border-white/10 bg-white dark:bg-black/20 p-4 space-y-2">
      <p className="font-bold text-sm text-gray-900 dark:text-white">
        ✅ Quick review
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-default-600 dark:text-default-400">
        <p>
          <span className="text-default-400">Type:</span> {form.type || "—"}
        </p>
        <p>
          <span className="text-default-400">Pet:</span> {form.species || "—"}
          {form.petName ? ` · ${form.petName}` : ""}
        </p>
        <p>
          <span className="text-default-400">Color:</span> {form.color || "—"}
        </p>
        <p>
          <span className="text-default-400">Location:</span> {form.area || "—"}
          , {form.emirate || "—"}
        </p>
        <p>
          <span className="text-default-400">Date:</span>{" "}
          {form.dateLostFound || "—"}
        </p>
        <p>
          <span className="text-default-400">Phone:</span>{" "}
          {form.posterPhone || "—"}
        </p>
      </div>
    </div>
  </div>
);
