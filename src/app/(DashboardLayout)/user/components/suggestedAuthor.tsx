import { Card, Button, Avatar, Link, Skeleton } from "@heroui/react";

import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useGetMostFollowedAuthorsQuery } from "@/src/redux/features/user/userApi";
import { useAppSelector } from "@/src/redux/hooks";

export default function SuggestedAuthor() {
  const {
    data: authors,
    isLoading,
    error,
  } = useGetMostFollowedAuthorsQuery(undefined);

  const user = useAppSelector(useCurrentUser);

  if (isLoading)
    return (
      <div className="max-w-[300px] w-full flex items-center gap-3">
        <div>
          <Skeleton className="flex rounded-full w-12 h-12" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>
    );
  if (error) return <div>Error loading authors</div>;

  return (
    <Card className="w-full" radius="none">
      <div className="p-4 text-black/70 ">
        <h2 className="text-base font-bold my-4">Author List</h2>
        {authors?.data?.slice(0, 4).map((author: any, index: number) => (
          <div key={index} className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Avatar className="mr-2" src={author.profilePhoto} />
              <div>
                <div className="flex items-center text-cyan-800">
                  <span className="font-semibold text-xs mr-3">
                    {author.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    • {author.articles.length} Articles
                  </span>
                </div>
                <span className="text-xs text-gray-500 mr-2">
                  • {author.followers.length} Followers
                </span>
                <span className="text-xs text-gray-500">
                  • {author.following.length} Following
                </span>
              </div>
            </div>

            <Button
              className="text-customBlue w-8 h-6 px-0 border text-xs"
              color="default"
              radius="full"
              size="sm"
              variant="bordered"
            >
              {author?.followers?.includes(user?._id) ? "Following" : "Follow"}
            </Button>
          </div>
        ))}
        <Link
          className="text-sm text-customBlue underline mx-auto mt-4"
          href="/user/authors"
        >
          Show more
        </Link>
      </div>
    </Card>
  );
}
