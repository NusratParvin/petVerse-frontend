"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";

import CheckoutForm from "./checkoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_PK as string,
);

const Payment = () => {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");

  const paymentData = encodedData
    ? JSON.parse(decodeURIComponent(encodedData))
    : null;

  if (
    !paymentData?.articleId ||
    !paymentData?.authorId ||
    !paymentData?.amount
  ) {
    return <p>Loading payment details...</p>;
  }

  console.log(paymentData);

  const { amount, articleId, authorId } = paymentData;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amount={parseFloat(amount as string)}
        articleId={articleId as string}
        authorId={authorId as string}
      />
      <></>
    </Elements>
  );
};

export default Payment;
