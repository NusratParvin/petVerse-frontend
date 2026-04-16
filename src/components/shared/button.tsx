"use client";
import { Button } from "@heroui/react";
import NextLink from "next/link";

interface PrimaryButtonProps {
  buttonText: string;
  href: string;
  size?: "lg" | "sm" | "md";
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  buttonText,
  href,
  size,
}) => {
  return (
    <NextLink passHref href={href}>
      <Button
        color="primary"
        radius="full"
        size={size ? size : "lg"}
        variant="shadow"
      >
        {buttonText}
      </Button>
    </NextLink>
  );
};

export default PrimaryButton;
