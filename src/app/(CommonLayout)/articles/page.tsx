// "use client";

// import { useState, useEffect } from "react";
// import {
//   Input,
//   Button,
//   Select,
//   SelectItem,
//   Divider,
//   Skeleton,
// } from "@heroui/react";
// import { Search, X } from "lucide-react";
// import InfiniteScroll from "react-infinite-scroll-component";

// import GeneralArticleCard from "./components/generalArticleCard";

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
//   const [hasMore, setHasMore] = useState(true);

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
//       setArticles(fetchedArticles.data.slice(0, page * 10)); // Show 10 articles initially
//       setHasMore(fetchedArticles.data.length > articles.length); // Check if there are more articles
//     }
//   }, [fetchedArticles, page]);

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
//     <div className="p-3 rounded-lg shadow-md bg-white py-6 sm:py-8 lg:py-12 md:w-10/12 w-full mx-auto mb-36 mt-16">
//       {/* Search and Reset Section */}
//       <div className="flex flex-col md:flex-row justify-between md:items-center items-start gap-4 mb-4">
//         <h1 className="font-semibold text-2xl text-customBlue w-full md:w-1/2">
//           Articles
//         </h1>
//         <div className="flex space-x-2 items-start  md:items-end w-full md:w-1/2">
//           <Input
//             className="flex-grow"
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
//       <div className="lg:grid lg:grid-cols-4 gap-6 flex flex-wrap lg:justify-evenly items-center mb-4">
//         <Select
//           className="max-w-full"
//           name="category"
//           placeholder="Category"
//           size="sm"
//           value={filters.category}
//           onChange={handleInputChange}
//         >
//           <SelectItem key="All" value="All">
//             All
//           </SelectItem>
//           <SelectItem key="Tip" value="Tip">
//             Tip
//           </SelectItem>
//           <SelectItem key="Story" value="Story">
//             Story
//           </SelectItem>
//         </Select>

//         <Select
//           className="max-w-full"
//           name="isPremium"
//           placeholder="Type"
//           size="sm"
//           value={filters.isPremium}
//           onChange={handleInputChange}
//         >
//           <SelectItem key="All" value="All">
//             All
//           </SelectItem>
//           <SelectItem key="Free" value="Free">
//             Free
//           </SelectItem>
//           <SelectItem key="Premium" value="Premium">
//             Premium
//           </SelectItem>
//         </Select>

//         <Select
//           className="max-w-full"
//           placeholder="Sort by Date"
//           size="sm"
//           value={sortOrder}
//           onChange={handleSortChange}
//         >
//           <SelectItem key="newest" value="newest">
//             Newest
//           </SelectItem>
//           <SelectItem key="oldest" value="oldest">
//             Oldest
//           </SelectItem>
//         </Select>

//         <Select
//           className="max-w-full"
//           placeholder="Sort by Voting"
//           size="sm"
//           value={votingOrder}
//           onChange={handleVotingFilterChange}
//         >
//           <SelectItem key="upvotes" value="upvotes">
//             Upvotes
//           </SelectItem>
//           <SelectItem key="downvotes" value="downvotes">
//             Downvotes
//           </SelectItem>
//         </Select>
//       </div>

//       <Divider className="my-4" />

//       <div className="p-2">
//         {error ? (
//           <p className="text-center text-red-500">Error loading data</p>
//         ) : (
//           <InfiniteScroll
//             dataLength={filteredArticles.length}
//             endMessage={
//               <p className="text-center text-gray-500 my-4">
//                 No more articles to load.
//               </p>
//             }
//             hasMore={hasMore}
//             loader={
//               <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
//                 {[...Array(4)].map((_, index) => (
//                   <Skeleton key={index} className="h-56 w-full rounded-lg" />
//                 ))}
//               </div>
//             }
//             next={loadMore}
//           >
//             {/* Article Grid */}
//             <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
//               {isLoading ? (
//                 [...Array(4)].map((_, index) => (
//                   <Skeleton key={index} className="h-56 w-full rounded-lg" />
//                 ))
//               ) : filteredArticles.length > 0 ? (
//                 filteredArticles.map((article) => (
//                   <GeneralArticleCard key={article?._id} article={article} />
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500 col-span-2">
//                   <NoArticlesFound />
//                 </p>
//               )}
//             </div>
//           </InfiniteScroll>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Page;
import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
