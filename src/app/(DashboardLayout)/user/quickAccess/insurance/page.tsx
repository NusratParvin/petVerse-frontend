// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import {
//   Card,
//   CardBody,
//   Button,
//   Select,
//   SelectItem,
//   Chip,
//   Progress,
//   Tabs,
//   Tab,
//   Divider,
// } from "@heroui/react";

// import {
//   badgeClasses,
//   COVERAGE_LABELS,
//   type CoverageFlag,
//   PROVIDERS,
// } from "@/src/types";
// import { useGetInsuranceRatingsQuery } from "@/src/redux/features/insurance/insuranceApi";
// import { Rating } from "next-flex-rating";

// // ── Filter options ────────────────────────────────────────────────────────────
// const PET_FILTERS = ["All", "Dog", "Cat"];
// const COVERAGE_FILTERS: { key: CoverageFlag; label: string }[] = [
//   { key: "accidents", label: "Accidents" },
//   { key: "illness", label: "Illness" },
//   { key: "dental", label: "Dental" },
//   { key: "hereditary", label: "Hereditary" },
//   { key: "wellness", label: "Wellness" },
//   { key: "thirdParty", label: "3rd Party" },
//   { key: "cancer", label: "Cancer" },
//   { key: "travel", label: "Travel" },
// ];

// // ── Main Component ────────────────────────────────────────────────────────────
// export default function InsurancePage() {
//   const [petFilter, setPetFilter] = useState("All");
//   const [coverageFilter, setCoverageFilter] = useState<CoverageFlag | null>(
//     null,
//   );
//   const [sortBy, setSortBy] = useState("popular");
//   const [expandedId, setExpandedId] = useState<string | null>(null);

//   // Fetch community ratings from your backend
//   const { data: ratingsData } = useGetInsuranceRatingsQuery();

//   const ratings: Record<string, { avgRating: number; count: number }> =
//     ratingsData?.data ?? {};

//   // ── Filter ──────────────────────────────────────────────────────────────────
//   const filtered = PROVIDERS.filter((p) => {
//     const petOk =
//       petFilter === "All" || p.pets.includes(petFilter.toLowerCase());
//     const coverageOk =
//       !coverageFilter || p.coverageFlags.includes(coverageFilter);
//     return petOk && coverageOk;
//   });

//   // ── Sort ────────────────────────────────────────────────────────────────────
//   const sorted = [...filtered].sort((a, b) => {
//     if (sortBy === "price") return a.priceFrom - b.priceFrom;
//     if (sortBy === "coverage") return b.coverageScore - a.coverageScore;
//     if (sortBy === "rating") {
//       const ra = ratings[a.id]?.avgRating ?? 0;
//       const rb = ratings[b.id]?.avgRating ?? 0;
//       return rb - ra;
//     }
//     return 0;
//   });

//   return (
//     <div className="min-h-screen bg-white dark:bg-transparent text-gray-900 dark:text-white p-3 sm:p-4 transition-colors">
//       <div className="max-w-full mx-auto">
//         {/* ── Header ── */}
//         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-base  font-bold text-gray-900 dark:text-white flex items-center gap-2">
//               🛡️ Pet Insurance Plans
//             </h1>
//             <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
//               Compare UAE providers · Only 10% of UAE pets are insured
//             </p>
//           </div>
//           <Button
//             as={Link}
//             href="/user/quickAccess/insurance/calculator"
//             size="sm"
//             className="bg-steel-blue dark:bg-lime-burst/60 text-white dark:text-black/90 font-semibold text-sm"
//             startContent={<span>✨</span>}
//           >
//             Find Best Plan for My Pet
//           </Button>
//         </div>

//         {/* ── Stats Bar ── */}
//         <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
//           {[
//             { label: "Avg. monthly premium", value: "AED 90–400" },
//             { label: "Annual cover up to", value: "AED 30,000" },
//             { label: "Reimbursement rate", value: "70–90%" },
//           ].map((s) => (
//             <Card
//               key={s.label}
//               className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-none"
//             >
//               <CardBody className="text-center p-2.5 sm:p-4">
//                 <p className="text-steel-blue dark:text-lime-burst font-bold text-xs sm:text-base">
//                   {s.value}
//                 </p>
//                 <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs mt-0.5 leading-tight">
//                   {s.label}
//                 </p>
//               </CardBody>
//             </Card>
//           ))}
//         </div>

