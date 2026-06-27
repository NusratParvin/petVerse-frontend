// "use client";

// import React, { useMemo } from "react";
// import { Card, CardBody, CardHeader } from "@heroui/react";
// import { Users, FileText, DollarSign, ThumbsUp } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// import { useGetAllUsersQuery } from "@/src/redux/features/user/userApi";
// import { useGetAllArticlesQuery } from "@/src/redux/features/articles/articlesApi";
// import { useGetAllPaymentsQuery } from "@/src/redux/features/payment/paymentApi";
// import { TArticle, TComment, TTransaction } from "@/src/types";
// import { useGetAllReactionForAdminQuery } from "@/src/redux/features/reactions/reactionsApi";
// import { useGetAllCommentsForAdminQuery } from "@/src/redux/features/comments/commentsApi";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// // export const dummyComments = [
// //   {
// //     _id: "6702a7394579b7ede668ea3f",
// //     articleId: "67015d61328dbbe36241d893",
// //     commenter: {
// //       commenterId: "67003d8af8ceab932aba1e52",
// //       name: "Nusrat",
// //       profilePhoto:
// //         "https://res.cloudinary.com/dvkpou1bp/image/upload/v1728068972/arbknzwey2bcxgw4bvmp.jpg",
// //     },
// //     content: "Nice article check",
// //     upvotes: 0,
// //     downvotes: 0,
// //     voteInfo: [],
// //     createdAt: "2024-10-06T15:05:29.427Z",
// //     updatedAt: "2024-10-06T15:05:29.427Z",
// //     __v: 0,
// //   },
// //   {
// //     _id: "6702a7394579b7ede668ea40",
// //     articleId: "67015d61328dbbe36241d894",
// //     commenter: {
// //       commenterId: "67003d8af8ceab932aba1e53",
// //       name: "John Doe",
// //       profilePhoto:
// //         "https://res.cloudinary.com/dvkpou1bp/image/upload/v1728068973/abcdefghijklmno.jpg",
// //     },
// //     content: "Great insights! Thanks for sharing.",
// //     upvotes: 2,
// //     downvotes: 0,
// //     voteInfo: [],
// //     createdAt: "2024-10-07T10:15:30.000Z",
// //     updatedAt: "2024-10-07T10:15:30.000Z",
// //     __v: 0,
// //   },
// //   {
// //     _id: "6702a7394579b7ede668ea41",
// //     articleId: "67015d61328dbbe36241d895",
// //     commenter: {
// //       commenterId: "67003d8af8ceab932aba1e54",
// //       name: "Jane Smith",
// //       profilePhoto:
// //         "https://res.cloudinary.com/dvkpou1bp/image/upload/v1728068974/pqrstuvwxyz.jpg",
// //     },
// //     content: "I have a question about the third point. Can you elaborate?",
// //     upvotes: 1,
// //     downvotes: 0,
// //     voteInfo: [],
// //     createdAt: "2024-10-08T14:30:45.000Z",
// //     updatedAt: "2024-10-08T14:30:45.000Z",
// //     __v: 0,
// //   },
// // ];

// // export const dummyReactions = [
// //   {
// //     _id: "67856e1224406eac94ecd1fe",
// //     articleId: "67015d61328dbbe36241d893",
// //     userId: "678299d038fe32f2152a5e42",
// //     reactionType: "wow",
// //     reactedAt: "2025-01-13T19:48:34.403Z",
// //     createdAt: "2025-01-13T19:48:34.404Z",
// //     updatedAt: "2025-01-13T21:15:18.093Z",
// //     __v: 0,
// //   },
// //   {
// //     _id: "67856e1224406eac94ecd1ff",
// //     articleId: "67015d61328dbbe36241d894",
// //     userId: "678299d038fe32f2152a5e43",
// //     reactionType: "like",
// //     reactedAt: "2025-01-14T10:30:00.000Z",
// //     createdAt: "2025-01-14T10:30:00.000Z",
// //     updatedAt: "2025-01-14T10:30:00.000Z",
// //     __v: 0,
// //   },
// //   {
// //     _id: "67856e1224406eac94ecd200",
// //     articleId: "67015d61328dbbe36241d895",
// //     userId: "678299d038fe32f2152a5e44",
// //     reactionType: "love",
// //     reactedAt: "2025-01-15T08:45:30.000Z",
// //     createdAt: "2025-01-15T08:45:30.000Z",
// //     updatedAt: "2025-01-15T08:45:30.000Z",
// //     __v: 0,
// //   },
// // ];

