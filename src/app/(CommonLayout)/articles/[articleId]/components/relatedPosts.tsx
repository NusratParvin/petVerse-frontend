"use client";

import Link from "next/link";
import Image from "next/image";

import GeneralLoader from "@/src/components/shared/generalLoader";
import ErrorNewsfeed from "@/src/app/(DashboardLayout)/user/newsfeed/components/errorNewsfeed";
import { TArticle } from "@/src/types";
import { useGetAllArticlesQuery } from "@/src/redux/features/articles/articlesApi";
import image from "@/src/assets/images/StockCake-Cosmic Koi Dance_1727673723.jpg";

// const relatedPosts = [
//   {
//     id: 1,
//     title: "The Importance of Pet Insurance",
//     author: "Jane Doe",
//     date: "September 1, 2024",
//     image: "https://via.placeholder.com/150",
//   },
//   {
//     id: 2,
//     title: "The Ultimate Puppy Adoption Guide",
//     author: "John Smith",
//     date: "September 15, 2024",
//     image: "https://via.placeholder.com/150",
//   },
//   {
//     id: 3,
//     title: "A Complete Guide to Registering Your Pet's...",
//     author: "Alice Johnson",
//     date: "September 20, 2024",
//     image: "https://via.placeholder.com/150",
//   },
//   {
//     id: 4,
//     title: "ByteTag: The Safest Pet Tag Ever Made",
//     author: "Robert Brown",
//     date: "September 25, 2024",
//     image: "https://via.placeholder.com/150",
//   },
// ];

const RelatedPosts = () => {
  const {
    data: allArticles,
    isLoading,
    error,
  } = useGetAllArticlesQuery(undefined);

  if (isLoading) return <GeneralLoader />;
  if (error) return <ErrorNewsfeed />;

  // Filter and sort the articles by isPremium false and by upvotes in descending order
  const filteredArticles =
    allArticles?.data
      ?.filter((article: TArticle) => !article.isPremium) // Filter where isPremium is false
      .sort((a: TArticle, b: TArticle) => b.upvotes - a.upvotes) || []; // Sort by upvotes in descending order

  console.log(filteredArticles);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-base font-semibold mb-4">Popular Articles</h2>
      <ul className="space-y-4">
        {filteredArticles.map((article: TArticle) => (
          <li key={article?._id} className="flex items-start space-x-4">
            <Link href={`/articles/${article?._id}`}>
              <Image
                alt={article?.title}
                className="h-12 w-24"
                height={10}
                src={article?.images || image}
                width={10}
              />
            </Link>
            <div>
              <Link href={`/articles/${article?._id}`}>
                <h3 className="text-sm font-medium hover:text-highlight">
                  {article?.title}
                </h3>
              </Link>
              <p className="text-gray-500 text-xs">
                {article?.authorId?.name} -{" "}
                <span>
                  {new Date(article?.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedPosts;
