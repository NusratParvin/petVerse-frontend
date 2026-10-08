import { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Card, CardBody, Button, Input } from "@heroui/react";
import { Lock } from "lucide-react";

import PaymentSuccess from "./paymentSuccess";

import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import {
  useCreatePaymentIntentMutation,
  useSavePaymentDataMutation,
} from "@/src/redux/features/payment/paymentApi";

type CheckoutFormProps = {
  amount: number;
  articleId: string;
  authorId: string;
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  articleId,
  authorId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [savePaymentData] = useSavePaymentDataMutation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState<string>("");

  const [cardError, setCardError] = useState<string>("");

  const user = useAppSelector(useCurrentUser);
  const userId = user?._id || "";
  const email = user?.email || "";

  // Create the payment intent when the component loads
  useEffect(() => {
    if (amount > 0) {
      createPaymentIntent({ amount, articleId, authorId })
        .unwrap()
        .then((data: any) => {
          setClientSecret(data.data);
          console.log("Client Secret:", data);
        })
        .catch((error: any) => {
          console.error("Failed to create payment intent:", error);
          setCardError("Failed to create payment intent");
        });
    }
  }, [amount, createPaymentIntent, articleId, authorId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return; // Ensure Stripe and elements are loaded
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return; // Ensure card element is available
    }

    setProcessing(true);

    // Create payment method and confirm payment
    const { error: paymentMethodError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card,
      });

    if (paymentMethodError) {
      setCardError(paymentMethodError.message || "An error occurred");
      setProcessing(false);

      return;
    }
    console.log(clientSecret, paymentMethod.id);
    const { error: confirmError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

    if (confirmError) {
      setCardError(confirmError.message || "Payment confirmation failed");
      setProcessing(false);

      return;
    }

    // If payment is successful, save the payment data
    try {
      // const paymentData = {
      //   transactionId: paymentIntent?.id,
      //   amount,
      //   articleId,
      //   userId,
      //   email,
      // };

      const paymentData = {
        transactionId: paymentIntent?.id,
        amount: amount,
        articleId: articleId,
        userId: userId,
        email: email,
        authorId: authorId,
      };

      console.log(paymentData);
      const result = await savePaymentData(paymentData).unwrap(); // Send paymentData directly

      console.log("Payment saved successfully:", result);
      setTransactionId(paymentIntent.id);
      toast.success("Payment successful!");
    } catch (error) {
      console.error("Error saving payment:", error);
      setCardError("Failed to save payment data");
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {transactionId ? (
        <div className=" w-full mx-auto my-8 text-center pb-36 px-8">
          <PaymentSuccess
            amount={amount}
            articleId={articleId}
            customerEmail={email}
            paymentId={transactionId}
          />
        </div>
      ) : (
        <div className="bg-white  w-full">
          {/* <CardElement
            className="w-1/2 mx-auto mt-24 p-4 rounded-none h-24 shadow-md border border-gray-300 bg-white"
            options={{
              style: {
                base: {
                  iconColor: "#c4f0ff",
                  color: "#000000",
                  fontWeight: "500",
                  fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                  fontSize: "20px",
                  fontSmoothing: "antialiased",
                  ":-webkit-autofill": {
                    color: "#fce883",
                  },
                  "::placeholder": {
                    color: "#23C050",
                  },
                },
                invalid: {
                  iconColor: "#FFC7EE",
                  color: "#FFC7EE",
                },
                complete: {
                  color: "#4caf50", // Color when the input is complete
                  iconColor: "#4caf50",
                },
              },
              hidePostalCode: true, // Hide the postal code field if not needed
            }}
          /> */}

          <Card
            className="shadow-lg w-3/4 h-[60vh] mx-auto mt-20 text-black/80"
            radius="none"
          >
            <CardBody className="gap-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Payment Details</h2>
                <Lock className="text-gray-400" size={20} />
              </div>
              <Input
                label="Cardholder Name"
                placeholder="John Doe"
                variant="bordered"
              />
              <div className="w-full">
                <h2 className="text-sm text-gray-600 mb-1 block">
                  Card Information
                </h2>
                <CardElement
                  className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </div>
              <Button
                className="w-full mt-4 bg-customBlue text-white font-semibold text-xl"
                disabled={!stripe || processing}
                isLoading={processing}
                size="lg"
                type="submit"
              >
                {processing ? "Processing..." : `Pay $${amount.toFixed(2)} USD`}
              </Button>
              {cardError && (
                <p className="text-danger text-sm mt-2">{cardError}</p>
              )}
            </CardBody>
          </Card>

          {/* <div className="flex justify-center mt-16">
            <button
              className="rounded-none hover:outline-none w-1/6 text-white text-xl font-semibold"
              disabled={!stripe || processing}
              type="submit"
            >
              {processing ? "Processing..." : `Pay Now $${amount}`}
            </button>
          </div> */}

          {cardError && <p className="text-red-600 mt-6">{cardError}</p>}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
