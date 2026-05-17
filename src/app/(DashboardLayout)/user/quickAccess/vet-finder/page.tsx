// // "use client";

// // import { useState } from "react";
// // import { TVet, TEmirate, TSpeciality } from "@/src/types";
// // import { Button } from "@heroui/react";

// // import VetCardLoader from "./components/vetCardLoader";
// // import VetCard from "./components/vetCard";
// // import VetFilters from "./components/vetFilterSection";
// // import { useGetVetsQuery } from "@/src/redux/features/vets/vetsApi";

// // /* Page Component */
// // const VetFinderPage = () => {
// //   const [emirate, setEmirate] = useState<TEmirate | "">("");
// //   const [speciality, setSpeciality] = useState<TSpeciality | "">("");
// //   const [search, setSearch] = useState("");

// //   const hasFilters = !!(emirate || speciality || search);

// //   const { data: vetsInfo, isLoading } = useGetVetsQuery(
// //     {
// //       emirate: emirate || undefined,
// //       speciality: speciality || undefined,
// //       search: search || undefined,
// //     },
// //     { refetchOnMountOrArgChange: true },
// //   );

// //   const vets = vetsInfo?.data ?? [];

// //   const clearFilters = () => {
// //     setEmirate("");
// //     setSpeciality("");
// //     setSearch("");
// //   };

// //   return (
// //     <div className="flex flex-col gap-5 p-3 sm:p-4 md:p-6 w-full">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0">
// //         <div className="min-w-0">
// //           <h1 className="text-gray-900 dark:text-white text-lg sm:text-2xl font-bold tracking-tight flex items-center gap-2">
// //             Find a Vet <span className="text-xl sm:text-2xl">🏥</span>
// //           </h1>
// //           <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
// //             Browse verified veterinary clinics across all 7 UAE emirates
// //           </p>
// //         </div>
// //         {!isLoading && (
// //           <div className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800/50">
// //             <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
// //               {vets.length} clinic{vets.length !== 1 ? "s" : ""} found
// //             </p>
// //           </div>
// //         )}
// //       </div>

// //       {/* Filters Component */}
// //       <VetFilters
// //         emirate={emirate}
// //         speciality={speciality}
// //         search={search}
// //         onEmirateChange={setEmirate}
// //         onSpecialityChange={setSpeciality}
// //         onSearchChange={setSearch}
// //         onClear={clearFilters}
// //       />

// //       {/* Grid Results */}
// //       {isLoading ? (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
// //           {Array.from({ length: 6 }).map((_, i) => (
// //             <VetCardLoader key={i} />
// //           ))}
// //         </div>
// //       ) : vets.length > 0 ? (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
// //           {vets.map((vet: TVet) => (
// //             <VetCard key={vet._id} vet={vet} />
// //           ))}
// //         </div>
// //       ) : (
// //         <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center gap-4">
// //           <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center">
// //             <span className="text-4xl select-none">🔍</span>
// //           </div>
// //           <div className="space-y-1">
// //             <p className="text-gray-800 dark:text-gray-200 text-base font-medium">
// //               No clinics found
// //             </p>
// //             <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
// //               We couldn't find any clinics matching your filters. Try adjusting
// //               your search criteria.
// //             </p>
// //           </div>
// //           {hasFilters && (
// //             <Button
// //               variant="solid"
// //               color="primary"
// //               size="md"
// //               radius="lg"
// //               onPress={clearFilters}
// //               className="mt-2 font-medium"
// //             >
// //               Clear all filters
// //             </Button>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default VetFinderPage;

// "use client";

// import { useState, useEffect } from "react";
// import { useInView } from "react-intersection-observer";
// import { TVet, TEmirate, TSpeciality } from "@/src/types";
// import { Button, Spinner } from "@heroui/react";
// import VetCardLoader from "./components/vetCardLoader";
// import VetCard from "./components/vetCard";
// import VetFilters from "./components/vetFilterSection";
// import { useGetVetsQuery } from "@/src/redux/features/vets/vetsApi";

// const PAGE_LIMIT = 12;

// const VetFinderPage = () => {
//   const [emirate, setEmirate] = useState<TEmirate | "">("");
//   const [speciality, setSpeciality] = useState<TSpeciality | "">("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [allVets, setAllVets] = useState<TVet[]>([]);

