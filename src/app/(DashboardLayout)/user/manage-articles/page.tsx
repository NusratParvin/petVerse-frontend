"use client";
import { useEffect, useState } from "react";
import { Input } from "@heroui/react";

import ErrorNewsfeed from "../newsfeed/components/errorNewsfeed";
import LoaderNewsfeed from "../newsfeed/components/loaderNewsfeed";

import ArticleCardManage from "./components/articleCardManage";

import { useGetMyArticlesQuery } from "@/src/redux/features/articles/articlesApi";
import { TArticle } from "@/src/types";
import NoArticlesFound from "@/src/components/shared/noArticleFound";

const Page = () => {
  const {
    data: myArticles,
    isLoading,
    error,
    refetch,
  } = useGetMyArticlesQuery(undefined);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filteredArticles = myArticles?.data?.filter(
    (article: TArticle) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="w-full p-4 font-semibold text-base text-black/70 border-b border-gray-200 flex justify-between items-center">
        <span>Manage My Articles</span>

        {/* Search Input */}
        <Input
          isClearable
          className="w-1/3"
          placeholder="Search by title/category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-20">
        {filteredArticles?.length > 0 ? (
          filteredArticles.map((article: TArticle) => (
            <ArticleCardManage key={article._id} article={article} />
          ))
        ) : (
          <NoArticlesFound />
        )}
        {isLoading && <LoaderNewsfeed />}
        {error && <ErrorNewsfeed />}
      </div>
    </div>
  );
};

export default Page;
