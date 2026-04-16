"use client";
import { Card, CardHeader, CardFooter, Image } from "@heroui/react";
import { CalendarIcon, PenIcon } from "lucide-react";
import Link from "next/link";

import GeneralLoader from "../shared/generalLoader";

import { useGetAllArticlesQuery } from "@/src/redux/features/articles/articlesApi";
import ErrorNewsfeed from "@/src/app/(DashboardLayout)/user/newsfeed/components/errorNewsfeed";
import { TArticle } from "@/src/types";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAppSelector } from "@/src/redux/hooks";

const PremiumArticles = () => {
  const {
    data: allArticles,
    isLoading,
    error,
  } = useGetAllArticlesQuery(undefined);

  const user = useAppSelector(useCurrentUser);

  if (isLoading) return <GeneralLoader />;
  if (error) return <ErrorNewsfeed />;

  // Filter the articles by isPremium true
  const filteredArticles =
    allArticles?.data?.filter((article: TArticle) => article.isPremium) || [];
  const getArticleLink = (article: TArticle) => {
    return article?.isPremium
      ? user
        ? user?.role === "USER"
          ? `/user/newsfeed` // Regular user redirected if it's premium
          : `/articles/${article._id}` // Admin or other roles can access the article
        : `/login` // Non-logged-in users are redirected to the login page for premium content
      : `/articles/${article._id}`; // Non-premium articles are accessible to everyone
  };

  return (
    <div className="container mx-auto my-24 py-8">
      <h2 className="text-5xl font-semibold mb-16 text-customOrange text-center">
        Premium Articles For Your Fish
      </h2>
      <div className="max-w-full gap-4 grid grid-cols-12 grid-rows-2">
        {/* First Row: Two Cards */}
        {filteredArticles.slice(0, 2).map((article: TArticle) => (
          <Card
            key={article._id}
            className="col-span-12 sm:col-span-6 h-[300px] relative"
          >
            <Link href={getArticleLink(article)}>
              <CardHeader className="absolute z-10 top-0 h-24 flex-col !items-start bg-black/60">
                <p
                  className={`text-xs py-0.5 px-3 mb-2 rounded-full font-semibold text-white uppercase ${
                    article.category === "Tip"
                      ? "bg-customBlue"
                      : "bg-customOrange"
                  }`}
                >
                  {article.category}
                </p>
                <h4 className="text-white font-medium text-large hover:underline">
                  {article.title}
                </h4>
              </CardHeader>
            </Link>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover"
              src={
                article.images ||
                "https://nextui.org/images/card-example-6.jpeg"
              }
            />
            <CardFooter className="absolute bg-black/60 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
              <div className="flex flex-grow gap-2 items-center">
                <PenIcon className="text-white/80" size={20} />
                <p className="text-tiny text-white/80">
                  {article.authorId?.name || "Unknown Author"}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <CalendarIcon className="text-white/80" size={20} />
                <p className="text-tiny text-white/80">
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardFooter>
          </Card>
        ))}

        {/* Second Row: Three Cards */}
        {filteredArticles.slice(2).map((article: TArticle) => (
          <Card
            key={article._id}
            className="col-span-12 sm:col-span-4 h-[300px] relative"
          >
            <Link href={getArticleLink(article)}>
              <CardHeader className="absolute z-10 top-0 h-24 flex-col !items-start bg-black/60">
                <p
                  className={`text-xs py-0.5 px-3 mb-2 rounded-full font-semibold text-white uppercase ${
                    article.category === "Tip"
                      ? "bg-customBlue"
                      : "bg-customOrange"
                  }`}
                >
                  {article.category}
                </p>
                <h4 className="text-white font-medium text-md hover:underline">
                  {article.title}
                </h4>
              </CardHeader>
            </Link>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover"
              src={
                article.images ||
                "https://nextui.org/images/card-example-6.jpeg"
              }
            />
            <CardFooter className="absolute bg-black/60 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
              <div className="flex flex-grow gap-2 items-center">
                <PenIcon className="text-white/80" size={20} />
                <p className="text-tiny text-white/80">
                  {article.authorId?.name || "Unknown Author"}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <CalendarIcon className="text-white/80" size={20} />
                <p className="text-tiny text-white/80">
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PremiumArticles;
