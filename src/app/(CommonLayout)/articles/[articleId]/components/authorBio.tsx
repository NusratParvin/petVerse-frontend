"use client";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

import { TUser } from "@/src/types";
import image from "@/src/assets/images/team.png";

const AuthorBio = ({ author }: { author: TUser }) => {
  // console.log(author);
  return (
    <div className=" mx-auto mb-16 max-w-screen-sm">
      <div className="my-4 p-4 border-t border-b  ">
        <div className="flex py-2">
          <Image
            alt="Author"
            className="h-10 w-10 rounded-full mr-2 object-cover"
            height={40}
            src={author?.profilePhoto || image}
            width={40}
          />
          <div>
            <p className="font-semibold text-gray-700 text-sm">
              {author?.name}
            </p>
            <p className="font-semibold text-gray-600 text-xs"> Author </p>
          </div>
        </div>
        <p className="text-gray-700 py-3 text-sm">
          Marine Biologist with years of experience in fish care and aquarium
          maintenance. Sharing tips and insights for happy, healthy fish.
        </p>
        <Button
          as={Link}
          className="px-2 py-1 text-gray-100 bg-green-700 flex w-full items-center justify-center rounded"
          href={"/login"}
          variant="flat"
        >
          Follow Me
        </Button>
      </div>
    </div>
  );
};

export default AuthorBio;
