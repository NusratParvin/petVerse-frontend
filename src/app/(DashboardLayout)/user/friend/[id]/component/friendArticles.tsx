"use client";
import { Card, CardBody } from "@nextui-org/react";

import ArticleCard from "../../../newsfeed/components/articleCard";

import { TArticle } from "@/src/types";
import NoArticlesFound from "@/src/components/shared/noArticleFound";

const FriendArticles = ({ articles }: { articles: TArticle[] }) => {
  // console.log(articles);

  return (
    <div className="flex w-full flex-col mt-2 mb-16 ">
      <Card className="w-full" radius="none">
        <CardBody>
          {/* 
          {(isLoadingMyArticles || isLoadingFollowingArticles) && (
            <LoaderNewsfeed />
          )}

           {errorMyArticles || errorFollowingArticles ? <ErrorNewsfeed /> : null} */}

          {/* My Articles */}
          {articles?.length > 0 &&
            articles.map((article: TArticle) => (
              <ArticleCard key={article._id} article={article} />
            ))}

          {/* Following Articles */}
          {/* {followingArticles?.data?.length > 0 &&
            followingArticles.data.map((article: TArticle) => (
              <ArticleCard key={article._id} article={article} />
            ))} */}

          {/* No Articles Found */}
          {!articles || (articles?.length == 0 && <NoArticlesFound />)}
        </CardBody>
      </Card>
    </div>
  );
};

export default FriendArticles;
