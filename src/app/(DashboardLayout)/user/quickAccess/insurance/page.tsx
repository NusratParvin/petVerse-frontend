// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import {
//   Card,
//   CardBody,
//   Button,
//   Select,
//   SelectItem,
//   Tabs,
//   Tab,
//   Chip,
//   Progress,
//   Divider,
// } from "@heroui/react";

// // ─── Real UAE Pet Insurance Providers (seeded data) ───────────────────────────
// const PROVIDERS = [
//   {
//     id: 1,
//     name: "GIG Gulf (AXA)",
//     logo: "🛡️",
//     badge: "Most Popular",
//     badgeColor: "lime",
//     priceFrom: 90,
//     priceTo: 250,
//     annualLimit: "AED 30,000",
//     coverage: 80,
//     plans: ["Essential", "Plus", "Premier"],
//     highlights: [
//       "Lifetime cover for dogs & cats",
//       "Accidents, illness & surgery",
//       "Travel coverage add-on",
//       "24/7 customer support",
//     ],
//     pets: ["dog", "cat"],
//     website: "https://www.giggulf.ae",
//     claimsIn: "3–5 working days",
//     reimbursement: "80%",
//   },
//   {
//     id: 2,
//     name: "Sukoon Insurance",
//     logo: "🌿",
//     badge: "Trusted 50 Years",
//     badgeColor: "blue",
//     priceFrom: 110,
//     priceTo: 300,
//     annualLimit: "AED 25,000",
//     coverage: 85,
//     plans: ["Silver", "Gold", "Platinum"],
//     highlights: [
//       "Cashless settlements at partner clinics",
//       "2,000+ UAE vet network",
//       "Accident & illness cover",
//       "A-rated by S&P & AM Best",
//     ],
//     pets: ["dog", "cat"],
//     website: "https://www.sukoon.com",
//     claimsIn: "3–5 working days",
//     reimbursement: "85%",
//   },
//   {
//     id: 3,
//     name: "Gargash Insurance",
//     logo: "🐾",
//     badge: "Best for Puppies",
//     badgeColor: "coral",
//     priceFrom: 75,
//     priceTo: 200,
//     annualLimit: "AED 30,000",
//     coverage: 75,
//     plans: ["Basic", "Comprehensive"],
//     highlights: [
//       "Covers pets from 12 weeks old",
//       "Surgery & hospitalisation",
//       "3rd party liability included",
//       "Dogs & cats up to 8 years",
//     ],
//     pets: ["dog", "cat"],
//     website: "https://www.gargashinsurance.com",
//     claimsIn: "5–7 working days",
//     reimbursement: "75%",
//   },
//   {
//     id: 4,
//     name: "MetLife UAE",
//     logo: "💼",
//     badge: "Most Flexible",
//     badgeColor: "teal",
//     priceFrom: 120,
//     priceTo: 400,
//     annualLimit: "AED 30,000",
//     coverage: 90,
//     plans: ["Core", "Enhanced", "Premium"],
//     highlights: [
//       "Customizable coverage limits",
//       "Flexible deductible options",
//       "Accident & illness",
//       "Annual limit up to AED 30,000",
//     ],
//     pets: ["dog", "cat"],
//     website: "https://www.metlife.ae",
//     claimsIn: "3–5 working days",
//     reimbursement: "90%",
//   },
//   {
//     id: 5,
//     name: "PetAssure (Bupa)",
//     logo: "🏥",
//     badge: "Best Preventive",
//     badgeColor: "yellow",
//     priceFrom: 95,
//     priceTo: 220,
//     annualLimit: "AED 20,000",
//     coverage: 80,
//     plans: ["Wellness", "Wellness Plus"],
//     highlights: [
//       "Wellness checks & vaccines covered",
//       "Routine parasite control",
//       "Cashless at partnered clinics",
//       "Preventive-first approach",
//     ],
//     pets: ["dog", "cat"],
//     website: "#",
//     claimsIn: "3–5 working days",
//     reimbursement: "80%",
//   },
//   {
//     id: 6,
//     name: "InsuranceMarket.ae",
//     logo: "📊",
//     badge: "Compare & Save",
//     badgeColor: "blue",
//     priceFrom: 85,
//     priceTo: 180,
//     annualLimit: "AED 15,000",
//     coverage: 70,
//     plans: ["Accident Only", "Accident & Illness"],
//     highlights: [
//       "30+ years UAE experience",
//       "Accident & illness coverage",
//       "Injury & damage to others",
//       "Multiple insurer network",
//     ],
//     pets: ["dog", "cat", "other"],
//     website: "https://insurancemarket.ae/pet-insurance",
//     claimsIn: "5–7 working days",
//     reimbursement: "70%",
//   },
// ];