// export default function AdminDashboard() {
//   const { data: allUsers } = useGetAllUsersQuery(undefined);
//   const { data: allArticles } = useGetAllArticlesQuery(undefined);
//   const { data: allTransactions } = useGetAllPaymentsQuery(undefined);
//   const { data: allReactions } = useGetAllReactionForAdminQuery(undefined);
//   const { data: allComments } = useGetAllCommentsForAdminQuery(undefined);

//   // console.log(allReactions?.data.length, allArticles?.data.length);
//   // console.log(allComments);

//   const last7DaysData = useMemo(() => {
//     const now = new Date();
//     const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

//     const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//     const data = Array(7)
//       .fill(0)
//       .map((_, index) => {
//         const date = new Date(
//           now.getTime() - (6 - index) * 24 * 60 * 60 * 1000,
//         );

//         return {
//           day: dayNames[date.getDay()],
//           date: date.toISOString().split("T")[0],
//           articles: 0,
//           comments: 0,
//           reactions: 0,
//         };
//       });

//     allArticles?.data?.forEach((article: TArticle) => {
//       const articleDate = new Date(article.createdAt);

//       if (articleDate >= sevenDaysAgo) {
//         const index = data.findIndex(
//           (d) => d.date === articleDate.toISOString().split("T")[0],
//         );

//         if (index !== -1) {
//           data[index].articles++;
//         }
//       }
//     });

//     allComments?.data?.forEach((comment: TComment) => {
//       const commentDate = new Date(comment.createdAt);

//       if (commentDate >= sevenDaysAgo) {
//         const index = data.findIndex(
//           (d) => d.date === commentDate.toISOString().split("T")[0],
//         );

//         if (index !== -1) {
//           data[index].comments++;
//         }
//       }
//     });

//     allReactions?.data?.forEach((reaction: any) => {
//       const reactionDate = new Date(reaction.createdAt);

//       if (reactionDate >= sevenDaysAgo) {
//         const index = data.findIndex(
//           (d) => d.date === reactionDate.toISOString().split("T")[0],
//         );

//         if (index !== -1) {
//           data[index].reactions++;
//         }
//       }
//     });

//     return data;
//   }, [allArticles, allComments, allReactions]);

//   // Last 7 days activity data
//   // const last7DaysData = [
//   //   { day: "Mon", articles: 5, comments: 12, reactions: 45 },
//   //   { day: "Tue", articles: 7, comments: 15, reactions: 52 },
//   //   { day: "Wed", articles: 3, comments: 8, reactions: 30 },
//   //   { day: "Thu", articles: 8, comments: 20, reactions: 65 },
//   //   { day: "Fri", articles: 6, comments: 18, reactions: 48 },
//   //   { day: "Sat", articles: 4, comments: 10, reactions: 38 },
//   //   { day: "Sun", articles: 9, comments: 25, reactions: 70 },
//   // ];

//   // Calculate revenue metrics
//   const totalAmount =
//     allTransactions?.data?.reduce(
//       (acc: number, transaction: TTransaction) => acc + transaction.amount,
//       0,
//     ) || 0;
//   const revenue = totalAmount * 0.3;

//   // Group articles by paid vs free
//   const paidArticles =
//     allArticles?.data?.filter((article: any) => article.isPremium) || [];
//   const freeArticles =
//     allArticles?.data?.filter((article: any) => !article.isPremium) || [];

//   const summaryCards = [
//     {
//       title: "Active Users",
//       value: allUsers?.data?.length || 0,
//       icon: Users,
//       color: "text-blue-500",
//       subtitle: "Total registered users",
//     },
//     {
//       title: "Premium Articles",
//       value: paidArticles.length,
//       icon: FileText,
//       color: "text-green-500",
//       subtitle: "Paid content",
//     },
//     {
//       title: "Monthly Revenue",
//       value: `$${revenue.toFixed(2)}`,
//       icon: DollarSign,
//       color: "text-purple-500",
//       subtitle: "Platform earnings",
//     },
//     {
//       title: "Engagement Rate",
//       value: `${(((allReactions?.data?.length || 0) / (allArticles?.data?.length || 1)) * 100).toFixed(1)}%`,
//       icon: ThumbsUp,
//       color: "text-yellow-500",
//       subtitle: "Reactions per article",
//     },
//   ];

