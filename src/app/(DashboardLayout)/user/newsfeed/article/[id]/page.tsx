"use client";

import { use } from "react";

import { useGetArticleByIdQuery } from "@/src/redux/features/articles/articlesApi";
import ErrorNewsfeed from "../../components/errorNewsfeed";
import LoaderNewsfeed from "../../components/loaderNewsfeed";
import ArticleDetailCard from "../../components/articleDetailCard";

/**
 * Next.js App Router passes params as a Promise in server components.
 * In a client component we unwrap with `use()` — supported in Next 13.4+.
 * If your hook is `useGetArticleByIdQuery`, just rename it here.
 */
export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading, isError } = useGetArticleByIdQuery(id);
  const article = data?.data;

  if (isLoading) return <LoaderNewsfeed />;
  if (isError || !article) return <ErrorNewsfeed />;

  return <ArticleDetailCard articleInfo={article} />;
}
