// "use client";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { X, ChevronLeft, ChevronRight } from "lucide-react";

// interface ImageLightboxProps {
//   images: string[];
//   initialIndex?: number;
//   onClose: () => void;
// }

// export function ImageLightbox({
//   images,
//   initialIndex = 0,
//   onClose,
// }: ImageLightboxProps) {
//   const [current, setCurrent] = useState(initialIndex);

//   const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
//   const next = () => setCurrent((c) => (c + 1) % images.length);

//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//       if (e.key === "ArrowLeft") prev();
//       if (e.key === "ArrowRight") next();
//     };
//     document.body.style.overflow = "hidden";
//     window.addEventListener("keydown", handler);
//     return () => {
//       document.body.style.overflow = "";
//       window.removeEventListener("keydown", handler);
//     };
//   }, [current]);

//   return (
//     <div
//       className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
//       onClick={onClose}
//     >
//       {/* Close */}
//       <button
//         onClick={onClose}
//         className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white"
//       >
//         <X size={18} />
//       </button>

//       {/* Counter */}
//       {images.length > 1 && (
//         <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm z-10">
//           {current + 1} / {images.length}
//         </div>
//       )}

//       {/* Image */}
//       <div
//         className="relative max-w-[90vw] max-h-[85vh] w-full h-full"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <Image
//           src={images[current]}
//           alt={`Photo ${current + 1}`}
//           fill
//           className="object-contain"
//           sizes="90vw"
//         />
//       </div>

//       {/* Prev/Next */}
//       {images.length > 1 && (
//         <>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               prev();
//             }}
//             className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white"
//           >
//             <ChevronLeft size={22} />
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               next();
//             }}
//             className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white"
//           >
//             <ChevronRight size={22} />
//           </button>
//           {/* Thumbnail strip */}
//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//             {images.map((src, i) => (
//               <button
//                 key={i}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setCurrent(i);
//                 }}
//                 className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === current ? "border-white scale-110" : "border-white/30"}`}
//               >
//                 <Image
//                   src={src}
//                   alt={`thumb ${i + 1}`}
//                   fill
//                   className="object-cover"
//                   sizes="48px"
//                 />
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

"use client";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";

interface Props {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex = 0, onClose }: Props) {
  return (
    <Lightbox
      open
      close={onClose}
      index={initialIndex}
      slides={images.map((src) => ({ src }))}
      render={{
        // Use next/image for optimised loading
        slide: ({ slide }) => (
          <div className="relative w-full h-full">
            <Image
              src={slide.src}
              alt="Pet photo"
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        ),
      }}
    />
  );
}