//         {/* ── Filters Row ── */}
//         <div className="flex flex-col gap-3 mb-5">
//           {/* Pet type + Sort */}
//           <div className="flex flex-wrap items-center justify-between gap-2">
//             <Tabs
//               selectedKey={petFilter}
//               onSelectionChange={(key) => setPetFilter(key as string)}
//               color="primary"
//               radius="full"
//               size="sm"
//               classNames={{
//                 tabList: "bg-gray-100 dark:bg-white/5 p-0.5 rounded-full gap-0",
//                 tab: "px-4 py-1.5 h-auto text-xs",
//                 cursor: "rounded-full",
//               }}
//             >
//               <Tab key="All" title="All" />
//               <Tab key="Dog" title="🐶 Dog" />
//               <Tab key="Cat" title="🐱 Cat" />
//             </Tabs>

//             <Select
//               selectedKeys={[sortBy]}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="w-36"
//               size="sm"
//               variant="flat"
//               classNames={{
//                 trigger: "h-8 min-h-8 bg-gray-100 dark:bg-white/5",
//                 value: "text-xs",
//                 selectorIcon: "text-default-400 w-3 h-3",
//               }}
//             >
//               <SelectItem key="popular" className="text-xs">
//                 Most Popular
//               </SelectItem>
//               <SelectItem key="price" className="text-xs">
//                 Lowest Price
//               </SelectItem>
//               <SelectItem key="coverage" className="text-xs">
//                 Best Coverage
//               </SelectItem>
//               <SelectItem key="rating" className="text-xs">
//                 Highest Rated
//               </SelectItem>
//             </Select>
//           </div>

//           {/* Coverage type filter chips */}
//           <div className="flex flex-wrap gap-1.5">
//             <Chip
//               size="sm"
//               variant="flat"
//               className={`cursor-pointer text-[11px] px-3 py-1 h-auto ${
//                 !coverageFilter
//                   ? "bg-steel-blue/20 text-steel-blue border border-steel-blue/40"
//                   : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
//               }`}
//               onClick={() => setCoverageFilter(null)}
//             >
//               All coverage
//             </Chip>
//             {COVERAGE_FILTERS.map((cf) => (
//               <Chip
//                 key={cf.key}
//                 size="sm"
//                 variant="flat"
//                 className={`cursor-pointer text-[11px] px-3 py-1 h-auto ${
//                   coverageFilter === cf.key
//                     ? "bg-steel-blue/20 text-steel-blue border border-steel-blue/40"
//                     : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
//                 }`}
//                 onClick={() =>
//                   setCoverageFilter(coverageFilter === cf.key ? null : cf.key)
//                 }
//               >
//                 {cf.label}
//               </Chip>
//             ))}
//           </div>
//         </div>

//         {/* ── Provider Cards ── */}
//         <div className="space-y-3">
//           {sorted.length === 0 && (
//             <div className="text-center py-12 text-gray-400 text-sm">
//               No providers match your filters. Try adjusting them.
//             </div>
//           )}

//           {sorted.map((provider) => {
//             const isExpanded = expandedId === provider.id;
//             const rating = ratings[provider.id];
//             // console.log(provider.id);

//             return (
//               <Card
//                 key={provider.id}
//                 className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:border-steel-blue/60 dark:hover:border-steel-blue/60 transition-all shadow-sm"
//               >
//                 <CardBody className="p-4 sm:p-5">
//                   {/* Top row */}
//                   <div className="flex flex-col sm:flex-row sm:items-start gap-3">
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                       <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
//                         {provider.logo}
//                       </div>
//                       <div className="min-w-0">
//                         <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
//                           <h3 className="font-bold text-sm text-gray-900 dark:text-white">
//                             {provider.name}
//                           </h3>
//                           <Chip
//                             size="sm"
//                             className={`text-[10px] font-bold px-2 py-0.5 h-auto ${badgeClasses(provider.badgeColor)}`}
//                           >
//                             {provider.badge}
//                           </Chip>
//                         </div>
//                         <p className="text-gray-500 dark:text-gray-400 text-xs">
//                           Plans: {provider.plans.join(" · ")}
//                         </p>
//                         {rating && (
//                           <div className="flex items-center gap-1 mt-1">
//                             <Rating value={rating.avgRating} readOnly={true} />

