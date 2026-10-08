// "use client";

// import { useState, useEffect } from "react";
// // import { Input, Button, Select, SelectItem, Divider } from "@heroui-org/react";
// import { Input, Button, Select, SelectItem, Divider } from "@heroui/react";
// import { Search, X } from "lucide-react";
// import InfiniteScroll from "react-infinite-scroll-component";

// import ArticleCard from "./components/articleCard";
// import ErrorNewsfeed from "./components/errorNewsfeed";
// import LoaderNewsfeed from "./components/loaderNewsfeed";

// import { useGetAllArticlesQuery } from "@/src/redux/features/articles/articlesApi";
// import { TArticle } from "@/src/types";
// import NoArticlesFound from "@/src/components/shared/noArticleFound";

// const Page = () => {
//   const [articles, setArticles] = useState<TArticle[]>([]);
//   const [filters, setFilters] = useState({
//     category: "",
//     isPremium: "",
//     searchQuery: "",
//   });
//   const [sortOrder, setSortOrder] = useState<string>("");
//   const [votingOrder, setVotingOrder] = useState<string>("");
//   const [page, setPage] = useState(1);

//   const {
//     data: fetchedArticles,
//     error,
//     isLoading,
//     refetch,
//   } = useGetAllArticlesQuery(undefined);

//   // Polling effect: Refetch data every 10 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       refetch();
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [refetch]);

//   // Update state when articles are fetched
//   useEffect(() => {
//     if (fetchedArticles?.data) {
//       setArticles(fetchedArticles.data);
//     }
//   }, [fetchedArticles]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;

//     setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       searchQuery: e.target.value,
//     }));
//   };

//   const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSortOrder(e.target.value);
//   };

//   const handleVotingFilterChange = (
//     e: React.ChangeEvent<HTMLSelectElement>,
//   ) => {
//     setVotingOrder(e.target.value);
//   };

//   const clearFilters = () => {
//     setFilters({
//       category: "",
//       isPremium: "",
//       searchQuery: "",
//     });
//     setSortOrder("");
//     setVotingOrder("");
//   };

//   const loadMore = () => {
//     setPage((prevPage) => prevPage + 1);
//   };

//   if (isLoading) {
//     return <LoaderNewsfeed />;
//   }

//   if (error) {
//     return <ErrorNewsfeed />;
//   }

//   // Filter and sort articles
//   const filteredArticles = articles
//     .filter(
//       (article) =>
//         !filters.searchQuery ||
//         article.title
//           .toLowerCase()
//           .includes(filters.searchQuery.toLowerCase()) ||
//         article.content
//           .toLowerCase()
//           .includes(filters.searchQuery.toLowerCase()),
//     )
//     .filter(
//       (article) =>
//         !filters.category ||
//         filters.category === "All" ||
//         article.category === filters.category,
//     )
//     .filter(
//       (article) =>
//         !filters.isPremium ||
//         filters.isPremium === "All" ||
//         (filters.isPremium === "Free" && article.isPremium === false) ||
//         (filters.isPremium === "Premium" && article.isPremium === true),
//     )
//     .sort((a, b) =>
//       sortOrder === "newest"
//         ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
//         : sortOrder === "oldest"
//           ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
//           : 0,
//     )
//     .sort((a, b) =>
//       votingOrder === "upvotes"
//         ? b.upvotes - a.upvotes
//         : votingOrder === "downvotes"
//           ? b.downvotes - a.downvotes
//           : 0,
//     );

//   return (
//     <div>
//       {/* Search and Reset Section */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="font-semibold text-2xl text-customBlue">Articles</h1>
//         <div className="flex space-x-2">
//           <Input
//             className="max-w-xs"
//             placeholder="Search articles"
//             size="sm"
//             startContent={<Search size={14} />}
//             value={filters.searchQuery}
//             onChange={handleSearchChange}
//           />
//           <Button
//             size="sm"
//             startContent={<X size={16} />}
//             variant="light"
//             onClick={clearFilters}
//           >
//             Reset
//           </Button>
//         </div>
//       </div>

//       {/* Filters Section */}
//       <div className="lg:grid lg:grid-cols-4 gap-2 flex flex-wrap lg:justify-evenly items-center mb-4">
//         <Select
//           className="max-w-full"
//           name="category"
//           placeholder="Category"
//           size="sm"
//           value={filters.category}
//           onChange={handleInputChange}
//         >
//           <SelectItem key="All">All</SelectItem>
//           <SelectItem key="Tip">Tip</SelectItem>
//           <SelectItem key="Story">Story</SelectItem>
//         </Select>

//         <Select
//           className="max-w-full"
//           name="isPremium"
//           placeholder="Type"
//           size="sm"
//           value={filters.isPremium}
//           onChange={handleInputChange}
//         >
//           <SelectItem key="All">All</SelectItem>
//           <SelectItem key="Free">Free</SelectItem>
//           <SelectItem key="Premium">Premium</SelectItem>
//         </Select>

