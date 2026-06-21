"use client";
import { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Avatar,
  Input,
  Select,
  SelectItem,
  Tooltip,
  Skeleton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  Search,
  Trash2,
  CheckCircle,
  Eye,
  MapPin,
  Calendar,
  PawPrint,
  TrendingUp,
  AlertCircle,
  Filter,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  useGetAllLostFoundPostsForAdminQuery,
  useGetLostFoundStatsQuery,
  useAdminDeleteLostFoundPostMutation,
  useAdminMarkLostFoundResolvedMutation,
} from "@/src/redux/features/lostFound/lostFoundApi";

// ─── constants ────────────────────────────────────────────────────────────────
const EMIRATES = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "RAK",
  "Fujairah",
  "UAQ",
];
const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Reptile", "Other"];
const COLORS = [
  "#3B82F6",
  "#84cc16",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🐦",
  rabbit: "🐇",
  hamster: "🐹",
  reptile: "🦎",
  other: "🐾",
};

// ─── stat card ────────────────────────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon: any;
}) => (
  <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
    <CardBody className="p-4 flex flex-row items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="size-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          {value}
        </p>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        {sub && <p className="text-[10px] text-zinc-400">{sub}</p>}
      </div>
    </CardBody>
  </Card>
);

// ─── status chip ──────────────────────────────────────────────────────────────
const StatusChip = ({ status, type }: { status: string; type: string }) => {
  if (status === "resolved") {
    return (
      <Chip
        size="sm"
        classNames={{
          base: "bg-emerald-500/10",
          content:
            "text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]",
        }}
      >
        Resolved
      </Chip>
    );
  }
  return type === "lost" ? (
    <Chip
      size="sm"
      classNames={{
        base: "bg-red-500/10",
        content: "text-red-500 font-semibold text-[11px]",
      }}
    >
      Missing
    </Chip>
  ) : (
    <Chip
      size="sm"
      classNames={{
        base: "bg-amber-500/10",
        content: "text-amber-600 font-semibold text-[11px]",
      }}
    >
      Found
    </Chip>
  );
};