// // ─── Badge colour helper ───────────────────────────────────────────────────────
// function getBadgeColor(color: string) {
//   const map: Record<string, string> = {
//     lime: "success",
//     blue: "primary",
//     coral: "danger",
//     teal: "secondary",
//     yellow: "warning",
//   };
//   return map[color] ?? "default";
// }

// export default function InsurancePage() {
//   const [filter, setFilter] = useState<string>("All");
//   const [sortBy, setSortBy] = useState<string>("popular");
//   const [expandedId, setExpandedId] = useState<number | null>(null);

//   // Filter by pet type
//   const filtered = PROVIDERS.filter((p) => {
//     if (filter === "All") return true;
//     return p.pets.includes(filter.toLowerCase());
//   });

//   // Sort
//   const sorted = [...filtered].sort((a, b) => {
//     if (sortBy === "price") return a.priceFrom - b.priceFrom;
//     if (sortBy === "coverage") return b.coverage - a.coverage;
//     return a.id - b.id;
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-transparent p-3 sm:p-4 transition-colors">
//       <div className="max-w-full mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//           <div>
//             <h1 className=" text-base font-bold text-gray-900 dark:text-white/90">
//               🛡️ Pet Insurance Plans
//             </h1>
//             <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 ms-6">
//               Compare UAE providers · Only 10% of UAE pets are insured
//             </p>
//           </div>
//           <Button
//             as={Link}
//             href="/user/quickAccess/insurance/calculator"
//             size="sm"
//             // color="primary"
//             variant="solid"
//             className="bg-steel-blue dark:bg-lime-burst/60 text-white dark:text-black/90 font-semibold text-sm"
//             startContent={<span>✨</span>}
//           >
//             Find Best Plan for My Pet
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-3 gap-3 mb-6">
//           {[
//             { label: "Avg. monthly premium", value: "AED 90–400" },
//             { label: "Annual cover up to", value: "AED 30,000" },
//             { label: "Reimbursement rate", value: "70–90%" },
//           ].map((stat) => (
//             <Card
//               key={stat.label}
//               className="bg-lime-burst/10 border border-lime-burst/80  dark:border-0 dark:bg-white/10 shadow-sm dark:shadow-primary rounded-md"
//             >
//               <CardBody className="text-center p-3">
//                 <p className="text-steel-blue dark:text-lime-burst font-bold text-sm ">
//                   {stat.value}
//                 </p>
//                 <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
//                   {stat.label}
//                 </p>
//               </CardBody>
//             </Card>
//           ))}
//         </div>

//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
//           <Tabs
//             selectedKey={filter}
//             onSelectionChange={(key) => setFilter(key as string)}
//             color="default"
//             radius="sm"
//             size="sm"
//           >
//             <Tab key="All" title="All" className="px-12" />
//             <Tab key="Dog" title="🐶 Dog" className="px-12" />
//             <Tab key="Cat" title="🐱 Cat" className="px-12" />
//           </Tabs>

//           <Select
//             selectedKeys={[sortBy]}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="w-40"
//             size="sm"
//             variant="flat"
//             classNames={{
//               trigger: "h-8 min-h-8",
//               value: "text-xs",
//               selectorIcon: "text-default-400 w-3 h-3",
//               popoverContent: "text-xs",
//             }}
//           >
//             <SelectItem key="popular" classNames={{ title: "text-xs" }}>
//               Most Popular
//             </SelectItem>
//             <SelectItem key="price" classNames={{ title: "text-xs" }}>
//               Lowest Price
//             </SelectItem>
//             <SelectItem key="coverage" classNames={{ title: "text-xs" }}>
//               Best Coverage
//             </SelectItem>
//           </Select>
//         </div>

