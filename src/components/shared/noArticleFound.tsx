"use client";
import { Card, CardBody } from "@heroui/react";
import { FileX } from "lucide-react";

export default function NoArticlesFound() {
  return (
    <Card className="max-w-md mx-auto my-8 bg-gray-50">
      <CardBody className="flex flex-col items-center justify-center py-8">
        <FileX className="text-gray-400 mb-4" size={48} />
        <p className="text-xl font-semibold text-gray-700">No articles found</p>
        <p className="text-sm text-gray-500 mt-2 text-center">
          There are currently no articles available. Check back later or try a
          different search.
        </p>
      </CardBody>
    </Card>
  );
}