//                             <span className="text-[10px] text-gray-400">
//                               {rating.avgRating.toFixed(1)} ({rating.count})
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex-shrink-0 text-left sm:text-right">
//                       <p className="text-steel-blue dark:text-lime-burst font-bold text-base">
//                         AED {provider.priceFrom}–{provider.priceTo}
//                         <span className="text-gray-400 text-xs font-normal">
//                           {" "}
//                           /mo
//                         </span>
//                       </p>
//                       <p className="text-gray-400 text-xs">
//                         Up to {provider.annualLimit}/yr
//                       </p>
//                     </div>
//                   </div>

//                   {/* Coverage bar */}
//                   <div className="mt-4">
//                     <div className="flex justify-between text-xs mb-1">
//                       <span className="text-gray-500 dark:text-gray-400">
//                         Coverage Score
//                       </span>
//                       <span className="text-steel-blue dark:text-lime-burst font-semibold">
//                         {provider.coverageScore}%
//                       </span>
//                     </div>
//                     <Progress
//                       value={provider.coverageScore}
//                       classNames={{
//                         base: "h-1.5",
//                         track: "bg-gray-200 dark:bg-white/10 rounded-full",
//                         indicator:
//                           "bg-gradient-to-r from-steel-blue to-[#00E5CC] rounded-full",
//                       }}
//                     />
//                   </div>

//                   {/* Highlights */}
//                   <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
//                     {provider.highlights.map((h, i) => (
//                       <p
//                         key={i}
//                         className="text-gray-600 dark:text-gray-300 text-xs flex items-start gap-1.5"
//                       >
//                         <span className="text-steel-blue dark:text-lime-burst mt-0.5 flex-shrink-0">
//                           ✓
//                         </span>
//                         {h}
//                       </p>
//                     ))}
//                   </div>

//                   {/* Expanded details */}
//                   {isExpanded && (
//                     <>
//                       <Divider className="my-4" />
//                       <div className="space-y-3">
//                         <div className="flex flex-wrap gap-1.5">
//                           {provider.coverageFlags.map((flag) => (
//                             <Chip
//                               key={flag}
//                               size="sm"
//                               className="text-[10px] px-2 py-0.5 h-auto bg-steel-blue/10 dark:bg-steel-blue/20 text-steel-blue border border-steel-blue/30"
//                             >
//                               {COVERAGE_LABELS[flag]}
//                             </Chip>
//                           ))}
//                         </div>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                           <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3">
//                             <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
//                               Covered Conditions
//                             </p>
//                             <ul className="space-y-1">
//                               {provider.coveredConditions.map((c) => (
//                                 <li
//                                   key={c}
//                                   className="text-xs text-gray-700 dark:text-gray-200 flex gap-1.5"
//                                 >
//                                   <span className="text-green-500 flex-shrink-0">
//                                     ✓
//                                   </span>
//                                   {c}
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                           <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3">
//                             <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
//                               Excluded
//                             </p>
//                             <ul className="space-y-1">
//                               {provider.excludedConditions.map((c) => (
//                                 <li
//                                   key={c}
//                                   className="text-xs text-gray-600 dark:text-gray-400 flex gap-1.5"
//                                 >
//                                   <span className="text-red-400 flex-shrink-0">
//                                     ✕
//                                   </span>
//                                   {c}
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         </div>
//                         <div className="grid grid-cols-3 gap-2">
//                           {[
//                             {
//                               label: "Reimbursement",
//                               value: provider.reimbursement,
//                             },
//                             { label: "Claims in", value: provider.claimsIn },
//                             {
//                               label: "Max pet age",
//                               value: `${provider.maxAgeYears} yrs`,
//                             },
//                           ].map((d) => (
//                             <div
//                               key={d.label}
//                               className="bg-gray-50 dark:bg-white/5 rounded-xl p-2.5 text-center"
//                             >
//                               <p className="text-gray-400 text-[10px]">
//                                 {d.label}
//                               </p>
//                               <p className="text-gray-900 dark:text-white font-semibold text-xs mt-0.5">
//                                 {d.value}
//                               </p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {/* Actions */}
//                   <div className="mt-4 flex flex-wrap items-center gap-2">
//                     <Button
//                       size="sm"
//                       variant="light"
//                       className="text-steel-blue dark:text-lime-burst text-xs h-auto min-w-0 px-2"
//                       onPress={() =>
//                         setExpandedId(isExpanded ? null : provider.id)
//                       }
//                     >
//                       {isExpanded ? "Show less ▲" : "Show details ▼"}
//                     </Button>
//                     <div className="ml-auto flex gap-2">
//                       <Button
//                         as={Link}
//                         href={`/user/quickAccess/insurance/${provider.id}`}
//                         size="sm"
//                         variant="bordered"
//                         className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 text-xs h-8"
//                       >
//                         Full Details
//                       </Button>
//                       <Button
//                         as="a"
//                         href={provider.website}
//                         target="_blank"
//                         size="sm"
//                         className="bg-steel-blue text-white text-xs h-8"
//                       >
//                         Get Quote →
//                       </Button>
//                     </div>
//                   </div>
//                 </CardBody>
//               </Card>
//             );
//           })}
//         </div>