// ─── main page ────────────────────────────────────────────────────────────────
export default function ManageLostFoundPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [emirateFilter, setEmirateFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [actionType, setActionType] = useState<"delete" | "resolve" | null>(
    null,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const queryParams = useMemo(() => {
    const p: Record<string, string> = {};
    if (typeFilter) p.type = typeFilter;
    if (statusFilter) p.status = statusFilter;
    if (emirateFilter) p.emirate = emirateFilter;
    if (speciesFilter) p.species = speciesFilter;
    if (search) p.search = search;
    return p;
  }, [typeFilter, statusFilter, emirateFilter, speciesFilter, search]);

  const { data, isLoading, refetch } =
    useGetAllLostFoundPostsForAdminQuery(queryParams);
  const { data: statsData, isLoading: statsLoading } =
    useGetLostFoundStatsQuery(undefined);

  const [adminDelete, { isLoading: deleting }] =
    useAdminDeleteLostFoundPostMutation();
  const [adminResolve, { isLoading: resolving }] =
    useAdminMarkLostFoundResolvedMutation();

  const posts = data?.data ?? [];
  const stats = statsData?.data;

  const confirmAction = (post: any, type: "delete" | "resolve") => {
    setSelectedPost(post);
    setActionType(type);
    onOpen();
  };

  const handleConfirm = async () => {
    if (!selectedPost || !actionType) return;
    const toastId = toast.loading(
      actionType === "delete" ? "Deleting..." : "Resolving...",
    );
    try {
      if (actionType === "delete") {
        await adminDelete(selectedPost._id).unwrap();
        toast.success("Post deleted", { id: toastId });
      } else {
        await adminResolve(selectedPost._id).unwrap();
        toast.success("Post marked as resolved", { id: toastId });
      }
      onClose();
    } catch {
      toast.error("Action failed", { id: toastId });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
    setEmirateFilter("");
    setSpeciesFilter("");
  };

  const hasFilters =
    search || typeFilter || statusFilter || emirateFilter || speciesFilter;

  // chart data
  const pieData = stats
    ? [
        { name: "Active", value: stats.active },
        { name: "Resolved", value: stats.resolved },
      ]
    : [];

  const typeData = stats
    ? [
        { name: "Lost", value: stats.lost },
        { name: "Found", value: stats.found },
      ]
    : [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pb-16 space-y-6">
      {/* ── header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <PawPrint className="size-5 text-steel-blue dark:text-lime-burst" />
            Lost & Found Management
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitor, moderate and manage all lost & found posts
          </p>
        </div>
        <Button
          size="sm"
          variant="flat"
          onPress={() => refetch()}
          startContent={<RefreshCw className="size-3.5" />}
          className="text-xs text-zinc-600 dark:text-zinc-400 self-start sm:self-auto"
        >
          Refresh
        </Button>
      </div>

      {/* ── stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsLoading ? (
          Array(4)
            .fill(0)
            .map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
        ) : (
          <>
            <StatCard
              label="Total Posts"
              value={stats?.total ?? 0}
              icon={PawPrint}
              color="bg-steel-blue"
            />
            <StatCard
              label="Active"
              value={stats?.active ?? 0}
              sub="needs attention"
              icon={AlertCircle}
              color="bg-amber-500"
            />
            <StatCard
              label="Resolved"
              value={stats?.resolved ?? 0}
              sub="reunited"
              icon={CheckCircle}
              color="bg-emerald-500"
            />
            <StatCard
              label="Resolution Rate"
              value={`${stats?.resolutionRate ?? 0}%`}
              icon={TrendingUp}
              color="bg-lime-600"
            />
          </>
        )}
      </div>

      {/* ── charts ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* status pie */}
        <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <CardHeader className="pb-0 px-5 pt-4">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Status Split
            </p>
          </CardHeader>
          <CardBody className="pt-0 px-2">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* lost vs found bar */}
        <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <CardHeader className="pb-0 px-5 pt-4">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Lost vs Found
            </p>
          </CardHeader>
          <CardBody className="pt-0 px-2">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={typeData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ReTooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {typeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* species breakdown */}
        <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <CardHeader className="pb-0 px-5 pt-4">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              By Species
            </p>
          </CardHeader>
          <CardBody className="pt-2 px-5 space-y-2 overflow-y-auto max-h-44">
            {stats?.speciesBreakdown?.map((s: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {SPECIES_EMOJI[s._id?.toLowerCase()] ?? "🐾"}
                  </span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 capitalize">
                    {s._id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-steel-blue dark:bg-lime-burst"
                      style={{
                        width: `${Math.min((s.count / (stats?.total || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 w-4">
                    {s.count}
                  </span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* ── filters ── */}
      <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <CardBody className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            <Filter className="size-3.5" />
            Filters
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-red-400 hover:text-red-500 font-normal normal-case tracking-normal"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            <Input
              placeholder="Search posts..."
              value={search}
              onValueChange={setSearch}
              size="sm"
              startContent={<Search className="size-3.5 text-zinc-400" />}
              classNames={{
                inputWrapper:
                  "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
                input: "text-xs",
              }}
              className="col-span-2 sm:col-span-1"
            />

            <Select
              placeholder="Type"
              size="sm"
              selectedKeys={typeFilter ? [typeFilter] : []}
              onSelectionChange={(keys) =>
                setTypeFilter(([...keys][0] as string) ?? "")
              }
              classNames={{
                trigger:
                  "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs",
              }}
            >
              <SelectItem key="lost">Lost</SelectItem>
              <SelectItem key="found">Found</SelectItem>
            </Select>

            <Select
              placeholder="Status"
              size="sm"
              selectedKeys={statusFilter ? [statusFilter] : []}
              onSelectionChange={(keys) =>
                setStatusFilter(([...keys][0] as string) ?? "")
              }
              classNames={{
                trigger:
                  "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs",
              }}
            >
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="resolved">Resolved</SelectItem>
            </Select>

            <Select
              placeholder="Emirate"
              size="sm"
              selectedKeys={emirateFilter ? [emirateFilter] : []}
              onSelectionChange={(keys) =>
                setEmirateFilter(([...keys][0] as string) ?? "")
              }
              classNames={{
                trigger:
                  "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs",
              }}
            >
              {EMIRATES.map((e) => (
                <SelectItem key={e}>{e}</SelectItem>
              ))}
            </Select>

            <Select
              placeholder="Species"
              size="sm"
              selectedKeys={speciesFilter ? [speciesFilter] : []}
              onSelectionChange={(keys) =>
                setSpeciesFilter(([...keys][0] as string) ?? "")
              }
              classNames={{
                trigger:
                  "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs",
              }}
            >
              {SPECIES.map((s) => (
                <SelectItem key={s.toLowerCase()}>{s}</SelectItem>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* ── table ── */}
      <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <CardHeader className="px-5 pt-4 pb-0 flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            All Posts
            <span className="ml-2 text-xs font-normal text-zinc-400">
              {isLoading ? "loading..." : `${posts.length} results`}
            </span>
          </p>
        </CardHeader>

        <CardBody className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-lg" />
                ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="py-16 text-center">
              <PawPrint className="size-10 mx-auto text-zinc-200 dark:text-zinc-700 mb-3" />
              <p className="text-sm text-zinc-400">No posts found</p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-xs text-steel-blue dark:text-lime-burst"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  {[
                    "Pet",
                    "Posted By",
                    "Location",
                    "Date",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-semibold text-zinc-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post: any) => (
                  <tr
                    key={post._id}
                    className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* pet */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 flex items-center justify-center">
                          {post.photos?.[0] ? (
                            <img
                              src={post.photos[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">
                              {SPECIES_EMOJI[post.species?.toLowerCase()] ??
                                "🐾"}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                            {post.petName || `${post.species} (unnamed)`}
                          </p>
                          <p className="text-[10px] text-zinc-400 capitalize">
                            {post.species} · {post.breed || "unknown breed"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* posted by */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar
                          size="sm"
                          name={post.postedBy?.name?.charAt(0) || "U"}
                          src={post.postedBy?.profilePhoto}
                          classNames={{
                            base: "bg-steel-blue/20 size-7",
                            name: "text-steel-blue text-xs font-bold",
                          }}
                        />
                        <div>
                          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            {post.posterName || post.postedBy?.name}
                          </p>
                          <p className="text-[10px] text-zinc-400">
                            {post.postedBy?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* location */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <MapPin className="size-3 shrink-0" />
                        <span>
                          {post.area ? `${post.area}, ` : ""}
                          {post.emirate}
                        </span>
                      </div>
                    </td>

                    {/* date */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <Calendar className="size-3 shrink-0" />
                        <span>
                          {format(new Date(post.createdAt), "dd MMM yy")}
                        </span>
                      </div>
                    </td>

                    {/* status */}
                    <td className="px-4 py-3">
                      <StatusChip status={post.status} type={post.type} />
                    </td>

                    {/* actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Tooltip content="View post">
                          <Button
                            as={Link}
                            href={`/user/quickAccess/lost-found/${post._id}`}
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="text-zinc-400 hover:text-steel-blue dark:hover:text-lime-burst"
                          >
                            <Eye className="size-3.5" />
                          </Button>
                        </Tooltip>

                        {post.status !== "resolved" && (
                          <Tooltip content="Force resolve">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() => confirmAction(post, "resolve")}
                              className="text-zinc-400 hover:text-emerald-500"
                            >
                              <CheckCircle className="size-3.5" />
                            </Button>
                          </Tooltip>
                        )}

                        <Tooltip content="Delete post" color="danger">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => confirmAction(post, "delete")}
                            className="text-zinc-400 hover:text-red-500"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* ── confirm modal ── */}
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalContent className="bg-white dark:bg-zinc-900">
          <ModalHeader className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {actionType === "delete" ? "Delete Post?" : "Force Resolve?"}
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {actionType === "delete"
                ? `This will permanently remove "${selectedPost?.petName || "this post"}". This cannot be undone.`
                : `Mark "${selectedPost?.petName || "this post"}" as resolved? The owner will see it as reunited.`}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              variant="light"
              onPress={onClose}
              className="text-zinc-500"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              isLoading={deleting || resolving}
              onPress={handleConfirm}
              className={
                actionType === "delete"
                  ? "bg-red-500 text-white"
                  : "bg-emerald-500 text-white"
              }
            >
              {actionType === "delete" ? "Delete" : "Resolve"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
