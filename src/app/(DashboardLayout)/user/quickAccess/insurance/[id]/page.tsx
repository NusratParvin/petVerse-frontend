"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Divider,
  Input,
  Textarea,
  Spinner,
  Avatar,
} from "@heroui/react";

import {
  useGetProviderReviewsQuery,
  useSubmitInsuranceReviewMutation,
} from "@/src/redux/features/insurance/insuranceApi";
import { PROVIDERS, badgeClasses, COVERAGE_LABELS } from "@/src/types";

// ── Star rating input ─────────────────────────────────────────────────────────
function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
        >
          <svg
            className={`w-7 h-7 transition-colors ${
              i <= (hovered || value)
                ? "text-[#F5D020]"
                : "text-gray-300 dark:text-gray-600"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ── Static stars display ──────────────────────────────────────────────────────
function Stars({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) {
  const sz = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`${sz} ${i <= Math.round(rating) ? "text-[#F5D020]" : "text-gray-300 dark:text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProviderDetailPage() {
  const { providerId } = useParams<{ providerId: string }>();
  console.log(providerId);
  // Find provider from local data
  const provider = PROVIDERS.find((p) => p.id === providerId);

  // Fetch reviews from backend
  const {
    data: reviewsData,
    refetch,
    isLoading: isLoadingReviews,
  } = useGetProviderReviewsQuery(providerId);
  const reviews: Review[] = reviewsData?.data?.reviews ?? [];
  const avgRating: number = reviewsData?.data?.avgRating ?? 0;
  const reviewCount: number = reviewsData?.data?.count ?? 0;

  // Submit review mutation
  const [submitReview, { isLoading: isSubmitting }] =
    useSubmitInsuranceReviewMutation();

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    text: "",
    planUsed: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Handle review submit
  async function handleSubmitReview() {
    if (reviewForm.rating === 0) {
      setSubmitError("Please select a star rating.");
      return;
    }
    if (reviewForm.text.trim().length < 10) {
      setSubmitError("Please write at least 10 characters.");
      return;
    }
    setSubmitError("");
    try {
      await submitReview({
        providerId,
        rating: reviewForm.rating,
        text: reviewForm.text,
        planUsed: reviewForm.planUsed,
      }).unwrap();
      setSubmitted(true);
      setReviewForm({ rating: 0, text: "", planUsed: "" });
      refetch();
    } catch {
      setSubmitError("Failed to submit. Please try again.");
    }
  }

  // 404 guard
  if (!provider) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#020812] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
            Provider not found.
          </p>
          <Link
            href="/user/insurance"
            className="text-steel-blue text-sm hover:underline"
          >
            ← Back to Compare Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#020812] text-gray-900 dark:text-white font-[Outfit,sans-serif] px-3 sm:px-6 py-6 transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* ── Back link ── */}
        <Link
          href="/user/insurance"
          className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs hover:text-gray-900 dark:hover:text-white transition-colors mb-5"
        >
          ← Back to Compare Plans
        </Link>

        {/* ── Provider Header Card ── */}
        <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm mb-4">
          <CardBody className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Logo + name */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-3xl flex-shrink-0">
                  {provider.logo}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {provider.name}
                    </h1>
                    <Chip
                      size="sm"
                      className={`text-[10px] font-bold px-2 py-0.5 h-auto ${badgeClasses(provider.badgeColor)}`}
                    >
                      {provider.badge}
                    </Chip>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Plans: {provider.plans.join(" · ")}
                  </p>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <Stars rating={avgRating} size="sm" />
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
                  Up to {provider.annualLimit}/yr
                </p>
                <Button
                  as="a"
                  href={provider.website}
                  target="_blank"
                  size="sm"
                  className="bg-steel-blue text-white text-sm font-semibold px-5 py-2 h-auto rounded-xl"
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

        {/* ── Key Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          {[
            { label: "Reimbursement", value: provider.reimbursement },
            { label: "Claims processed", value: provider.claimsIn },
            { label: "Max pet age", value: `${provider.maxAgeYears} yrs` },
            { label: "Min age", value: `${provider.minAgeWeeks} wks` },
          ].map((s) => (
            <Card
              key={s.label}
              className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-none"
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

        {/* ── Coverage Flags ── */}
        <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm mb-4">
          <CardBody className="p-4 sm:p-5">
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

        {/* ── Conditions Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Covered conditions */}
          <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm">
            <CardBody className="p-4">
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
          <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm">
            <CardBody className="p-4">
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

        {/* ── Contact Info ── */}
        <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm mb-4">
          <CardBody className="p-4 sm:p-5">
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

        {/* ── User Reviews ── */}
        <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm mb-4">
          <CardBody className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-gray-900 dark:text-white">
                PetVerse Reviews
              </h2>
              {avgRating > 0 && (
                <div className="flex items-center gap-2">
                  <Stars rating={avgRating} size="sm" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {avgRating.toFixed(1)} ({reviewCount})
                  </span>
                </div>
              )}
            </div>

            {/* Review list */}
            {isLoadingReviews ? (
              <div className="flex justify-center py-8">
                <Spinner size="sm" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-4">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              <div className="space-y-3 mb-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-gray-100 dark:border-white/10 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <Avatar
                          size="sm"
                          name={review.userName ?? "U"}
                          className="w-7 h-7 min-w-7 text-xs font-bold bg-steel-blue/20 text-steel-blue"
                        />
                        <div>
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                            {review.userName ?? "PetVerse User"}
                          </p>
                          {review.planUsed && (
                            <p className="text-[10px] text-gray-400">
                              Plan: {review.planUsed}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Stars rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pl-9">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Submit review form */}
            <Divider className="my-4" />
            <div className="pt-2">
              <h3 className="font-semibold text-xs text-gray-800 dark:text-gray-200 mb-3">
                Leave a Review
              </h3>

              {submitted ? (
                <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl px-4 py-3 text-xs text-green-700 dark:text-green-400">
                  ✅ Thanks! Your review has been submitted.
                </div>
              ) : (
                <div className="space-y-3">
                  <StarInput
                    value={reviewForm.rating}
                    onChange={(v) =>
                      setReviewForm((p) => ({ ...p, rating: v }))
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Which plan did you use? (optional)"
                    value={reviewForm.planUsed}
                    onChange={(e) =>
                      setReviewForm((p) => ({ ...p, planUsed: e.target.value }))
                    }
                    size="sm"
                    classNames={{
                      input: "text-xs",
                      inputWrapper: "h-9 bg-gray-50 dark:bg-white/5",
                    }}
                  />
                  <Textarea
                    rows={3}
                    placeholder="Share your experience with this provider..."
                    value={reviewForm.text}
                    onChange={(e) =>
                      setReviewForm((p) => ({ ...p, text: e.target.value }))
                    }
                    classNames={{
                      input: "text-xs",
                      inputWrapper: "bg-gray-50 dark:bg-white/5",
                    }}
                  />
                  {submitError && (
                    <p className="text-red-500 text-xs">{submitError}</p>
                  )}
                  <Button
                    onPress={handleSubmitReview}
                    isLoading={isSubmitting}
                    className="w-full bg-steel-blue text-white text-sm font-semibold py-2.5 h-auto rounded-xl"
                  >
                    Submit Review
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* ── Bottom disclaimer ── */}
        <p className="text-center text-gray-400 text-[11px] leading-relaxed">
          Reviews are from real PetVerse users. Prices are indicative ranges for
          2025 — always request a personalised quote from the provider.
        </p>
      </div>
    </div>
  );
}

// ── Review type (matches your backend model) ──────────────────────────────────
type Review = {
  _id: string;
  providerId: string;
  userId: string;
  userName?: string;
  rating: number;
  text: string;
  planUsed?: string;
  createdAt: string;
};
