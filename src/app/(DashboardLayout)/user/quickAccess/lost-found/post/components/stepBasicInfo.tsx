import { Button } from "@heroui/react";
import { SPECIES_OPTIONS } from "../page";

interface StepBasicInfoProps {
  form: { type: string; species: string };
  errors: Record<string, string>;
  updateField: (field: string, value: string) => void;
}

export const StepBasicInfo = ({
  form,
  errors,
  updateField,
}: StepBasicInfoProps) => (
  <div className="space-y-5">
    {/* Lost / Found */}
    <div>
      <p className="text-sm font-bold mb-2">Lost or found?</p>
      <div className="flex gap-3">
        <Button
          radius="sm"
          type="button"
          onPress={() => updateField("type", "lost")}
          startContent={
            <span className="text-xl">
              {form.type === "lost" ? "😢" : "😟"}
            </span>
          }
          className={`flex-1 py-2 h-auto font-bold transition-all duration-300
            ${
              form.type === "lost"
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 border border-rose-500"
                : "bg-gray-100 dark:bg-[#3a3a3a] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-rose-400 hover:shadow-sm"
            }
          `}
        >
          Lost
        </Button>
        <Button
          radius="sm"
          type="button"
          onPress={() => updateField("type", "found")}
          startContent={
            <span className="text-xl">
              {form.type === "found" ? "🙌" : "🔍"}
            </span>
          }
          className={`flex-1 py-2 h-auto font-bold transition-all duration-300
            ${
              form.type === "found"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 border border-emerald-500"
                : "bg-gray-100 dark:bg-[#3a3a3a] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-emerald-400 hover:shadow-sm"
            }
          `}
        >
          Found
        </Button>
      </div>
      {errors.type && (
        <p className="text-rose-500 text-xs mt-1">{errors.type}</p>
      )}
    </div>

    {/* Pet Type Grid */}
    <div>
      <p className="text-sm font-bold mb-2 text-steel-blue dark:text-white/90">
        Pet type
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {SPECIES_OPTIONS.map((s) => (
          <Button
            key={s.value}
            type="button"
            onPress={() => updateField("species", s.value)}
            className={`flex flex-col items-center py-3 h-auto transition-all duration-300
              ${
                form.species === s.value
                  ? "bg-gradient-to-br from-steel-blue to-[#5a9bd5] dark:from-lime-burst dark:to-[#c8ff80] text-white dark:text-black shadow-xl border border-steel-blue dark:border-lime-burst"
                  : "bg-white/80 dark:bg-[#4a4a4a]/80 backdrop-blur-sm border border-steel-blue/20 dark:border-lime-burst/20 hover:border-steel-blue/50 hover:shadow-md text-gray-700 dark:text-gray-300"
              }
            `}
            style={{
              boxShadow:
                form.species === s.value
                  ? "0 10px 25px -5px rgba(70,130,180,0.3)"
                  : "none",
            }}
          >
            <span className="text-3xl mb-1">{s.emoji}</span>
            <span className="text-xs capitalize font-bold">{s.label}</span>
          </Button>
        ))}
      </div>
      {errors.species && (
        <p className="text-rose-500 text-xs mt-1">{errors.species}</p>
      )}
    </div>
  </div>
);
