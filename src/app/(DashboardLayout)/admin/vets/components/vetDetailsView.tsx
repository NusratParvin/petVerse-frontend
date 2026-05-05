// components/VetDetailsView.tsx
import { TVet } from "@/src/types";
import { Chip, User } from "@heroui/react";
import { formatEmirate, formatPriceRange } from "./utils";

interface VetDetailsViewProps {
  vet: TVet;
}

export default function VetDetailsView({ vet }: VetDetailsViewProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Clinic info on left, Image on right */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left side - Clinic Info */}
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {vet.clinicName}
          </h2>
          {vet.name && (
            <p className="text-sm text-default-500 mt-1">
              Contact Person: {vet.name}
            </p>
          )}
          <div className="flex gap-2 mt-2">
            <Chip
              size="sm"
              variant="flat"
              classNames={{
                base: "bg-warning/10 text-warning-600 dark:text-warning-400",
              }}
            >
              ⭐ {vet.rating?.toFixed(1)} ({vet.reviewCount} reviews)
            </Chip>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="sm:flex-shrink-0">
          <img
            src={
              vet.coverPhoto ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(vet.clinicName)}&background=0D8F81&color=fff`
            }
            alt={vet.clinicName}
            className="w-full sm:w-48 h-48 sm:h-48 rounded-2xl object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Basic Information */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-foreground border-b border-divider pb-2">
            Basic Information
          </h3>

          <div>
            <label className="text-xs text-default-500 uppercase tracking-wider">
              Location
            </label>
            <p className="text-sm sm:text-base text-foreground mt-1 font-medium">
              {vet.area}, {formatEmirate(vet.emirate)}
            </p>
            <p className="text-xs sm:text-sm text-default-600 mt-1">
              {vet.address}
            </p>
          </div>

          <div>
            <label className="text-xs text-default-500 uppercase tracking-wider">
              Contact
            </label>
            <div className="space-y-1 mt-1">
              <p className="text-sm sm:text-base text-foreground flex items-center gap-2">
                <span className="text-default-500">📞</span> {vet.phone}
              </p>
              {vet.whatsapp && (
                <p className="text-sm sm:text-base text-foreground flex items-center gap-2">
                  <span className="text-default-500">💬</span> WhatsApp:{" "}
                  {vet.whatsapp}
                </p>
              )}
              {vet.email && (
                <p className="text-sm sm:text-base text-foreground flex items-center gap-2 break-all">
                  <span className="text-default-500">✉️</span> {vet.email}
                </p>
              )}
              {vet.website && (
                <p className="text-sm sm:text-base flex items-center gap-2">
                  <span className="text-default-500">🌐</span>
                  <a
                    href={
                      vet.website.startsWith("http")
                        ? vet.website
                        : `https://${vet.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-steel-blue dark:text-lime-burst hover:underline"
                  >
                    {vet.website}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-default-500 uppercase tracking-wider">
              Emergency
            </label>
            <div className="mt-1">
              <Chip
                size="sm"
                color={vet.emergency ? "danger" : "default"}
                variant={vet.emergency ? "solid" : "flat"}
                classNames={{
                  base: vet.emergency
                    ? "bg-danger-500 text-white"
                    : "border border-divider",
                }}
              >
                {vet.emergency
                  ? "🚨 24/7 Emergency Available"
                  : "No Emergency Service"}
              </Chip>
            </div>
          </div>

          <div>
            <label className="text-xs text-default-500 uppercase tracking-wider">
              Price Range
            </label>
            <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">
              {formatPriceRange(vet.priceRange)}
            </p>
            <p className="text-xs text-default-500 mt-1">
              *Approximate consultation fees
            </p>
          </div>
        </div>

        {/* Specialities (Now on the right, below the image) */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-foreground border-b border-divider pb-2">
            Specialities
          </h3>
          <div className="flex flex-wrap gap-2">
            {vet.specialities?.map((spec) => (
              <Chip
                key={spec}
                variant="flat"
                className="capitalize"
                classNames={{
                  base: "bg-default-100 dark:bg-default-800 text-default-700 dark:text-default-300",
                }}
              >
                {spec.replace("-", " ")}
              </Chip>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        {vet.workingHours && vet.workingHours.length > 0 && (
          <div className="space-y-3 sm:space-y-4 lg:col-span-2">
            <h3 className="text-base sm:text-lg font-semibold text-foreground border-b border-divider pb-2">
              Working Hours
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {vet.workingHours.map((day: any) => (
                <div
                  key={day.day}
                  className="flex justify-between items-center py-2 px-3 rounded-lg bg-default-50 dark:bg-default-100/5"
                >
                  <span className="font-medium text-sm text-foreground">
                    {day.day}
                  </span>
                  {day.closed ? (
                    <span className="text-xs sm:text-sm text-danger-500 font-medium">
                      Closed
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm text-foreground">
                      {day.open} - {day.close}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About */}
        {vet.about && (
          <div className="space-y-3 sm:space-y-4 lg:col-span-2">
            <h3 className="text-base sm:text-lg font-semibold text-foreground border-b border-divider pb-2">
              About
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm sm:text-base text-default-600 dark:text-default-400 leading-relaxed">
                {vet.about}
              </p>
            </div>
          </div>
        )}

        {/* Google Maps */}
        {vet.googleMapsUrl && (
          <div className="space-y-3 sm:space-y-4 lg:col-span-2">
            <h3 className="text-base sm:text-lg font-semibold text-foreground border-b border-divider pb-2">
              Location Map
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <a
                href={vet.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-steel-blue dark:text-lime-burst hover:underline text-sm sm:text-base"
              >
                <span>📍</span>
                View on Google Maps
                <span>→</span>
              </a>
              <span className="text-xs text-default-500 hidden sm:inline">
                |
              </span>
              <p className="text-xs text-default-500 break-all">
                {vet.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