//         {/* Provider Cards */}
//         <div className="space-y-3">
//           {sorted.map((provider) => {
//             const isExpanded = expandedId === provider.id;
//             return (
//               <Card
//                 key={provider.id}
//                 className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-steel-blue/70 hover:dark:border-steel-blue  transition-all dark:shadow-sm dark:shadow-primary-500/80 rounded-md"
//                 shadow="sm"
//               >
//                 <CardBody className="p-5">
//                   {/* Card header */}
//                   <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//                     <div className="flex items-center gap-3 flex-1">
//                       <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-2xl">
//                         {provider.logo}
//                       </div>
//                       <div>
//                         <div className="flex flex-wrap items-center gap-2 mb-0.5">
//                           <h3 className="font-bold text-base text-gray-900 dark:text-white">
//                             {provider.name}
//                           </h3>
//                           <Chip
//                             size="sm"
//                             color={getBadgeColor(provider.badgeColor)}
//                             variant="solid"
//                             className="px-4 h-5 text-[10px] "
//                           >
//                             {provider.badge}
//                           </Chip>
//                         </div>
//                         <p className="text-gray-500 dark:text-gray-400 text-xs">
//                           Plans: {provider.plans.join(" · ")}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="text-left sm:text-right">
//                       <p className="text-steel-blue dark:text-lime-burst font-bold text-base">
//                         AED {provider.priceFrom}–{provider.priceTo}
//                         <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">
//                           {" "}
//                           /mo
//                         </span>
//                       </p>
//                       <p className="text-gray-500 dark:text-gray-400 text-xs">
//                         Up to {provider.annualLimit}/yr
//                       </p>
//                     </div>
//                   </div>

//                   {/* Coverage bar */}
//                   <div className="mt-4">
//                     <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
//                       <span>Coverage Score</span>
//                       <span className="text-green">{provider.coverage}%</span>
//                     </div>

//                     <Progress
//                       value={provider.coverage}
//                       classNames={{
//                         base: "h-1.5",
//                         track: "drop-shadow-md border border-default",
//                         indicator: "bg-steel-blue dark:bg-lime-burst/60",
//                         value: "text-foreground/60",
//                       }}
//                     />
//                   </div>

//                   {/* Highlights */}
//                   <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
//                     {provider.highlights.map((highlight, i) => (
//                       <p
//                         key={i}
//                         className="text-gray-600 dark:text-gray-300 text-xs flex items-start gap-1.5"
//                       >
//                         <span className="text-steel-blue dark:text-lime-burst">
//                           ✓
//                         </span>
//                         {highlight}
//                       </p>
//                     ))}
//                   </div>

//                   {/* Expanded details */}
//                   {isExpanded && (
//                     <>
//                       <Divider className="my-2" />
//                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                         {[
//                           {
//                             label: "Claims processed in",
//                             value: provider.claimsIn,
//                           },
//                           {
//                             label: "Reimbursement",
//                             value: provider.reimbursement,
//                           },
//                           {
//                             label: "Covers",
//                             value: provider.pets
//                               .map((p) => p[0].toUpperCase() + p.slice(1))
//                               .join(", "),
//                           },
//                         ].map((detail) => (
//                           <Card
//                             key={detail.label}
//                             className="bg-bg/5 dark:bg-white/10 shadow-md rounded-md"
//                           >
//                             <CardBody className="p-3">
//                               <p className="text-gray-500 dark:text-gray-400 text-xs">
//                                 {detail.label}
//                               </p>
//                               <p className="text-gray-900 dark:text-white font-semibold text-xs mt-0.5">
//                                 {detail.value}
//                               </p>
//                             </CardBody>
//                           </Card>
//                         ))}
//                       </div>
//                     </>
//                   )}

//                   {/* Actions */}
//                   <div className="mt-4 flex flex-wrap gap-2 items-center">
//                     <Button
//                       size="sm"
//                       variant="light"
//                       className="text-steel-blue dark:text-lime-burst"
//                       onPress={() =>
//                         setExpandedId(isExpanded ? null : provider.id)
//                       }
//                     >
//                       {isExpanded ? "Show less ▲" : "Show details ▼"}
//                     </Button>
//                     <div className="ml-auto flex gap-2">
//                       <Button
//                         as={Link}
//                         href="/user/quickAccess/insurance/calculator"
//                         size="sm"
//                         // variant="bordered"
//                         className="border-1 border-steel-blue/40 dark:shadow-primary dark:shadow-sm bg-primary/10 w-40"
//                       >
//                         Check fit for my pet
//                       </Button>
//                       <Button
//                         as="a"
//                         href={provider.website}
//                         target="_blank"
//                         size="sm"
//                         // color="primary"
//                         className="bg-steel-blue dark:bg-primary/80 w-40 text-white "
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

