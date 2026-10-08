"use client";

import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
} from "@heroui/react";

export default function LoaderNewsfeed() {
  return (
    <>
      {[1, 2].map((i) => (
        <Card
          key={i}
          className="mx-auto mb-6 w-full max-w-2xl overflow-hidden rounded-2xl bg-white p-5 shadow-sm dark:bg-zinc-900"
          radius="lg"
        >
          <CardHeader className="flex items-start gap-3 p-0 pb-4">
            <Skeleton className="rounded-full">
              <Avatar className="size-11" />
            </Skeleton>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32 rounded-lg" />
              <Skeleton className="h-3 w-24 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </CardHeader>

          <CardBody className="space-y-3 p-0">
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-5/6 rounded-lg" />
          </CardBody>

          <CardFooter className="flex items-center justify-between p-0 pt-4">
            <div className="flex gap-2">
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
            <Skeleton className="h-7 w-20 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
