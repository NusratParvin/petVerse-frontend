"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useGetSingleVetQuery } from "@/src/redux/features/vets/vetsApi";
import { speciesEmoji } from "@/src/types";
import { motion, AnimatePresence } from "framer-motion";
import { Rating } from "next-flex-rating";

import GoogleMap from "@/src/components/shared/googleMap";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Skeleton,
  Tooltip,
} from "@heroui/react";

import {
  ChevronLeft,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Clock,
  BadgeCheck,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

/*  helpers  */
const formatEmirate = (e: string) =>
  e
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

/*  Loading skeleton  */
const LoadingSkeleton = () => (
  <div className="p-4 md:p-8 space-y-5 max-w-7xl mx-auto">
    {/* <Skeleton className="h-6 w-36 rounded-md" /> */}
    <Skeleton className="h-56 w-full rounded-md" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-32 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-40 rounded-md" />
        <Skeleton className="h-52 rounded-md" />
      </div>
    </div>
  </div>
);

/*  Page  */
const VetDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: vet, isLoading } = useGetSingleVetQuery(id);
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = vet?.about && vet.about.length > 100;

  if (isLoading) return <LoadingSkeleton />;

  if (!vet)
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 gap-3">
        <p className="text-default-400 text-sm">Vet not found.</p>
        <Link
          href="/user/vets"
          className="text-primary text-sm hover:underline"
        >
          ← Back to Vet Finder
        </Link>
      </div>
    );

  const todayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });
  const todayHours = vet.workingHours?.find((h) => h.day === todayName);
  const isOpenToday = todayHours && !todayHours.closed;

  const aboutText = vet?.about || "";

  return (
    <div className="flex flex-col gap-3 md:gap-3 p-3 max-w-full   mx-auto pb-24 md:pb-16">
      {/*  Hero cover  */}
      <div className="relative h-52 sm:h-64 md:h-72 rounded-md overflow-hidden border border-default-100 shadow-md">
        {vet.coverPhoto ? (
          <img
            src={vet.coverPhoto}
            alt={vet.clinicName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-default-100 flex items-center justify-center text-7xl opacity-20">
            🏥
          </div>
        )}

        {/* gradient overlay */}
        <div className="absolute inset-0 " />
        {/* bg-gradient-to-t from-black/80 via-black/50 to-transparent */}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
          {/* title inside hero */}
          <div className="p-6 flex items-end justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight drop-shadow-lg">
                {vet.clinicName}
              </h1>
              <p className="text-white/80 text-sm mt-0.5 flex items-center gap-1.5 drop-shadow">
                <MapPin className="w-3.5 h-3.5" />
                {vet.area}, {formatEmirate(vet.emirate)}
              </p>

              {/* Rating + open status */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Rating value={vet.rating} readOnly={true} size={16} />
                <span className="text-white/80 text-[11px] font-medium drop-shadow">
                  {vet.rating} ({vet.reviewCount} reviews)
                </span>

                {/* Open/Closed Chip with proper theme support */}
                <Chip
                  variant="flat"
                  size="md"
                  className={`text-white/80 font-bold px-2 text-xs 
            ${
              isOpenToday
                ? "bg-emerald-600/70  border-emerald-500"
                : "bg-red-600/70   border-red-500"
            }
            backdrop-blur-sm border font-semibold shadow-sm
          `}
                >
                  {isOpenToday
                    ? `Open • Closes at ${todayHours!.close}`
                    : "Closed Today"}
                </Chip>
              </div>
            </div>

            {vet.isClaimed && (
              <Chip
                variant="flat"
                size="sm"
                startContent={<BadgeCheck className="w-3.5 h-3.5" />}
                className="
          bg-emerald-500/20 
          text-emerald-400 
          border-emerald-500/30
          backdrop-blur-sm 
          border 
          font-semibold
          shrink-0
          shadow-sm
        "
              >
                Verified
              </Chip>
            )}
          </div>
        </div>
        {/*  Back  */}
        <div className="absolute top-5 right-6 flex items-end justify-between gap-3 z-50">
          <Button
            variant="light"
            size="sm"
            startContent={<ChevronLeft className="w-4 h-4" />}
            onPress={() => router.back()}
            className="w-fit text-white font-semibold hover:bg-black/60 -ml-1 bg-black/50"
          >
            Back to Vet Finder
          </Button>
        </div>
      </div>

      {/*  Main grid  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/*  Left column  */}
        <div className="lg:col-span-2 flex flex-col gap-2">
          {/* About */}

          <Card
            shadow="none"
            className="border border-default-100  rounded-md  bg-default-50 dark:bg-black/20"
          >
            <CardHeader className="pb-1 pt-5 px-5">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-sm font-semibold text-default-700 tracking-wide uppercase">
                  About
                </h2>
                {shouldTruncate && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 hover:bg-default-100 rounded-full transition-all"
                  >
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown className="w-4 h-4 text-default-500" />
                    </motion.div>
                  </button>
                )}
              </div>
            </CardHeader>

            <CardBody className="pt-2 px-5 pb-5 overflow-hidden">
              <motion.div
                animate={{ height: isExpanded ? "auto" : "auto" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <p className="text-default-600 dark:text-default-400 text-sm leading-relaxed">
                  {shouldTruncate && !isExpanded
                    ? `${aboutText.slice(0, 110)}...`
                    : aboutText || "No description available"}
                </p>
              </motion.div>
            </CardBody>
          </Card>

          {/* Specialities */}
          <Card
            shadow="none"
            className="border border-default-100  rounded-md bg-default-50 dark:bg-black/20"
          >
            <CardHeader className="pb-1 pt-5 px-5">
              <h2 className="text-sm font-semibold text-default-700 tracking-wide uppercase">
                Specialities
              </h2>
            </CardHeader>
            <CardBody className="pt-2 px-5 pb-5">
              <div className="flex flex-wrap gap-2">
                {vet.specialities.map((s) => (
                  <Chip
                    key={s}
                    variant="flat"
                    color="primary"
                    size="sm"
                    className="font-medium"
                  >
                    {speciesEmoji[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Chip>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Map */}
          <Card
            shadow="none"
            className="border border-default-100  rounded-md  bg-default-50 dark:bg-black/20"
          >
            <CardHeader className="pb-1 pt-5 px-5">
              <h2 className="text-sm font-semibold text-default-700 tracking-wide uppercase">
                Location
              </h2>
            </CardHeader>
            <CardBody className="pt-2 px-5 pb-5 space-y-4">
              {vet.latitude && vet.longitude && (
                <div className="rounded-xl overflow-hidden border border-default-100 h-52">
                  <GoogleMap
                    lat={vet.latitude}
                    lon={vet.longitude}
                    clinicName={vet.clinicName}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1">
                {vet.latitude && vet.longitude ? (
                  <>
                    <Button
                      as="a"
                      href={`https://www.google.com/maps/dir/?api=1&destination=${vet.latitude},${vet.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="light"
                      className="rounded-md border border-steel-blue/50 dark:border-lime-burst/50 w-36 dark:bg-lime-burst/10 bg-white"
                      startContent={<span>🗺️</span>}
                    >
                      Google Maps
                    </Button>
                    <Button
                      as="a"
                      href={`https://www.waze.com/ul?ll=${vet.latitude},${vet.longitude}&navigate=yes`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="light"
                      className="rounded-md border border-steel-blue/50 dark:border-lime-burst/50 w-36 dark:bg-lime-burst/10 bg-white "
                      startContent={<span>🚗</span>}
                    >
                      Waze
                    </Button>
                  </>
                ) : (
                  vet.googleMapsUrl && (
                    <Button
                      as="a"
                      href={vet.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="light"
                      startContent={<MapPin className="w-3.5 h-3.5" />}
                    >
                      View on Google Maps
                    </Button>
                  )
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/*  Right column  */}
        <div className="flex flex-col gap-3">
          {/* Contact */}
          <Card
            shadow="none"
            className="border border-default-100  rounded-md  bg-default-50 dark:bg-black/20"
          >
            <CardHeader className="pb-1 pt-5 px-5">
              <h2 className="text-sm font-semibold text-default-700 tracking-wide uppercase">
                Contact
              </h2>
            </CardHeader>
            <CardBody className="pt-2 px-5 pb-5">
              <div className="flex flex-col gap-3">
                {vet.phone && (
                  <Tooltip content="Call clinic" placement="left" size="sm">
                    <a
                      href={`tel:${vet.phone}`}
                      className="flex items-center gap-3 text-default-600 hover:text-primary text-sm transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                        <Phone className="w-3.5 h-3.5 text-primary" />
                      </span>
                      <span>{vet.phone}</span>
                    </a>
                  </Tooltip>
                )}

                {vet.whatsapp && (
                  <Tooltip
                    content="Chat on WhatsApp"
                    placement="left"
                    size="sm"
                  >
                    <a
                      href={`https://wa.me/${vet.whatsapp.replace(/\s+/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-default-600 hover:text-success text-sm transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-xl bg-success-50 flex items-center justify-center shrink-0 group-hover:bg-success-100 transition-colors">
                        <MessageCircle className="w-3.5 h-3.5 text-success" />
                      </span>
                      <span>WhatsApp</span>
                    </a>
                  </Tooltip>
                )}

                {vet.email && (
                  <Tooltip content="Send email" placement="left" size="sm">
                    <a
                      href={`mailto:${vet.email}`}
                      className="flex items-center gap-3 text-default-600 hover:text-primary text-sm transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                      </span>
                      <span className="truncate">{vet.email}</span>
                    </a>
                  </Tooltip>
                )}

                {vet.website && (
                  <Tooltip content="Visit website" placement="left" size="sm">
                    <a
                      href={vet.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-default-600 hover:text-primary text-sm transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                        <Globe className="w-3.5 h-3.5 text-primary" />
                      </span>
                      <span>Website</span>
                    </a>
                  </Tooltip>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Working Hours */}
          <Card
            shadow="none"
            className="border border-default-100 rounded-md  bg-default-50 dark:bg-black/20"
          >
            <CardHeader className="pb-1 pt-5 px-5">
              <h2 className="text-sm font-semibold text-default-700 tracking-wide uppercase flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Hours
              </h2>
            </CardHeader>
            <CardBody className="pt-2 px-5 pb-5">
              <div className="flex flex-col gap-1">
                {vet.workingHours?.map((h, i) => (
                  <div key={h.day}>
                    <div
                      className={`flex justify-between items-center py-1.5 text-xs rounded-lg px-2 -mx-2 transition-colors ${
                        h.day === todayName
                          ? "bg-primary-50 text-primary font-semibold"
                          : "text-default-500"
                      }`}
                    >
                      <span className="w-8">{h.day.slice(0, 3)}</span>
                      <span>
                        {h.closed ? (
                          <Chip
                            size="sm"
                            variant="flat"
                            color="danger"
                            className="h-5 text-[11px]"
                          >
                            Closed
                          </Chip>
                        ) : (
                          `${h.open} – ${h.close}`
                        )}
                      </span>
                    </div>
                    {i < vet.workingHours!.length - 1 && (
                      <Divider className="opacity-40" />
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Claim CTA */}
          {!vet.isClaimed && (
            <Card
              shadow="none"
              className="border border-dashed border-default-200 bg-default-50 dark:bg-black/20"
            >
              <CardBody className="p-5 text-center flex flex-col items-center gap-2">
                <p className="text-default-400 text-xs">Is this your clinic?</p>
                <Button
                  variant="light"
                  color="primary"
                  size="sm"
                  className="font-medium"
                >
                  Claim Your Listing →
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VetDetailPage;