//   const hasFilters = !!(emirate || speciality || search);

//   // ONE LINE: Create a sentinel that tells you when to load more
//   const { ref, inView } = useInView({ rootMargin: "200px" });

//   const {
//     data: response,
//     isLoading,
//     isFetching,
//   } = useGetVetsQuery(
//     {
//       emirate: emirate || undefined,
//       speciality: speciality || undefined,
//       search: search || undefined,
//       page,
//       limit: PAGE_LIMIT,
//     },
//     { refetchOnMountOrArgChange: true },
//   );

//   // Clean accumulation - NO duplicates because we use a Map
//   useEffect(() => {
//     if (!response?.data) return;

//     setAllVets((prev) => {
//       const map = new Map(prev.map((v) => [v._id, v]));
//       response.data.forEach((v) => map.set(v._id, v));
//       return Array.from(map.values());
//     });
//   }, [response]);

//   useEffect(() => {
//     if (response?.data) {
//       console.log(`=== PAGE ${response.meta?.page} ===`);
//       console.log(
//         "Vet IDs on this page:",
//         response.data.map((v) => v._id),
//       );
//       console.log("Count:", response.data.length);

//       // Check for duplicates within same page
//       const ids = response.data.map((v) => v._id);
//       const hasDuplicates = new Set(ids).size !== ids.length;
//       if (hasDuplicates) {
//         console.warn("⚠️ DUPLICATES FOUND IN SAME PAGE!");
//       }
//     }
//   }, [response]);

//   // Reset on filter change
//   useEffect(() => {
//     setPage(1);
//     setAllVets([]);
//   }, [emirate, speciality, search]);

//   // ONE LINE: Load more when sentinel is visible
//   useEffect(() => {
//     if (inView && !isFetching && page < (response?.meta?.pages ?? 0)) {
//       setPage((p) => p + 1);
//     }
//   }, [inView, isFetching, page, response?.meta?.pages]);

//   const clearFilters = () => {
//     setEmirate("");
//     setSpeciality("");
//     setSearch("");
//   };

//   const total = response?.meta?.total ?? 0;
//   const hasMore = page < (response?.meta?.pages ?? 0);

//   return (
//     <div className="flex flex-col gap-4 p-3 pt-2 w-full max-w-full mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between gap-2">
//         <div>
//           <h1 className="text-gray-900 dark:text-white/80 text-base sm:text-base font-bold flex items-center gap-2">
//             Find a Vet <span>🏥</span>
//           </h1>
//           <p className="text-gray-500 dark:text-gray-400 text-xs">
//             Verified clinics across all 7 UAE emirates
//           </p>
//         </div>
//         {!isLoading && total > 0 && (
//           <div className="px-3 py-1 rounded-md border border-steel-blue/70 dark:border-lime-burst/70 dark:text-white/80 text-steel-blue dark:bg-lime-burst/20">
//             <p className=" text-xs font-medium">
//               {allVets.length} / {total}
//             </p>
//           </div>
//         )}
//       </div>

//       <VetFilters
//         emirate={emirate}
//         speciality={speciality}
//         search={search}
//         onEmirateChange={setEmirate}
//         onSpecialityChange={setSpeciality}
//         onSearchChange={setSearch}
//         onClear={clearFilters}
//       />

//       {isLoading && page === 1 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
//           {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
//             <VetCardLoader key={i} />
//           ))}
//         </div>
//       ) : allVets.length > 0 ? (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
//             {allVets.map((vet) => (
//               <VetCard key={vet._id} vet={vet} />
//             ))}
//           </div>

//           {/* sentinel div*/}
//           {hasMore && (
//             <div ref={ref} className="flex justify-center py-4">
//               {isFetching && page > 1 && <Spinner size="sm" color="primary" />}
//             </div>
//           )}

