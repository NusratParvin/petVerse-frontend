"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardBody, Button, Chip, Divider, Spinner } from "@heroui/react";
import { Rating } from "next-flex-rating";

import { useGetInsuranceProviderByIdQuery } from "@/src/redux/features/insurance/insuranceApi";
import {
  BADGE_DISPLAY,
  COVERAGE_LABELS,
  getBadgeColorClass,
  getBadgeDisplay,
} from "@/src/types";
import ReviewSection from "./components/reviewSection";
import { getBadgeStyle } from "../page";

// Main Component
export default function ProviderDetailPage() {
  const params = useParams();

  const providerId = params.id as string;

  const {
    data: provider,
    isLoading: isLoadingProvider,
    isError,
  } = useGetInsuranceProviderByIdQuery(providerId);

  if (isLoadingProvider) {
    return (
      <div className="min-h-screen bg-white dark:bg-transparent flex items-center justify-center">
        <Spinner size="lg" label="Loading provider details..." />
      </div>
    );
  }

  if (isError || !provider) {
    return (
      <div className="min-h-screen bg-white dark:bg-transparent flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
            Provider not found.
          </p>
          <Link
            href="/user/quickAccess/insurance"
            className="text-steel-blue text-sm hover:underline"
          >
            ← Back to Insurances
          </Link>
        </div>
      </div>
    );
  }

  const avgRating = provider.avgRating ?? 0;
  const reviewCount = provider.reviewCount ?? 0;

  return (
    <div className="min-h-screen bg-white dark:bg-transparent text-gray-900 dark:text-white p-3 sm:p-4 transition-colors mb-16">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
          {/* Back link with left arrow */}
          <Link
            href="/user/quickAccess/insurance"
            className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs hover:text-steel-blue dark:hover:text-lime-burst transition-colors w-fit"
          >
            ← Back to Insurances
          </Link>

          {/* Find Plan link with right arrow */}
          <Link
            href="/user/quickAccess/insurance/finder"
            className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs hover:text-steel-blue dark:hover:text-lime-burst transition-colors w-fit"
          >
            Find Best Plan for My Pet →
          </Link>
        </div>

        {/* Provider Header Card */}
        <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md shadow-sm mb-4">
          <CardBody className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Logo + name */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-md bg-gray-100 dark:bg-white/10 flex items-center justify-center text-3xl flex-shrink-0">
                  {provider.logo}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {provider.name}
                    </h1>
                    {provider.badge && (
                      <Chip
                        size="sm"
                        className="text-[10px] font-bold px-2 py-0.5 h-auto"
                        style={{
                          backgroundColor: getBadgeStyle(provider.badge).bg,
                          color: getBadgeStyle(provider.badge).color,
                        }}
                      >
                        {BADGE_DISPLAY[provider.badge]}{" "}
                      </Chip>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Plans: {provider.plans.join(" · ")}
                  </p>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <Rating value={avgRating} readOnly={true} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {avgRating.toFixed(1)} from {reviewCount} PetVerse
                        reviews
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex-shrink-0 text-left sm:text-right">
                <p className="text-steel-blue dark:text-lime-burst font-bold text-lg">
                  AED {provider.priceFrom}–{provider.priceTo}
                  <span className="text-gray-400 text-xs font-normal">
                    {" "}
                    /mo
                  </span>
                </p>
                <p className="text-gray-400 text-xs mb-3">
                  Up to AED {provider.annualLimit.toLocaleString()}/yr
                </p>
                <Button
                  as="a"
                  href={provider.website}
                  target="_blank"
                  size="sm"
                  className="bg-steel-blue text-white text-sm px-6 font-medium rounded-md"
                >
                  Get Quote →
                </Button>
              </div>
            </div>

            {/* About */}
            <Divider className="my-4" />
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {provider.about}
            </p>
          </CardBody>
        </Card>

        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          {[
            { label: "Reimbursement", value: `${provider.reimbursement}%` },
            { label: "Claims processed", value: provider.claimsIn },
            { label: "Max pet age", value: `${provider.maxAgeYears} yrs` },
            { label: "Min age", value: `${provider.minAgeWeeks} wks` },
          ].map((s) => (
            <Card
              key={s.label}
              className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md shadow-none"
            >
              <CardBody className="p-3 text-center">
                <p className="text-steel-blue dark:text-lime-burst font-bold text-sm">
                  {s.value}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">
                  {s.label}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Coverage Flags */}
        <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md shadow-sm mb-4">
          <CardBody className="p-3 sm:p-4">
            <h2 className="font-bold text-sm text-gray-900 dark:text-white mb-3">
              What's Covered
            </h2>
            <div className="flex flex-wrap gap-2">
              {provider.coverageFlags.map((flag) => (
                <Chip
                  key={flag}
                  size="sm"
                  className="text-xs px-3 py-1 h-auto bg-steel-blue/10 dark:bg-steel-blue/20 text-steel-blue border border-steel-blue/30 font-medium"
                >
                  ✓ {COVERAGE_LABELS[flag]}
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Conditions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Covered conditions */}
          <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md shadow-sm">
            <CardBody className="p-3 sm:p-4">
              <h2 className="font-bold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 text-[10px]">
                  ✓
                </span>
                Covered Conditions
              </h2>
              <ul className="space-y-1.5">
                {provider.coveredConditions.map((c) => (
                  <li
                    key={c}
                    className="text-xs text-gray-700 dark:text-gray-200 flex items-center gap-2"
                  >
                    <span className="text-green-500 flex-shrink-0">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Excluded conditions */}
          <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md shadow-sm">
            <CardBody className="p-3 sm:p-4">
              <h2 className="font-bold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-500 dark:text-red-400 text-[10px]">
                  ✕
                </span>
                Exclusions
              </h2>
              <ul className="space-y-1.5">
                {provider.excludedConditions.map((c) => (
                  <li
                    key={c}
                    className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2"
                  >
                    <span className="text-red-400 flex-shrink-0">✕</span>
                    {c}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md shadow-sm mb-4">
          <CardBody className="p-3 sm:p-4">
            <h2 className="font-bold text-sm text-gray-900 dark:text-white mb-3">
              Contact
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${provider.phone}`}
                className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 hover:text-steel-blue transition-colors"
              >
                📞 {provider.phone}
              </a>
              <a
                href={`mailto:${provider.email}`}
                className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 hover:text-steel-blue transition-colors"
              >
                ✉️ {provider.email}
              </a>
            </div>
          </CardBody>
        </Card>

        {/* Reviews Section */}
        <ReviewSection providerId={providerId} />
      </div>
    </div>
  );
}