//   // Content distribution data
//   const contentDistribution = [
//     { name: "Paid Articles", value: paidArticles.length },
//     { name: "Free Articles", value: freeArticles.length },
//   ];

//   return (
//     <div className="flex flex-col gap-2 p-4 bg-gray-100 pb-12 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
//           <p className="text-gray-500 text-sm">
//             Platform overview and analytics
//           </p>
//         </div>
//         {/* <Dropdown>
//           <DropdownTrigger>
//             <Button variant="flat">Export Data</Button>
//           </DropdownTrigger>
//           <DropdownMenu aria-label="Export options">
//             <DropdownItem key="pdf">Export as PDF</DropdownItem>
//             <DropdownItem key="csv">Export as CSV</DropdownItem>
//           </DropdownMenu>
//         </Dropdown> */}
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//         {summaryCards.map((card, index) => (
//           <Card
//             key={index}
//             className="bg-white shadow-sm hover:shadow-md transition-shadow text-black"
//           >
//             <CardBody className="flex   gap-0 items-center p-4">
//               <div
//                 className={`flex flex-row items-center justify-center gap-3 p-3 rounded-full ${card.color.replace("text-", "bg-").replace("500", "100")} mr-4`}
//               >
//                 <card.icon className={`w-5 h-5 ${card.color}`} />
//                 <p className="text-sm text-gray-500">{card.title}</p>
//               </div>
//               <div className="flex flex-row justify-center gap-2 items-baseline">
//                 <p className="text-xl font-semibold">{card.value}</p>
//                 <p className="text-xs text-gray-400">{card.subtitle}</p>
//               </div>
//             </CardBody>
//           </Card>
//         ))}
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         {/* Activity Timeline */}
//         <Card className="bg-white shadow-sm">
//           <CardHeader className="pb-0 pt-4 px-6">
//             <div>
//               <h4 className="text-lg font-semibold">Platform Activity</h4>
//               <p className="text-sm text-gray-500">Last 7 days engagement</p>
//             </div>
//           </CardHeader>
//           <CardBody className="px-2 pt-0">
//             <ResponsiveContainer height={250} width="100%">
//               <LineChart
//                 data={last7DaysData}
//                 margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   dataKey="articles"
//                   name="New Articles"
//                   stroke="#8884d8"
//                   type="monotone"
//                 />
//                 <Line
//                   dataKey="comments"
//                   name="Comments"
//                   stroke="#82ca9d"
//                   type="monotone"
//                 />
//                 <Line
//                   dataKey="reactions"
//                   name="Reactions"
//                   stroke="#ffc658"
//                   type="monotone"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardBody>
//         </Card>

//         {/* Content Distribution */}
//         <Card className="bg-white shadow-sm">
//           <CardHeader className="pb-0 pt-4 px-6">
//             <div>
//               <h4 className="text-lg font-semibold">Content Distribution</h4>
//               <p className="text-sm text-gray-500">Paid vs Free Content</p>
//             </div>
//           </CardHeader>
//           <CardBody className="px-2 pt-0 text-sm">
//             <ResponsiveContainer height={250} width="100%">
//               <PieChart>
//                 <Pie
//                   cx="50%"
//                   cy="50%"
//                   data={contentDistribution}
//                   dataKey="value"
//                   fill="#8884d8"
//                   label={({ name, percent }) =>
//                     `${name} ${(percent * 100).toFixed(0)}%`
//                   }
//                   labelLine={false}
//                   outerRadius={80}
//                 >
//                   {contentDistribution.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardBody>
//         </Card>
//       </div>