//           {!hasMore && allVets.length > 0 && (
//             <p className="text-center text-xs text-gray-400 py-3">
//               ✨ You've seen all {total} clinics ✨
//             </p>
//           )}
//         </>
//       ) : (
//         <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
//           <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center">
//             <span className="text-3xl">🔍</span>
//           </div>
//           <div>
//             <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">
//               No clinics found
//             </p>
//             <p className="text-gray-500 dark:text-gray-400 text-xs">
//               Try adjusting your search or filters
//             </p>
//           </div>
//           {hasFilters && (
//             <Button
//               variant="solid"
//               color="primary"
//               size="sm"
//               radius="lg"
//               onPress={clearFilters}
//             >
//               Clear all filters
//             </Button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default VetFinderPage;

"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { TVet, TEmirate, TSpeciality } from "@/src/types";
import { Button, Spinner } from "@heroui/react";
import VetCardLoader from "./components/vetCardLoader";
import VetCard from "./components/vetCard";
import VetFilters from "./components/vetFilterSection";
import { useGetVetsQuery } from "@/src/redux/features/vets/vetsApi";

const PAGE_LIMIT = 12;

const VetFinderPage = () => {
  const [emirate, setEmirate] = useState<TEmirate | "">("");
  const [speciality, setSpeciality] = useState<TSpeciality | "">("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [allVets, setAllVets] = useState<TVet[]>([]);

  const { ref, inView } = useInView({ rootMargin: "200px" });

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetVetsQuery({
    emirate: emirate || undefined,
    speciality: speciality || undefined,
    search: search || undefined,
    page,
    limit: PAGE_LIMIT,
  });

  useEffect(() => {
    if (!response?.data) return;

    if (response.meta.page === 1) {
      setAllVets(response.data);
    } else {
      setAllVets((prev) => {
        const existingIds = new Set(prev.map((v) => v._id));
        const newOnes = response.data.filter(
          (v: TVet) => !existingIds.has(v._id),
        );
        return [...prev, ...newOnes];
      });
    }
  }, [response]);

  useEffect(() => {
    setPage(1);
    // setAllVets([]);
  }, [emirate, speciality, search]);

  useEffect(() => {
    const totalPages = response?.meta?.pages ?? 1;
    if (inView && !isFetching && page < totalPages) {
      setPage((p) => p + 1);
    }
  }, [inView, isFetching]);

  const clearFilters = () => {
    setEmirate("");
    setSpeciality("");
    setSearch("");
  };

  const hasFilters = !!(emirate || speciality || search);
  const total = response?.meta?.total ?? 0;
  const totalPages = response?.meta?.pages ?? 1;
  const hasMore = page < totalPages;
  const showLoading = isLoading || (isFetching && allVets.length === 0);

  return (
    <div className="flex flex-col gap-4 p-3 pt-2 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white/80 text-base font-bold flex items-center gap-2">
            Find a Vet 🏥
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            Verified clinics across all 7 UAE emirates
          </p>
        </div>
        {!showLoading && total > 0 && (
          <div className="px-3 py-1 rounded-md border border-steel-blue/70 dark:border-lime-burst/70 dark:text-white/80 text-steel-blue dark:bg-lime-burst/20">
            <p className="text-xs font-medium">
              {allVets.length} / {total}
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <VetFilters
        emirate={emirate}
        speciality={speciality}
        search={search}
        onEmirateChange={setEmirate}
        onSpecialityChange={setSpeciality}
        onSearchChange={setSearch}
        onClear={clearFilters}
      />

      {/* loader */}
      {showLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
            <VetCardLoader key={i} />
          ))}
        </div>
      )}

      {/* Cards */}
      {!showLoading && allVets.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {allVets.map((vet) => (
              <VetCard key={vet._id} vet={vet} />
            ))}
          </div>

          {hasMore && (
            <div ref={ref} className="flex justify-center py-6">
              {isFetching && <Spinner size="sm" color="primary" />}
            </div>
          )}

          {!hasMore && (
            <p className="text-center text-xs text-gray-400 py-3">
              ✨ All {total} clinics loaded
            </p>
          )}
        </>
      )}

      {/* Empty state */}
      {!showLoading && allVets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center">
            <span className="text-3xl">🔍</span>
          </div>
          <div>
            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">
              No clinics found
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Try adjusting your search or filters
            </p>
          </div>
          {hasFilters && (
            <Button
              variant="solid"
              color="primary"
              size="sm"
              radius="lg"
              onPress={clearFilters}
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default VetFinderPage;
