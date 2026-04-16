"use client";
import { useDisclosure } from "@heroui/react";
import Link from "next/link";

import CreateArticleModal from "./createArticle";

const ModalButton = () => {
  const { isOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Link
        className="bg-highlight text-white text-base font-bold rounded-full text-center py-2"
        href={"/user/create-article"}
      >
        Create Article
      </Link>
      {/* <Button
        className="bg-highlight text-white text-base font-bold rounded-full"
        onPress={onOpenChange} 
      >
        Create Article
      </Button> */}

      <CreateArticleModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default ModalButton;
