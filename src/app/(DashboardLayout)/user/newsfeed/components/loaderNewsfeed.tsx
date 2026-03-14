import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
} from "@heroui/react";

const LoaderNewsfeed = () => {
  return (
    <>
      {[1, 2].map((item, index) => (
        <Card
          key={index}
          className="w-full mx-auto text-black/80 text-sm bg-white shadow-lg p-5 mb-6"
          radius="lg"
        >
          {/* Card Header Skeleton */}
          <CardHeader className="flex flex-col items-start space-y-4">
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center w-full mb-3">
                <Skeleton className="rounded-full w-12 h-12">
                  <Avatar className="w-12 h-12" />
                </Skeleton>
                <div className="ml-3 flex-grow space-y-2">
                  <Skeleton className="w-24 h-6 rounded-lg">
                    <div className="w-24 h-6 bg-default-300 rounded-lg" />
                  </Skeleton>
                  <Skeleton className="w-1/2 h-4 rounded-lg">
                    <div className="w-1/2 h-4 bg-default-200 rounded-lg" />
                  </Skeleton>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="w-6 h-6 rounded-lg">
                  <div className="w-6 h-6 bg-default-300 rounded-lg" />
                </Skeleton>
                <Skeleton className="w-8 h-8 rounded-lg">
                  <div className="w-8 h-8 bg-default-300 rounded-lg" />
                </Skeleton>
              </div>
            </div>

            <Skeleton className="w-full h-6 rounded-lg">
              <div className="w-full h-6 bg-default-300 rounded-lg" />
            </Skeleton>
          </CardHeader>

          {/* Card Body Skeleton */}
          <CardBody className="p-0 space-y-4">
            <Skeleton className="rounded-lg h-64 w-full">
              <div className="h-64 w-full bg-default-300 rounded-lg" />
            </Skeleton>
            <Skeleton className="w-full h-20 rounded-lg">
              <div className="w-full h-20 bg-default-300 rounded-lg" />
            </Skeleton>
          </CardBody>

          {/* Card Footer Skeleton */}
          <CardFooter className="flex justify-between items-center space-x-4 p-5">
            <div className="flex space-x-3">
              <Skeleton className="w-12 h-6 rounded-lg">
                <div className="w-12 h-6 bg-default-300 rounded-lg" />
              </Skeleton>
              <Skeleton className="w-12 h-6 rounded-lg">
                <div className="w-12 h-6 bg-default-300 rounded-lg" />
              </Skeleton>
              <Skeleton className="w-12 h-6 rounded-lg">
                <div className="w-12 h-6 bg-default-300 rounded-lg" />
              </Skeleton>
            </div>
            <Skeleton className="w-20 h-6 rounded-lg">
              <div className="w-20 h-6 bg-default-300 rounded-lg" />
            </Skeleton>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default LoaderNewsfeed;
