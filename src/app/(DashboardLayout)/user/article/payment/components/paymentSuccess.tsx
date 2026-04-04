import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
} from "@heroui/react";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { Link } from "@heroui/react";

interface PaymentSuccessProps {
  amount: number;
  paymentId: string;
  customerEmail: string;
  articleId: string;
}

export default function PaymentSuccess({
  amount,
  paymentId,
  customerEmail,
  articleId,
}: PaymentSuccessProps) {
  return (
    <div className="flex justify-center items-center min-h-[90vh] w-full">
      <Card className="w-full max-w-md " radius="none">
        <CardHeader className="flex gap-3 justify-center py-6 bg-customBlue/20">
          <CheckCircle className="text-success" size={40} />
          <div className="flex flex-col items-center">
            <p className="text-lg font-semibold text-success">
              Payment Successful
            </p>
            <p className="text-small text-default-500">
              Thank you for your purchase!
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="py-6 text-sm  flex items-center text-black/70 ">
          <div className="space-y-4 w-4/5 ">
            <div className="flex justify-between items-center">
              <p className="text-default-500">Amount Paid :</p>
              <p className="text-lg font-semibold">{amount} USD</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-default-500">Payment ID :</p>
              <p className="text-small break-words">{paymentId}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-default-500">Email :</p>
              <p className="text-small break-words">{customerEmail}</p>
            </div>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-row gap-2 py-4">
          <Button
            as={Link}
            className="w-full text-customOrange"
            endContent={<ArrowRight size={16} />}
            href={`/user/article/${articleId}`}
            variant="light"
          >
            Read Article
          </Button>
          <Button
            as={Link}
            className="w-full"
            endContent={<Home size={16} />}
            href="/"
            variant="light"
          >
            Homepage
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
