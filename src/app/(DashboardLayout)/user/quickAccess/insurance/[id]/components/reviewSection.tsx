"use client";

import {
  useSubmitInsuranceReviewMutation,
  useGetProviderReviewsQuery,
} from "@/src/redux/features/insuranceReview/insuranceReviewApi";
import { TInsuranceReview } from "@/src/types";
import {
  Card,
  CardBody,
  Button,
  Divider,
  Input,
  Textarea,
  Spinner,
  Avatar,
} from "@heroui/react";
import { Rating } from "next-flex-rating";
import { useState } from "react";
import { toast } from "sonner";

const ReviewSection = ({ providerId }: { providerId: string }) => {
  const {
    data: reviewsData,
    refetch,
    isLoading: isLoadingReviews,
  } = useGetProviderReviewsQuery(providerId);

  const reviews: TInsuranceReview[] = reviewsData?.reviews ?? [];
  const avgRating: number = reviewsData?.avgRating ?? 0;
  const reviewCount: number = reviewsData?.count ?? 0;

  const [submitReview, { isLoading: isSubmitting }] =
    useSubmitInsuranceReviewMutation();

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    text: "",
    planUsed: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      const err = error as {
        data?: { errors?: Record<string, string[]>; message?: string };
      };
      const field = Object.entries(err?.data?.errors ?? {})[0];
      const msg = field
        ? `${field[0]}: ${field[1][0]}`
        : (err?.data?.message ?? "Submission failed");
      toast.error(msg);
    }
  }

  return (
    <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm">
      <CardBody className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-sm text-gray-900 dark:text-white">
            PetVerse Reviews
          </h2>
          {avgRating > 0 && (
            <div className="flex items-center gap-2">
              <Rating value={avgRating} readOnly={true} size={14} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {avgRating.toFixed(1)} ({reviewCount})
              </span>
            </div>
          )}
        </div>

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
                    <Rating value={review.rating} readOnly={true} size={12} />
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pl-9">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        )}

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
              <Rating
                value={reviewForm.rating}
                onChange={(v) => setReviewForm((p) => ({ ...p, rating: v }))}
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
  );
};

export default ReviewSection;
