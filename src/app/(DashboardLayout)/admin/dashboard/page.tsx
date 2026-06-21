"use client";

import React, { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Users, FileText, DollarSign, ThumbsUp } from "lucide-react";
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
} from "recharts";

import { useGetAllUsersQuery } from "@/src/redux/features/user/userApi";
import { useGetAllArticlesQuery } from "@/src/redux/features/articles/articlesApi";
import { useGetAllPaymentsQuery } from "@/src/redux/features/payment/paymentApi";
import { TArticle, TComment, TTransaction } from "@/src/types";
import { useGetAllReactionForAdminQuery } from "@/src/redux/features/reactions/reactionsApi";
import { useGetAllCommentsForAdminQuery } from "@/src/redux/features/comments/commentsApi";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// export const dummyComments = [
//   {
//     _id: "6702a7394579b7ede668ea3f",
//     articleId: "67015d61328dbbe36241d893",
//     commenter: {
//       commenterId: "67003d8af8ceab932aba1e52",
//       name: "Nusrat",
//       profilePhoto:
//         "https://res.cloudinary.com/dvkpou1bp/image/upload/v1728068972/arbknzwey2bcxgw4bvmp.jpg",
//     },
//     content: "Nice article check",
//     upvotes: 0,
//     downvotes: 0,
//     voteInfo: [],
//     createdAt: "2024-10-06T15:05:29.427Z",
//     updatedAt: "2024-10-06T15:05:29.427Z",
//     __v: 0,
//   },
//   {
//     _id: "6702a7394579b7ede668ea40",
//     articleId: "67015d61328dbbe36241d894",
//     commenter: {
//       commenterId: "67003d8af8ceab932aba1e53",
//       name: "John Doe",
//       profilePhoto:
//         "https://res.cloudinary.com/dvkpou1bp/image/upload/v1728068973/abcdefghijklmno.jpg",
//     },
//     content: "Great insights! Thanks for sharing.",
//     upvotes: 2,
//     downvotes: 0,
//     voteInfo: [],
//     createdAt: "2024-10-07T10:15:30.000Z",
//     updatedAt: "2024-10-07T10:15:30.000Z",
//     __v: 0,
//   },
//   {
//     _id: "6702a7394579b7ede668ea41",
//     articleId: "67015d61328dbbe36241d895",
//     commenter: {
//       commenterId: "67003d8af8ceab932aba1e54",
//       name: "Jane Smith",
//       profilePhoto:
//         "https://res.cloudinary.com/dvkpou1bp/image/upload/v1728068974/pqrstuvwxyz.jpg",
//     },
//     content: "I have a question about the third point. Can you elaborate?",
//     upvotes: 1,
//     downvotes: 0,
//     voteInfo: [],
//     createdAt: "2024-10-08T14:30:45.000Z",
//     updatedAt: "2024-10-08T14:30:45.000Z",
//     __v: 0,
//   },
// ];

// export const dummyReactions = [
//   {
//     _id: "67856e1224406eac94ecd1fe",
//     articleId: "67015d61328dbbe36241d893",
//     userId: "678299d038fe32f2152a5e42",
//     reactionType: "wow",
//     reactedAt: "2025-01-13T19:48:34.403Z",
//     createdAt: "2025-01-13T19:48:34.404Z",
//     updatedAt: "2025-01-13T21:15:18.093Z",
//     __v: 0,
//   },
//   {
//     _id: "67856e1224406eac94ecd1ff",
//     articleId: "67015d61328dbbe36241d894",
//     userId: "678299d038fe32f2152a5e43",
//     reactionType: "like",
//     reactedAt: "2025-01-14T10:30:00.000Z",
//     createdAt: "2025-01-14T10:30:00.000Z",
//     updatedAt: "2025-01-14T10:30:00.000Z",
//     __v: 0,
//   },
//   {
//     _id: "67856e1224406eac94ecd200",
//     articleId: "67015d61328dbbe36241d895",
//     userId: "678299d038fe32f2152a5e44",
//     reactionType: "love",
//     reactedAt: "2025-01-15T08:45:30.000Z",
//     createdAt: "2025-01-15T08:45:30.000Z",
//     updatedAt: "2025-01-15T08:45:30.000Z",
//     __v: 0,
//   },
// ];

