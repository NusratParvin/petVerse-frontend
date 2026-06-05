// "use client";
// import { useState, useRef } from "react";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// interface ImageCarouselProps {
//   images: string[];
//   alt?: string;
//   className?: string;
//   onImageClick?: (index: number) => void;
// }

// export function ImageCarousel({
//   images,
//   alt = "Pet photo",
//   className = "",
//   onImageClick,
// }: ImageCarouselProps) {
//   const [current, setCurrent] = useState(0);
//   const touchStartX = useRef<number | null>(null);

//   if (!images?.length) return null;

//   const prev = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setCurrent((c) => (c - 1 + images.length) % images.length);
//   };
//   const next = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setCurrent((c) => (c + 1) % images.length);
//   };

//   return (
//     <div
//       className={`relative overflow-hidden group ${className}`}
//       onTouchStart={(e) => {
//         touchStartX.current = e.touches[0].clientX;
//       }}
//       onTouchEnd={(e) => {
//         if (touchStartX.current === null) return;
//         const diff = touchStartX.current - e.changedTouches[0].clientX;
//         if (diff > 40) setCurrent((c) => (c + 1) % images.length);
//         else if (diff < -40)
//           setCurrent((c) => (c - 1 + images.length) % images.length);
//         touchStartX.current = null;
//       }}
//     >
//       {/* Slides */}
//       {images.map((src, i) => (
//         <div
//           key={src + i}
//           className={`absolute inset-0 transition-opacity duration-300 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
//           onClick={() => onImageClick?.(i)}
//         >
//           <Image
//             src={src}
//             alt={`${alt} ${i + 1}`}
//             fill
//             className={`object-cover ${onImageClick ? "cursor-zoom-in" : ""}`}
//             sizes="(max-width: 640px) 100vw, 50vw"
//           />
//         </div>
//       ))}

//       {/* Prev / Next — only if multiple */}
//       {images.length > 1 && (
//         <>
//           <button
//             onClick={prev}
//             className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 dark:bg-black/60 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//           >
//             <ChevronLeft size={16} />
//           </button>
//           <button
//             onClick={next}
//             className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 dark:bg-black/60 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//           >
//             <ChevronRight size={16} />
//           </button>

//           {/* Counter */}
//           <div className="absolute bottom-2 right-2 z-20 bg-black/55 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
//             {current + 1}/{images.length}
//           </div>

//           {/* Dots */}
//           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
//             {images.map((_, i) => (
//               <button
//                 key={i}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setCurrent(i);
//                 }}
//                 className={`rounded-full transition-all duration-200 ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

"use client";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

interface Props {
  images: string[];
  alt?: string;
  className?: string;
  onImageClick?: (index: number) => void;
}

export function ImageCarousel({
  images,
  alt = "Pet photo",
  className = "",
  onImageClick,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const current = emblaApi?.selectedScrollSnap() ?? 0;

  if (!images?.length) return null;

  return (
    <div className={`relative overflow-hidden ${className}`} ref={emblaRef}>
      <div className="flex h-full">
        {images.map((src, i) => (
          <div
            key={i}
            className="flex-[0_0_100%] relative h-full cursor-zoom-in"
            onClick={() => onImageClick?.(i)}
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width:640px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              emblaApi?.scrollPrev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center text-sm z-10"
          >
            ‹
          </button>
          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              emblaApi?.scrollNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center text-sm z-10"
          >
            ›
          </button>
          {/* Counter */}
          <div className="absolute bottom-2 right-2 bg-black/55 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">
            {current + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
}
