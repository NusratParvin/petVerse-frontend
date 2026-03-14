"use client";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import React, { useState } from "react";

import ArticleCard from "../../newsfeed/components/articleCard";
import LoaderNewsfeed from "../../newsfeed/components/loaderNewsfeed";
import ErrorNewsfeed from "../../newsfeed/components/errorNewsfeed";

import {
  useGetFollowingArticlesQuery,
  useGetMyArticlesQuery,
} from "@/src/redux/features/articles/articlesApi";
import { TArticle } from "@/src/types";
import NoArticlesFound from "@/src/components/shared/noArticleFound";

const ArticleTabs = () => {
  const [selected, setSelected] = useState("my-articles");

  console.log(selected);
  const {
    data: myArticles,
    isLoading: isLoadingMyArticles,
    error: errorMyArticles,
  } = useGetMyArticlesQuery(undefined);

  const {
    data: followingArticles,
    isLoading: isLoadingFollowingArticles,
    error: errorFollowingArticles,
  } = useGetFollowingArticlesQuery(undefined);

  console.log(myArticles);

  return (
    <div className="flex w-full flex-col mt-8 mb-16">
      <Tabs
        // className="border-gray-400 focus:border-gray-900"
        fullWidth
        aria-label="Article Categories"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none  p-0 border-b border-divider flex justify-evenly",
          cursor: "w-full  bg-customBlue ",
          tab: "max-w-fit px-0 h-12 ",
          tabContent:
            "group-data-[selected=true]:text-customBlue  font-semibold",
        }}
        color="default"
        selectedKey={selected}
        size="md"
        variant="underlined"
        onSelectionChange={(key) => setSelected(key.toString())}
      >
        {/* Tab for "My Articles" */}
        <Tab key="my-articles" title="My Articles">
          <Card className="w-full" radius="none">
            <CardBody>
              {isLoadingMyArticles ? (
                <LoaderNewsfeed />
              ) : myArticles?.data?.length === 0 ? (
                <NoArticlesFound />
              ) : errorMyArticles ? (
                <ErrorNewsfeed />
              ) : (
                myArticles?.data?.map((article: TArticle) => (
                  <ArticleCard key={article._id} article={article} />
                ))
              )}
            </CardBody>
          </Card>
        </Tab>

        {/* Tab for "Articles by People I Follow" */}
        <Tab key="following-articles" title="Articles by People I Follow">
          <Card className="w-full" radius="none">
            <CardBody className="text-black/70">
              {isLoadingFollowingArticles ? (
                <LoaderNewsfeed />
              ) : followingArticles?.data?.length === 0 ? (
                <NoArticlesFound />
              ) : errorFollowingArticles ? (
                <ErrorNewsfeed />
              ) : (
                followingArticles?.data?.map((article: TArticle) => (
                  <ArticleCard key={article._id} article={article} />
                ))
              )}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ArticleTabs;