export default function AdminDashboard() {
  const { data: allUsers } = useGetAllUsersQuery(undefined);
  const { data: allArticles } = useGetAllArticlesQuery(undefined);
  const { data: allTransactions } = useGetAllPaymentsQuery(undefined);
  const { data: allReactions } = useGetAllReactionForAdminQuery(undefined);
  const { data: allComments } = useGetAllCommentsForAdminQuery(undefined);

  // console.log(allReactions?.data.length, allArticles?.data.length);
  // console.log(allComments);

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

    allArticles?.data?.forEach((article: TArticle) => {
      const articleDate = new Date(article.createdAt);

      if (articleDate >= sevenDaysAgo) {
        const index = data.findIndex(
          (d) => d.date === articleDate.toISOString().split("T")[0],
        );

        if (index !== -1) {
          data[index].articles++;
        }
      }
    });

    allComments?.data?.forEach((comment: TComment) => {
      const commentDate = new Date(comment.createdAt);

      if (commentDate >= sevenDaysAgo) {
        const index = data.findIndex(
          (d) => d.date === commentDate.toISOString().split("T")[0],
        );

        if (index !== -1) {
          data[index].comments++;
        }
      }
    });

    allReactions?.data?.forEach((reaction: any) => {
      const reactionDate = new Date(reaction.createdAt);

      if (reactionDate >= sevenDaysAgo) {
        const index = data.findIndex(
          (d) => d.date === reactionDate.toISOString().split("T")[0],
        );

        if (index !== -1) {
          data[index].reactions++;
        }
      }
    });

    return data;
  }, [allArticles, allComments, allReactions]);

  // Last 7 days activity data
  // const last7DaysData = [
  //   { day: "Mon", articles: 5, comments: 12, reactions: 45 },
  //   { day: "Tue", articles: 7, comments: 15, reactions: 52 },
  //   { day: "Wed", articles: 3, comments: 8, reactions: 30 },
  //   { day: "Thu", articles: 8, comments: 20, reactions: 65 },
  //   { day: "Fri", articles: 6, comments: 18, reactions: 48 },
  //   { day: "Sat", articles: 4, comments: 10, reactions: 38 },
  //   { day: "Sun", articles: 9, comments: 25, reactions: 70 },
  // ];

  // Calculate revenue metrics
  const totalAmount =
    allTransactions?.data?.reduce(
      (acc: number, transaction: TTransaction) => acc + transaction.amount,
      0,
    ) || 0;
  const revenue = totalAmount * 0.3;

  // Group articles by paid vs free
  const paidArticles =
    allArticles?.data?.filter((article: any) => article.isPremium) || [];
  const freeArticles =
    allArticles?.data?.filter((article: any) => !article.isPremium) || [];

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

  // Content distribution data
  const contentDistribution = [
    { name: "Paid Articles", value: paidArticles.length },
    { name: "Free Articles", value: freeArticles.length },
  ];

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-100 pb-12 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Platform overview and analytics
          </p>
        </div>
        {/* <Dropdown>
          <DropdownTrigger>
            <Button variant="flat">Export Data</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Export options">
            <DropdownItem key="pdf">Export as PDF</DropdownItem>
            <DropdownItem key="csv">Export as CSV</DropdownItem>
          </DropdownMenu>
        </Dropdown> */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {summaryCards.map((card, index) => (
          <Card
            key={index}
            className="bg-white shadow-sm hover:shadow-md transition-shadow text-black"
          >
            <CardBody className="flex   gap-0 items-center p-4">
              <div
                className={`flex flex-row items-center justify-center gap-3 p-3 rounded-full ${card.color.replace("text-", "bg-").replace("500", "100")} mr-4`}
              >
                <card.icon className={`w-5 h-5 ${card.color}`} />
                <p className="text-sm text-gray-500">{card.title}</p>
              </div>
              <div className="flex flex-row justify-center gap-2 items-baseline">
                <p className="text-xl font-semibold">{card.value}</p>
                <p className="text-xs text-gray-400">{card.subtitle}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Activity Timeline */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-0 pt-4 px-6">
            <div>
              <h4 className="text-lg font-semibold">Platform Activity</h4>
              <p className="text-sm text-gray-500">Last 7 days engagement</p>
            </div>
          </CardHeader>
          <CardBody className="px-2 pt-0">
            <ResponsiveContainer height={250} width="100%">
              <LineChart
                data={last7DaysData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  dataKey="articles"
                  name="New Articles"
                  stroke="#8884d8"
                  type="monotone"
                />
                <Line
                  dataKey="comments"
                  name="Comments"
                  stroke="#82ca9d"
                  type="monotone"
                />
                <Line
                  dataKey="reactions"
                  name="Reactions"
                  stroke="#ffc658"
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Content Distribution */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-0 pt-4 px-6">
            <div>
              <h4 className="text-lg font-semibold">Content Distribution</h4>
              <p className="text-sm text-gray-500">Paid vs Free Content</p>
            </div>
          </CardHeader>
          <CardBody className="px-2 pt-0 text-sm">
            <ResponsiveContainer height={250} width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={contentDistribution}
                  dataKey="value"
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  outerRadius={80}
                >
                  {contentDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Comments */}
        <Card className="bg-white shadow-sm text-black text-xs">
          <CardHeader className="pb-0 pt-4 px-6">
            <div>
              <h4 className="text-lg font-semibold">Recent Comments</h4>
              <p className="text-sm text-gray-500">Latest user interactions</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      User
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Content
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allComments?.data.slice(0, 5).map((comment: TComment) => (
                    <tr
                      key={comment._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm">
                        {comment.commenter.name}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {comment.content.substring(0, 30)}...
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-white shadow-sm text-black text-xs">
          <CardHeader className="pb-0 pt-4 px-6">
            <div>
              <h4 className="text-lg font-semibold">Recent Transactions</h4>
              <p className="text-sm text-gray-500">Latest financial activity</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(allTransactions?.data || [])
                    .slice(0, 5)
                    .map((transaction: TTransaction) => (
                      <tr
                        key={transaction._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm">
                          {/* {transaction._id.toString().slice(-6)} */}
                          {transaction._id.toString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          ${transaction.amount}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
