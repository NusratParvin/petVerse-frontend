import { Card, CardBody, Image, Link } from "@heroui/react";

import { useGetAllArticlesQuery } from "@/src/redux/features/articles/articlesApi";
import { TArticle } from "@/src/types";

export default function SuggestedArticles() {
  const {
    data: allArticles,
    isLoading,
    error,
  } = useGetAllArticlesQuery(undefined);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading articles</div>;

  const sortedArticles = [...(allArticles?.data || [])]
    .sort(
      (a: TArticle, b: TArticle) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  return (
    <Card className="w-full" radius="none">
      <CardBody className="p-4 ms-1 mt-3 text-black/70 text-base">
        <h2 className="font-bold mb-4">New articles to read</h2>
        {sortedArticles.map((article: TArticle, index: number) => (
          <div key={index} className="flex articles-start mb-4">
            <div className="flex-grow">
              <div className="flex articles-center text-xs text-gray-500">
                <span>{article.category}</span>
                <span className="mx-2">·</span>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="font-semibold text-sm mt-1 underline hover:text-customBlue cursor-pointer">
                {article.title}
              </p>
              {article.authorId && (
                <p className="text-xs text-gray-500 mt-1">
                  - By {article.authorId.name}
                </p>
              )}
            </div>
            {article?.images && (
              <Image
                alt={article.title}
                className="w-16 h-16 rounded-xl ml-3"
                src={article?.images}
              />
            )}
          </div>
        ))}
        <Link className="text-sm text-primary" href="#">
          Show more
        </Link>
      </CardBody>
    </Card>
  );
}
