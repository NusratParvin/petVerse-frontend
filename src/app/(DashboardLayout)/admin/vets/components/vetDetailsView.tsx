import { TVet } from "@/src/types";
import { Chip } from "@heroui/react";
import { formatEmirate, formatPriceRange } from "./utils";
import GoogleMap from "@/src/components/shared/googleMap";

export default function VetDetailsView({ vet }: { vet: TVet }) {
  return (
    <div className="space-y-4 sm:space-y-6 pb-16">
      {/* Header  */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left side - Clinic Info */}
        <div className="flex-1">
          <h2 className="text-sm sm:text-xl font-bold text-foreground">
            {vet.clinicName}
          </h2>
          {vet.name && (
            <p className="text-sm text-default-500 mt-3">
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
        <div className="sm:flex-shrink-0 me-6">
          <img
            src={
              vet.coverPhoto ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(vet.clinicName)}&background=0D8F81&color=fff`
            }
            alt={vet.clinicName}
            className="w-full sm:w-56 h-40 sm:h-40 rounded-lg object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Basic Information */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-sm sm:text-base font-semibold text-foreground border-b border-divider pb-2">
            Basic Information
          </h3>

          <div>
            <label className="text-xs text-default-500 uppercase tracking-wider">
              Location
            </label>
            <p className="text-sm sm:text-sm text-foreground mt-1 font-medium">
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
              <p className="text-sm sm:text-sm text-foreground flex items-center gap-2">
                <span className="text-default-500">📞</span> {vet.phone}
              </p>
              {vet.whatsapp && (
                <p className="text-sm sm:text-sm text-foreground flex items-center gap-2">
                  <span className="text-default-500">💬</span> WhatsApp:{" "}
                  {vet.whatsapp}
                </p>
              )}
              {vet.email && (
                <p className="text-sm sm:text-sm text-foreground flex items-center gap-2 break-all">
                  <span className="text-default-500">✉️</span> {vet.email}
                </p>
              )}
              {vet.website && (
                <p className="text-sm sm:text-sm flex items-center gap-2">
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

          {/* <div>
            <label className="text-xs text-default-500 uppercase tracking-wider">
              Emergency
            </label>
            <div className="mt-1">
              <Chip
                size="sm"
                color={vet.emergency ? "success" : "default"}
                variant={vet.emergency ? "solid" : "flat"}
                classNames={{
                  base: vet.emergency
                    ? "bg-success-600/80 text-white px-3"
                    : "border border-divider",
                }}
              >
                {vet.emergency
                  ? "🚨 24/7 Emergency Available"
                  : "No Emergency Service"}
              </Chip>
            </div>
          </div> */}

          {/* <div>
            <label className="text-xs text-default-500 uppercase tracking-wider">
              Price Range
            </label>
            <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">
              {formatPriceRange(vet.priceRange)}
            </p>
            <p className="text-xs text-default-500 mt-1">
              *Approximate consultation fees
            </p>
          </div> */}
        </div>

        {/* Specialities  */}
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground border-b border-divider pb-2">
              Specialities
            </h3>
            <div className="flex flex-wrap gap-2 pt-3">
              {vet.specialities?.map((spec) => (
                <Chip
                  key={spec}
                  variant="flat"
                  className="capitalize"
                  classNames={{
                    base: "bg-lime-burst/40   text-default-700 dark:text-white",
                  }}
                >
                  {spec.replace("-", " ")}
                </Chip>
              ))}
            </div>{" "}
          </div>

          <div>
            <label className="text-xs text-default-500 uppercase tracking-wider">
              Emergency
            </label>
            <div className="mt-1">
              <Chip
                size="sm"
                color={vet.emergency ? "success" : "default"}
                variant={vet.emergency ? "solid" : "flat"}
                classNames={{
                  base: vet.emergency
                    ? "bg-success-600/80 text-white px-3"
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

        {/* About */}
        {vet.about && (
          <div className="space-y-3 sm:space-y-4 lg:col-span-2">
            <h3 className="text-sm sm:text-base font-semibold text-foreground border-b border-divider pb-2">
              About
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm sm:text-sm text-default-600 dark:text-default-400 leading-relaxed">
                {vet.about}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-12 col-span-2">
          {/* Working Hours */}
          {vet.workingHours && vet.workingHours.length > 0 && (
            <div className="space-y-3 sm:space-y-3 ">
              <h3 className="text-sm sm:text-base font-semibold text-foreground border-b border-divider pb-2">
                Working Hours
              </h3>
              <div className="">
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

          {/* Google Maps */}
          <div className="space-y-3 sm:space-y-3 ">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm sm:text-base font-semibold text-foreground border-b border-divider pb-2">
                Location Map
              </h3>
              {/* 🗺️ Map Preview */}
              {vet.latitude && vet.longitude && (
                <div className="rounded-md overflow-hidden border border-gray-200 dark:border-white/10">
                  <GoogleMap
                    lat={vet.latitude}
                    lon={vet.longitude}
                    clinicName={vet.clinicName}
                  />
                </div>
              )}

              {/* 🚀 Navigation Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                {vet.latitude && vet.longitude ? (
                  <>
                    {/* Google Maps */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${vet.latitude},${vet.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-steel-blue/90 dark:border-lime-burst/60 text-steel-blue dark:text-lime-burst font-semibold  transition w-36"
                    >
                      🗺️ Google Maps
                    </a>

                    {/* Waze */}
                    <a
                      href={`https://www.waze.com/ul?ll=${vet.latitude},${vet.longitude}&navigate=yes`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-steel-blue/90 dark:border-lime-burst/60 text-steel-blue dark:text-lime-burst font-semibold w-36 transition"
                    >
                      🚗 Waze
                    </a>
                  </>
                ) : (
                  vet.googleMapsUrl && (
                    <a
                      href={vet.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-steel-blue dark:text-lime-burst hover:underline"
                    >
                      📍 View on Google Maps →
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
