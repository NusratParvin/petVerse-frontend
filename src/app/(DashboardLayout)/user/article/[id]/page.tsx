"use client";
import { useParams } from "next/navigation";

import ErrorNewsfeed from "../../newsfeed/components/errorNewsfeed";
import LoaderNewsfeed from "../../newsfeed/components/loaderNewsfeed";
import ArticleDetailsCard from "../components/articleDetailsCard";
import CommentCard from "../components/commentCard";
import AddCommentCard from "../components/addCommentCard";

import { useGetArticleByIdQuery } from "@/src/redux/features/articles/articlesApi";
import { TComment } from "@/src/types";
import CommentSection from "../../components/comments/commentSection";

const ArticleDetails = () => {
  const { id } = useParams();
  const { data: article, isLoading, isError } = useGetArticleByIdQuery(id);
  const comments: TComment[] = article?.data?.comments || [];

  if (isLoading) {
    return <LoaderNewsfeed />;
  }
  // console.log(article);
  if (isError || !article) {
    return <ErrorNewsfeed />;
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 ">
      <ArticleDetailsCard articleInfo={article?.data} />

      {/* ✅ NEW: Polymorphic Comment Section */}
      <div className="mt-8 mx-4">
        <CommentSection
          targetType="Article"
          targetId={article?.data?._id}
          postOwnerId={article?.data?.author?._id}
        />
      </div>
    </div>
  );
};

export default ArticleDetails;