//         {/* Footer */}
//         <p className="text-center text-gray-500 text-xs my-20">
//           Prices are indicative monthly ranges for 2025. Actual premiums vary by
//           pet age, breed, and health history. Always request a personalized
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
} from "@heroui/react";

import { useGetInsuranceRatingsQuery } from "@/src/redux/features/insurance/insuranceApi";
import {
  badgeClasses,
  COVERAGE_LABELS,
  type CoverageFlag,
  PROVIDERS,
} from "@/src/types";

// ── Filter options ────────────────────────────────────────────────────────────
const PET_FILTERS = ["All", "Dog", "Cat"];
const COVERAGE_FILTERS: { key: CoverageFlag; label: string }[] = [
  { key: "accidents", label: "Accidents" },
  { key: "illness", label: "Illness" },
  { key: "dental", label: "Dental" },
  { key: "hereditary", label: "Hereditary" },
  { key: "wellness", label: "Wellness" },
  { key: "thirdParty", label: "3rd Party" },
  { key: "cancer", label: "Cancer" },
  { key: "travel", label: "Travel" },
];

// ── Star display ──────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${i <= Math.round(rating) ? "text-[#F5D020]" : "text-gray-300 dark:text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function InsurancePage() {
  const [petFilter, setPetFilter] = useState("All");
  const [coverageFilter, setCoverageFilter] = useState<CoverageFlag | null>(
    null,
  );
  const [sortBy, setSortBy] = useState("popular");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch community ratings from your backend
  const { data: ratingsData } = useGetInsuranceRatingsQuery({});
  const ratings: Record<string, { avgRating: number; count: number }> =
    ratingsData?.data ?? {};

  console.log(provider.id);
  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = PROVIDERS.filter((p) => {
    const petOk =
      petFilter === "All" || p.pets.includes(petFilter.toLowerCase());
    const coverageOk =
      !coverageFilter || p.coverageFlags.includes(coverageFilter);
    return petOk && coverageOk;
  });

  // ── Sort ────────────────────────────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price") return a.priceFrom - b.priceFrom;
    if (sortBy === "coverage") return b.coverageScore - a.coverageScore;
    if (sortBy === "rating") {
      const ra = ratings[a.id]?.avgRating ?? 0;
      const rb = ratings[b.id]?.avgRating ?? 0;
      return rb - ra;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#020812] text-gray-900 dark:text-white font-[Outfit,sans-serif] px-3 sm:px-6 py-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
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
          {/* Pet type + Sort */}
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
            const isExpanded = expandedId === provider.id;
            const rating = ratings[provider.id];

            return (
              <Card
                key={provider.id}
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
                          <Chip
                            size="sm"
                            className={`text-[10px] font-bold px-2 py-0.5 h-auto ${badgeClasses(provider.badgeColor)}`}
                          >
                            {provider.badge}
                          </Chip>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          Plans: {provider.plans.join(" · ")}
                        </p>
                        {rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Stars rating={rating.avgRating} />
                            <span className="text-[10px] text-gray-400">
                              {rating.avgRating.toFixed(1)} ({rating.count})
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
                        Up to {provider.annualLimit}/yr
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
                    {provider.highlights.map((h, i) => (
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
                              {provider.coveredConditions.map((c) => (
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
                              {provider.excludedConditions.map((c) => (
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
                          {[
                            {
                              label: "Reimbursement",
                              value: provider.reimbursement,
                            },
                            { label: "Claims in", value: provider.claimsIn },
                            {
                              label: "Max pet age",
                              value: `${provider.maxAgeYears} yrs`,
                            },
                          ].map((d) => (
                            <div
                              key={d.label}
                              className="bg-gray-50 dark:bg-white/5 rounded-xl p-2.5 text-center"
                            >
                              <p className="text-gray-400 text-[10px]">
                                {d.label}
                              </p>
                              <p className="text-gray-900 dark:text-white font-semibold text-xs mt-0.5">
                                {d.value}
                              </p>
                            </div>
                          ))}
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
                        setExpandedId(isExpanded ? null : provider.id)
                      }
                    >
                      {isExpanded ? "Show less ▲" : "Show details ▼"}
                    </Button>
                    <div className="ml-auto flex gap-2">
                      <Button
                        as={Link}
                        href={`/user/quickAccess/insurance/${provider.id}`}
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