//         {/* Disclaimer */}
//         <p className="text-center text-gray-400 text-[11px] mt-8 max-w-2xl mx-auto leading-relaxed">
//           Prices are indicative monthly ranges for 2025. Actual premiums vary by
//           pet age, breed, and health history. Always request a personalised
//           quote from the provider.
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardBody,
  Button,
  Select,
  SelectItem,
  Chip,
  Progress,
  Tabs,
  Tab,
  Divider,
  Spinner,
} from "@heroui/react";
import { Rating } from "next-flex-rating";

import { useGetAllInsuranceProvidersQuery } from "@/src/redux/features/insurance/insuranceApi";
import {
  type TCoverageFlag,
  COVERAGE_LABELS,
  getBadgeColorClass,
  getBadgeDisplay,
} from "@/src/types";

// ── Filter options ────────────────────────────────────────────────────────────
const PET_FILTERS = ["All", "Dog", "Cat"];
const COVERAGE_FILTERS: { key: TCoverageFlag; label: string }[] = [
  { key: "accidents", label: "Accidents" },
  { key: "illness", label: "Illness" },
  { key: "dental", label: "Dental" },
  { key: "hereditary", label: "Hereditary" },
  { key: "wellness", label: "Wellness" },
  { key: "thirdParty", label: "3rd Party" },
  { key: "cancer", label: "Cancer" },
  { key: "travel", label: "Travel" },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function InsurancePage() {
  const [petFilter, setPetFilter] = useState("All");
  const [coverageFilter, setCoverageFilter] = useState<TCoverageFlag | null>(
    null,
  );
  const [sortBy, setSortBy] = useState("popular");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    data: providers = [],
    isLoading,
    isError,
  } = useGetAllInsuranceProvidersQuery();

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = providers.filter((p) => {
    const petOk =
      petFilter === "All" || p.pets.includes(petFilter.toLowerCase() as any);
    const coverageOk =
      !coverageFilter || p.coverageFlags.includes(coverageFilter);
    return petOk && coverageOk;
  });

  // ── Sort ────────────────────────────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price") return a.priceFrom - b.priceFrom;
    if (sortBy === "coverage") return b.coverageScore - a.coverageScore;
    if (sortBy === "rating") return b.avgRating - a.avgRating;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" label="Loading insurance providers..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Failed to load providers. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-transparent text-gray-900 dark:text-white p-3 sm:p-4 transition-colors">
      <div className="max-w-full mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              🛡️ Pet Insurance Plans
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
              Compare UAE providers · Only 10% of UAE pets are insured
            </p>
          </div>
          <Button
            as={Link}
            href="/user/quickAccess/insurance/calculator"
            size="sm"
            className="bg-steel-blue dark:bg-lime-burst/60 text-white dark:text-black/90 font-semibold text-sm"
            startContent={<span>✨</span>}
          >
            Find Best Plan for My Pet
          </Button>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          {[
            { label: "Avg. monthly premium", value: "AED 90–400" },
            { label: "Annual cover up to", value: "AED 30,000" },
            { label: "Reimbursement rate", value: "70–90%" },
          ].map((s) => (
            <Card
              key={s.label}
              className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-none"
            >
              <CardBody className="text-center p-2.5 sm:p-4">
                <p className="text-steel-blue dark:text-lime-burst font-bold text-xs sm:text-base">
                  {s.value}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs mt-0.5 leading-tight">
                  {s.label}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* ── Filters Row ── */}
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Tabs
              selectedKey={petFilter}
              onSelectionChange={(key) => setPetFilter(key as string)}
              color="primary"
              radius="full"
              size="sm"
              classNames={{
                tabList: "bg-gray-100 dark:bg-white/5 p-0.5 rounded-full gap-0",
                tab: "px-4 py-1.5 h-auto text-xs",
                cursor: "rounded-full",
              }}
            >
              <Tab key="All" title="All" />
              <Tab key="Dog" title="🐶 Dog" />
              <Tab key="Cat" title="🐱 Cat" />
            </Tabs>

            <Select
              selectedKeys={[sortBy]}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-36"
              size="sm"
              variant="flat"
              classNames={{
                trigger: "h-8 min-h-8 bg-gray-100 dark:bg-white/5",
                value: "text-xs",
                selectorIcon: "text-default-400 w-3 h-3",
              }}
            >
              <SelectItem key="popular" className="text-xs">
                Most Popular
              </SelectItem>
              <SelectItem key="price" className="text-xs">
                Lowest Price
              </SelectItem>
              <SelectItem key="coverage" className="text-xs">
                Best Coverage
              </SelectItem>
              <SelectItem key="rating" className="text-xs">
                Highest Rated
              </SelectItem>
            </Select>
          </div>

          {/* Coverage type filter chips */}
          <div className="flex flex-wrap gap-1.5">
            <Chip
              size="sm"
              variant="flat"
              className={`cursor-pointer text-[11px] px-3 py-1 h-auto ${
                !coverageFilter
                  ? "bg-steel-blue/20 text-steel-blue border border-steel-blue/40"
                  : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setCoverageFilter(null)}
            >
              All coverage
            </Chip>
            {COVERAGE_FILTERS.map((cf) => (
              <Chip
                key={cf.key}
                size="sm"
                variant="flat"
                className={`cursor-pointer text-[11px] px-3 py-1 h-auto ${
                  coverageFilter === cf.key
                    ? "bg-steel-blue/20 text-steel-blue border border-steel-blue/40"
                    : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                }`}
                onClick={() =>
                  setCoverageFilter(coverageFilter === cf.key ? null : cf.key)
                }
              >
                {cf.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* ── Provider Cards ── */}
        <div className="space-y-3">
          {sorted.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No providers match your filters. Try adjusting them.
            </div>
          )}

          {sorted.map((provider) => {
            const isExpanded = expandedId === provider._id;
            const badgeDisplay = getBadgeDisplay(provider.badge);
            const badgeColorClass = getBadgeColorClass(provider.badge);

            return (
              <Card
                key={provider._id}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:border-steel-blue/60 dark:hover:border-steel-blue/60 transition-all shadow-sm"
              >
                <CardBody className="p-4 sm:p-5">
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                        {provider.logo}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                            {provider.name}
                          </h3>
                          {provider.badge && (
                            <Chip
                              size="sm"
                              className={`text-[10px] font-bold px-2 py-0.5 h-auto ${badgeColorClass}`}
                            >
                              {badgeDisplay}
                            </Chip>
                          )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          Plans: {provider.plans.join(" · ")}
                        </p>
                        {provider.avgRating > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Rating
                              value={provider.avgRating}
                              readOnly={true}
                            />
                            <span className="text-[10px] text-gray-400">
                              {provider.avgRating.toFixed(1)} (
                              {provider.reviewCount})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-left sm:text-right">
                      <p className="text-steel-blue dark:text-lime-burst font-bold text-base">
                        AED {provider.priceFrom}–{provider.priceTo}
                        <span className="text-gray-400 text-xs font-normal">
                          {" "}
                          /mo
                        </span>
                      </p>
                      <p className="text-gray-400 text-xs">
                        Up to AED {provider.annualLimit.toLocaleString()}/yr
                      </p>
                    </div>
                  </div>

                  {/* Coverage bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500 dark:text-gray-400">
                        Coverage Score
                      </span>
                      <span className="text-steel-blue dark:text-lime-burst font-semibold">
                        {provider.coverageScore}%
                      </span>
                    </div>
                    <Progress
                      value={provider.coverageScore}
                      classNames={{
                        base: "h-1.5",
                        track: "bg-gray-200 dark:bg-white/10 rounded-full",
                        indicator:
                          "bg-gradient-to-r from-steel-blue to-[#00E5CC] rounded-full",
                      }}
                    />
                  </div>

                  {/* Highlights */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {provider.highlights.slice(0, 4).map((h, i) => (
                      <p
                        key={i}
                        className="text-gray-600 dark:text-gray-300 text-xs flex items-start gap-1.5"
                      >
                        <span className="text-steel-blue dark:text-lime-burst mt-0.5 flex-shrink-0">
                          ✓
                        </span>
                        {h}
                      </p>
                    ))}
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <>
                      <Divider className="my-4" />
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1.5">
                          {provider.coverageFlags.map((flag) => (
                            <Chip
                              key={flag}
                              size="sm"
                              className="text-[10px] px-2 py-0.5 h-auto bg-steel-blue/10 dark:bg-steel-blue/20 text-steel-blue border border-steel-blue/30"
                            >
                              {COVERAGE_LABELS[flag]}
                            </Chip>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3">
                            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                              Covered Conditions
                            </p>
                            <ul className="space-y-1">
                              {provider.coveredConditions
                                .slice(0, 5)
                                .map((c) => (
                                  <li
                                    key={c}
                                    className="text-xs text-gray-700 dark:text-gray-200 flex gap-1.5"
                                  >
                                    <span className="text-green-500 flex-shrink-0">
                                      ✓
                                    </span>
                                    {c}
                                  </li>
                                ))}
                            </ul>
                          </div>
                          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3">
                            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                              Excluded
                            </p>
                            <ul className="space-y-1">
                              {provider.excludedConditions
                                .slice(0, 5)
                                .map((c) => (
                                  <li
                                    key={c}
                                    className="text-xs text-gray-600 dark:text-gray-400 flex gap-1.5"
                                  >
                                    <span className="text-red-400 flex-shrink-0">
                                      ✕
                                    </span>
                                    {c}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-2.5 text-center">
                            <p className="text-gray-400 text-[10px]">
                              Reimbursement
                            </p>
                            <p className="text-gray-900 dark:text-white font-semibold text-xs mt-0.5">
                              {provider.reimbursement}%
                            </p>
                          </div>
                          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-2.5 text-center">
                            <p className="text-gray-400 text-[10px]">
                              Claims in
                            </p>
                            <p className="text-gray-900 dark:text-white font-semibold text-xs mt-0.5">
                              {provider.claimsIn}
                            </p>
                          </div>
                          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-2.5 text-center">
                            <p className="text-gray-400 text-[10px]">
                              Max pet age
                            </p>
                            <p className="text-gray-900 dark:text-white font-semibold text-xs mt-0.5">
                              {provider.maxAgeYears} yrs
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="light"
                      className="text-steel-blue dark:text-lime-burst text-xs h-auto min-w-0 px-2"
                      onPress={() =>
                        setExpandedId(isExpanded ? null : provider._id)
                      }
                    >
                      {isExpanded ? "Show less ▲" : "Show details ▼"}
                    </Button>
                    <div className="ml-auto flex gap-2">
                      <Button
                        as={Link}
                        href={`/user/quickAccess/insurance/${provider._id}`}
                        size="sm"
                        variant="bordered"
                        className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 text-xs h-8"
                      >
                        Full Details
                      </Button>
                      <Button
                        as="a"
                        href={provider.website}
                        target="_blank"
                        size="sm"
                        className="bg-steel-blue text-white text-xs h-8"
                      >
                        Get Quote →
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-gray-400 text-[11px] mt-8 max-w-2xl mx-auto leading-relaxed">
          Prices are indicative monthly ranges for 2025. Actual premiums vary by
          pet age, breed, and health history. Always request a personalised
          quote from the provider.
        </p>
      </div>
    </div>
  );
}