//       {/* Recent Activity Tables */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Comments */}
//         <Card className="bg-white shadow-sm text-black text-xs">
//           <CardHeader className="pb-0 pt-4 px-6">
//             <div>
//               <h4 className="text-lg font-semibold">Recent Comments</h4>
//               <p className="text-sm text-gray-500">Latest user interactions</p>
//             </div>
//           </CardHeader>
//           <CardBody>
//             <div className="overflow-x-auto">
//               <table className="min-w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
//                       User
//                     </th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
//                       Content
//                     </th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
//                       Date
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {allComments?.data.slice(0, 5).map((comment: TComment) => (
//                     <tr
//                       key={comment._id}
//                       className="border-b border-gray-100 hover:bg-gray-50"
//                     >
//                       <td className="px-4 py-3 text-sm">
//                         {comment.commenter.name}
//                       </td>
//                       <td className="px-4 py-3 text-sm">
//                         {comment.content.substring(0, 30)}...
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-500">
//                         {new Date(comment.createdAt).toLocaleDateString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardBody>
//         </Card>

//         {/* Recent Transactions */}
//         <Card className="bg-white shadow-sm text-black text-xs">
//           <CardHeader className="pb-0 pt-4 px-6">
//             <div>
//               <h4 className="text-lg font-semibold">Recent Transactions</h4>
//               <p className="text-sm text-gray-500">Latest financial activity</p>
//             </div>
//           </CardHeader>
//           <CardBody>
//             <div className="overflow-x-auto">
//               <table className="min-w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
//                       ID
//                     </th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
//                       Amount
//                     </th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
//                       Date
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(allTransactions?.data || [])
//                     .slice(0, 5)
//                     .map((transaction: TTransaction) => (
//                       <tr
//                         key={transaction._id}
//                         className="border-b border-gray-100 hover:bg-gray-50"
//                       >
//                         <td className="px-4 py-3 text-sm">
//                           {/* {transaction._id.toString().slice(-6)} */}
//                           {transaction._id.toString()}
//                         </td>
//                         <td className="px-4 py-3 text-sm">
//                           ${transaction.amount}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-500">
//                           {new Date(transaction.createdAt).toLocaleDateString()}
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardBody>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  Users,
  FileText,
  DollarSign,
  ThumbsUp,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useRouter } from "next/navigation";
import { useGetAllUsersQuery } from "@/src/redux/features/user/userApi";
import { useGetAllArticlesQuery } from "@/src/redux/features/articles/articlesApi";
import { useGetAllPaymentsQuery } from "@/src/redux/features/payment/paymentApi";
import { useGetAllReactionForAdminQuery } from "@/src/redux/features/reactions/reactionsApi";
import {
  useGetAllCommentsForAdminQuery,
  useGetCommentStatsQuery,
} from "@/src/redux/features/comments/commentsApi";
import { useGetLostFoundStatsQuery } from "@/src/redux/features/lostFound/lostFoundApi";
import { TArticle, TComment, TTransaction } from "@/src/types";
import { formatEmirate } from "../vets/components/utils";
import { useGetVetStatsQuery } from "@/src/redux/features/vets/vetsApi";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const cardClass =
  "bg-white dark:bg-zinc-900/60 shadow-sm dark:shadow-primary rounded-md border border-zinc-100 dark:border-zinc-800/60";
const headerClass = "text-sm font-semibold text-zinc-800 dark:text-zinc-100";
const subClass = "text-[10px] text-zinc-400 mt-0.5";

export default function AdminDashboard() {
  const router = useRouter();

  const { data: allUsers } = useGetAllUsersQuery(undefined);
  const { data: allArticles } = useGetAllArticlesQuery(undefined);
  const { data: allTransactions } = useGetAllPaymentsQuery(undefined);
  const { data: allReactions } = useGetAllReactionForAdminQuery(undefined);
  const { data: allComments } = useGetAllCommentsForAdminQuery(undefined);
  const { data: commentStatsData } = useGetCommentStatsQuery(undefined);
  const { data: vetStatsData } = useGetVetStatsQuery(undefined);
  const { data: lostFoundStatsData } = useGetLostFoundStatsQuery(undefined);

  const commentStats = commentStatsData?.data;
  const vetStats = vetStatsData?.data;
  const lostFoundStats = lostFoundStatsData?.data;

  // Platform activity last 7 days
  const last7DaysData = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const data = Array(7)
      .fill(0)
      .map((_, index) => {
        const date = new Date(
          now.getTime() - (6 - index) * 24 * 60 * 60 * 1000,
        );
        return {
          day: dayNames[date.getDay()],
          date: date.toISOString().split("T")[0],
          articles: 0,
          comments: 0,
          reactions: 0,
        };
      });

    allArticles?.data?.forEach((a: TArticle) => {
      const d = new Date(a.createdAt);
      if (d >= sevenDaysAgo) {
        const i = data.findIndex(
          (x) => x.date === d.toISOString().split("T")[0],
        );
        if (i !== -1) data[i].articles++;
      }
    });
    allComments?.data?.forEach((c: TComment) => {
      const d = new Date(c.createdAt);
      if (d >= sevenDaysAgo) {
        const i = data.findIndex(
          (x) => x.date === d.toISOString().split("T")[0],
        );
        if (i !== -1) data[i].comments++;
      }
    });
    allReactions?.data?.forEach((r: any) => {
      const d = new Date(r.createdAt);
      if (d >= sevenDaysAgo) {
        const i = data.findIndex(
          (x) => x.date === d.toISOString().split("T")[0],
        );
        if (i !== -1) data[i].reactions++;
      }
    });

    return data;
  }, [allArticles, allComments, allReactions]);

  const totalAmount =
    allTransactions?.data?.reduce(
      (acc: number, t: TTransaction) => acc + t.amount,
      0,
    ) || 0;
  const revenue = totalAmount * 0.3;
  const paidArticles = allArticles?.data?.filter((a: any) => a.isPremium) || [];
  const freeArticles =
    allArticles?.data?.filter((a: any) => !a.isPremium) || [];
  const contentDistribution = [
    { name: "Paid Articles", value: paidArticles.length },
    { name: "Free Articles", value: freeArticles.length },
  ];

  const summaryCards = [
    {
      title: "Active Users",
      value: allUsers?.data?.length || 0,
      icon: Users,
      color: "text-blue-500",
      subtitle: "Total registered users",
    },
    {
      title: "Premium Articles",
      value: paidArticles.length,
      icon: FileText,
      color: "text-green-500",
      subtitle: "Paid content",
    },
    {
      title: "Monthly Revenue",
      value: `$${revenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-500",
      subtitle: "Platform earnings",
    },
    {
      title: "Engagement Rate",
      value: `${(((allReactions?.data?.length || 0) / (allArticles?.data?.length || 1)) * 100).toFixed(1)}%`,
      icon: ThumbsUp,
      color: "text-yellow-500",
      subtitle: "Reactions per article",
    },
  ];

  // Vets coverage gap — merge byEmirate with lostFound byEmirate
  const coverageGapData = useMemo(() => {
    if (!vetStats?.byEmirate || !lostFoundStats?.byEmirate) return [];

    return vetStats.byEmirate
      .map((v: any) => {
        const lf = lostFoundStats.byEmirate.find(
          (l: any) => l.emirate.toLowerCase() === v.emirate.toLowerCase(), // 👈 normalize both
        );
        return {
          emirate: formatEmirate(v.emirate),
          vets: v.count,
          lostPets: lf?.count || 0,
        };
      })
      .sort((a: any, b: any) => b.lostPets - a.lostPets);
  }, [vetStats, lostFoundStats]);

  // console.log("lostFoundStats", lostFoundStats);
  // console.log("lostFoundStatsData", lostFoundStatsData?.data);
  // console.log("vetStats", vetStats);
  // console.log("coverageGapData", coverageGapData);

  // console.log(
  //   "vet emirates",
  //   vetStats.byEmirate.map((v: any) => v.emirate),
  // );
  // console.log(
  //   "lf emirates",
  //   lostFoundStats.byEmirate.map((l: any) => l.emirate),
  // );

  return (
    <div className="flex flex-col gap-4 p-4 pb-12 min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div>
        <h1 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          Admin Dashboard
        </h1>
        <p className="text-[10px] text-zinc-400">
          Platform overview and analytics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className={`${cardClass} p-4 flex items-center gap-3`}
          >
            <div
              className={`p-2 rounded-full ${card.color.replace("text-", "bg-").replace("500", "100")} dark:bg-zinc-800`}
            >
              <card.icon className={`size-4 ${card.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-400">{card.title}</p>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                {card.value}
              </p>
              <p className="text-[9px] text-zinc-400">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Platform Activity */}
        <div className={`${cardClass} p-4`}>
          <p className={headerClass}>Platform Activity</p>
          <p className={subClass}>Last 7 days engagement</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={last7DaysData}
              margin={{ top: 16, right: 16, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line
                dataKey="articles"
                name="Articles"
                stroke="#8b5cf6"
                type="monotone"
                dot={false}
                strokeWidth={1.5}
              />
              <Line
                dataKey="comments"
                name="Comments"
                stroke="#10b981"
                type="monotone"
                dot={false}
                strokeWidth={1.5}
              />
              <Line
                dataKey="reactions"
                name="Reactions"
                stroke="#f59e0b"
                type="monotone"
                dot={false}
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Content Distribution */}
        <div className={`${cardClass} p-4`}>
          <p className={headerClass}>Content Distribution</p>
          <p className={subClass}>Paid vs free content</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={contentDistribution}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={75}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {contentDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New widgets row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vets Coverage Gap Widget */}
        <div className={`${cardClass} p-4`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className={headerClass}>Vet Coverage vs Lost Pets</p>
              <p className={subClass}>
                Emirates with high lost pets but low vet coverage
              </p>
            </div>
            <button
              onClick={() => router.push("/admin/vets")}
              className="flex items-center gap-1 text-[10px] text-steel-blue dark:text-lime-burst hover:underline"
            >
              View vets <ArrowRight className="size-3" />
            </button>
          </div>
          {coverageGapData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={coverageGapData}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 0, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="emirate"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar
                  dataKey="lostPets"
                  name="Lost Pets"
                  fill="#f87171"
                  radius={[0, 3, 3, 0]}
                  maxBarSize={10}
                />
                <Bar
                  dataKey="vets"
                  name="Vet Clinics"
                  fill="#60a5fa"
                  radius={[0, 3, 3, 0]}
                  maxBarSize={10}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[11px] text-zinc-400 mt-4">No data available</p>
          )}
        </div>

        {/* Community Pulse Widget */}
        <div className={`${cardClass} p-4`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className={headerClass}>Community Pulse</p>
              <p className={subClass}>
                Comment activity and sighting conversions
              </p>
            </div>
            <button
              onClick={() => router.push("/admin/comments")}
              className="flex items-center gap-1 text-[10px] text-steel-blue dark:text-lime-burst hover:underline"
            >
              View all <ArrowRight className="size-3" />
            </button>
          </div>

          {/* Inline stat pills */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {[
              {
                label: "Total",
                value: commentStats?.total || 0,
                color:
                  "text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800",
              },
              {
                label: "Sightings",
                value: commentStats?.sightings || 0,
                color:
                  "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
              },
              {
                label: "Helpful leads",
                value: commentStats?.helpfulLeads || 0,
                color:
                  "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${color}`}
              >
                <span>{value}</span>
                <span className="opacity-70">{label}</span>
              </div>
            ))}
          </div>

          {/* Recent activity feed */}
          <div className="space-y-2">
            {commentStats?.recentActivity?.slice(0, 4).map((c) => (
              <div
                key={c._id}
                className="flex items-start gap-2.5 py-1.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <img
                  src={
                    c.commenter.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(c.commenter.name)}&size=28&background=0D8F81&color=fff`
                  }
                  className="size-6 rounded-full flex-shrink-0 mt-0.5"
                  alt={c.commenter.name}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-zinc-700 dark:text-zinc-300 truncate">
                    {c.commenter.name}
                    {c.isSighting && (
                      <span className="ml-1 text-[9px] px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        sighting
                      </span>
                    )}
                    {c.isHelpfulLead && (
                      <span className="ml-1 text-[9px] px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        helpful
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {c.content}
                  </p>
                </div>
                <span className="text-[9px] text-zinc-400 flex-shrink-0">
                  {new Date(c.createdAt).toLocaleDateString("en-AE", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={`${cardClass} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className={headerClass}>Recent Transactions</p>
            <p className={subClass}>Latest financial activity</p>
          </div>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="pb-2 text-left text-zinc-400 font-medium">ID</th>
              <th className="pb-2 text-left text-zinc-400 font-medium">
                Amount
              </th>
              <th className="pb-2 text-left text-zinc-400 font-medium">Date</th>
              <th className="pb-2 text-right text-zinc-400 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {(allTransactions?.data || [])
              .slice(0, 5)
              .map((t: TTransaction) => (
                <tr
                  key={t._id}
                  className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                >
                  <td className="py-2 text-zinc-500 dark:text-zinc-400">
                    {t._id.toString().slice(-8)}
                  </td>
                  <td className="py-2 text-zinc-700 dark:text-zinc-300 font-medium">
                    ${t.amount}
                  </td>
                  <td className="py-2 text-zinc-400">
                    {new Date(t.createdAt).toLocaleDateString("en-AE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2 text-right">
                    <button className="text-[10px] text-steel-blue dark:text-lime-burst hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
