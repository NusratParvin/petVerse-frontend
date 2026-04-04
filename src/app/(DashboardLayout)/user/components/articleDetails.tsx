import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Avatar,
  Image,
  Chip,
} from "@heroui/react";
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

export default function RedditPost() {
  return (
    <Card className="max-w-[600px] bg-[#1A1A1B] text-[#D7DADC]">
      <CardBody className="p-3">
        <div className="flex items-center mb-2">
          <Avatar
            className="mr-2"
            size="sm"
            src="/placeholder.svg?height=32&width=32"
          />
          <span className="text-sm font-medium mr-2">r/Carpentry</span>
          <span className="text-xs text-gray-500">• 16 hr. ago</span>
          <Button isIconOnly className="ml-auto" size="sm" variant="light">
            <MoreHorizontal size={16} />
          </Button>
        </div>
        <h2 className="text-lg font-medium mb-2">How fucked am I?</h2>
        <Chip className="mb-2" color="primary" size="sm">
          Subfloor Help
        </Chip>
        <p className="text-sm mb-3">
          This subfloor looks impossible to get up. I hired some guys to demo my
          bathroom down to the subfloor but they bailed here.
        </p>
        <p className="text-sm mb-3">
          Looks like cement leveler of some kind, with metal sheeting in
          places!? Im not sure what that lone piece of plywood is impossibly
          attached to but Im afraid to cut into it.
        </p>
        <Image
          alt="Dilapidated room with exposed subfloor"
          className="w-full h-auto object-cover rounded-lg mb-3"
          src="/placeholder.svg?height=400&width=600"
        />
      </CardBody>
      <CardFooter className="px-3 py-2 border-t border-gray-700">
        <div className="flex items-center w-full">
          <Button
            isIconOnly
            className="text-gray-500 mr-1"
            size="sm"
            variant="light"
          >
            <ArrowUp size={16} />
          </Button>
          <span className="text-xs font-medium mr-1">0</span>
          <Button
            isIconOnly
            className="text-gray-500 mr-4"
            size="sm"
            variant="light"
          >
            <ArrowDown size={16} />
          </Button>
          <Button
            className="text-gray-500 mr-4"
            size="sm"
            startContent={<MessageSquare size={16} />}
            variant="light"
          >
            39
          </Button>
          <Button
            className="text-gray-500 mr-4"
            size="sm"
            startContent={<Share size={16} />}
            variant="light"
          >
            Share
          </Button>
          <Button
            className="text-gray-500 mr-4"
            size="sm"
            startContent={<Bookmark size={16} />}
            variant="light"
          >
            Save
          </Button>
        </div>
      </CardFooter>
      <CardFooter className="px-3 py-2">
        <Button
          className="w-full bg-[#272729] text-gray-400 hover:bg-[#2D2D2E]"
          size="lg"
        >
          Add a comment
        </Button>
      </CardFooter>
    </Card>
  );
}
