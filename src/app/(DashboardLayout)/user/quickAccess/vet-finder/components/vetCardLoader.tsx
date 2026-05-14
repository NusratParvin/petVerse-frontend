import { Card, CardBody, Skeleton } from "@heroui/react";

const VetCardLoader = () => {
  return (
    <div>
      {" "}
      <Card
        shadow="none"
        className="border border-default-200 dark:border-default-100/10 overflow-hidden w-full"
      >
        <Skeleton className="h-40 w-full rounded-none" />
        <CardBody className="p-3.5 flex flex-col gap-2">
          <Skeleton className="h-4 w-3/4 rounded-lg" />
          <Skeleton className="h-3 w-1/2 rounded-lg" />
          <Skeleton className="h-3 w-20 rounded-lg" />
          <div className="flex gap-1">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-3 w-28 rounded-lg" />
        </CardBody>
      </Card>
    </div>
  );
};

export default VetCardLoader;