//         <Select
//           className="max-w-full"
//           placeholder="Sort by Date"
//           size="sm"
//           value={sortOrder}
//           onChange={handleSortChange}
//         >
//           <SelectItem key="newest">Newest</SelectItem>
//           <SelectItem key="oldest">Oldest</SelectItem>
//         </Select>

//         <Select
//           className="max-w-full"
//           placeholder="Sort by Voting"
//           size="sm"
//           value={votingOrder}
//           onChange={handleVotingFilterChange}
//         >
//           <SelectItem key="upvotes">Upvotes</SelectItem>
//           <SelectItem key="downvotes">Downvotes</SelectItem>
//         </Select>
//       </div>

//       <Divider className="my-1" />

//       {filteredArticles.length > 0 ? (
//         <InfiniteScroll
//           dataLength={page * 2}
//           endMessage={
//             <p className="text-center text-gray-500 my-4">
//               No more articles to load.
//             </p>
//           }
//           hasMore={page * 2 < filteredArticles.length}
//           loader={<LoaderNewsfeed />}
//           next={loadMore}
//         >
//           <div className="p-1 flex flex-col gap-4">
//             {filteredArticles.slice(0, page * 2).map((article) => (
//               <ArticleCard key={article._id} article={article} />
//             ))}
//           </div>
//         </InfiniteScroll>
//       ) : (
//         <div className="text-center text-gray-500">
//           <NoArticlesFound />{" "}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Page;

"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { X } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

import NoArticlesFound from "@/src/components/shared/noArticleFound";

import { useGetAllArticlesQuery } from "@/src/redux/features/articles/articlesApi";
import { TArticle } from "@/src/types";

import ErrorNewsfeed from "./components/errorNewsfeed";
import LoaderNewsfeed from "./components/loaderNewsfeed";
import ArticleFilters from "./components/articleFilters";
import ArticleCard from "./components/articleCard";
import {
  DEFAULT_FILTERS,
  TArticleFilters,
  toArticleQuery,
} from "./components/articleFilterConstants";

const LIMIT = 10;

/* Debounce so we don't fire a request per keystroke */
function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

type TFeed = {
  key: string;
  items: TArticle[];
  hasNext: boolean;
  total: number;
};

export default function ArticleFeedPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(filters.search);

  const queryFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );
  const filterKey = JSON.stringify(queryFilters);

  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const page = pageState.key === filterKey ? pageState.page : 1;

  const { currentData, isFetching, error } = useGetAllArticlesQuery(
    toArticleQuery(queryFilters, page, LIMIT),
  );

  const [feed, setFeed] = useState<TFeed>({
    key: "",
    items: [],
    hasNext: false,
    total: 0,
  });

  useEffect(() => {
    if (!currentData) return;
    const { data: newItems, meta } = currentData;

    setFeed((prev) => {
      const merged =
        prev.key === filterKey ? [...prev.items, ...newItems] : newItems;
      const unique = Array.from(
        new Map(merged.map((a) => [a._id, a])).values(),
      );

      return {
        key: filterKey,
        items: unique,
        hasNext: meta.hasNext ?? meta.page < meta.totalPages,
        total: meta.total,
      };
    });
  }, [currentData, filterKey]);

  const isCurrent = feed.key === filterKey;
  const articles = isCurrent ? feed.items : [];
  const hasMore = isCurrent && feed.hasNext;

  const loadMore = () => {
    if (isFetching) return;
    setPageState({ key: filterKey, page: page + 1 });
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.category || filters.petType || filters.isPremium,
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-customBlue">
          The Pet People&apos;s Journal
        </h1>
        <p className="text-sm text-default-500">
          Tips, stories and advice from the pet community.
        </p>
      </div>

      <ArticleFilters
        filters={filters}
        total={isCurrent ? feed.total : undefined}
        onChange={setFilters}
      />

      {articles.length === 0 && isFetching && <LoaderNewsfeed />}

      {error && articles.length === 0 && <ErrorNewsfeed />}

      {isCurrent && !isFetching && !error && articles.length === 0 && (
        <div className="py-6 text-center text-gray-500">
          <NoArticlesFound />
          {hasActiveFilters && (
            <Button
              className="mt-3"
              size="sm"
              startContent={<X size={14} />}
              variant="flat"
              onPress={() =>
                setFilters({ ...DEFAULT_FILTERS, sort: filters.sort })
              }
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {articles.length > 0 && (
        <InfiniteScroll
          dataLength={articles.length}
          endMessage={
            <p className="my-6 text-center text-sm text-default-400">
              You&apos;re all caught up 🐾
            </p>
          }
          hasMore={hasMore}
          loader={<LoaderNewsfeed />}
          next={loadMore}
        >
          <div className="flex flex-col gap-5 p-1">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}
