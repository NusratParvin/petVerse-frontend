"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Spinner, Chip } from "@heroui/react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NextImage from "next/image";

interface GalleryProps {
  cardData: string[];
}

const Gallery = ({ cardData }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbnailStart, setThumbnailStart] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const thumbnailContainerRef = useRef(null);

  const THUMBNAILS_PER_VIEW = 4;
  const visibleThumbnails =
    cardData?.slice(thumbnailStart, thumbnailStart + THUMBNAILS_PER_VIEW) || [];

  const scrollThumbnails = (direction: any) => {
    if (direction === "down") {
      setThumbnailStart((prev) =>
        Math.min(prev + 2, cardData.length - THUMBNAILS_PER_VIEW),
      );
    } else {
      setThumbnailStart((prev) => Math.max(0, prev - 2));
    }
  };

  useEffect(() => {
    // Preload current and adjacent images
    const toPreload = [currentIndex - 1, currentIndex, currentIndex + 1].filter(
      (i) => i >= 0 && i < cardData.length,
    );

    toPreload.forEach((i) => {
      if (!loadedImages.has(cardData[i])) {
        const img = new Image();
        img.src = cardData[i];
        img.onload = () =>
          setLoadedImages((prev) => new Set(prev).add(cardData[i]));
      }
    });
  }, [currentIndex, cardData, loadedImages]);

  if (!cardData?.length) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Vertical Thumbnail Carousel */}
        <div className="relative md:w-[100px] order-2 md:order-1">
          {thumbnailStart > 0 && (
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => scrollThumbnails("up")}
              className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-7 h-7"
            >
              <ChevronUp className="w-3 h-3" />
            </Button>
          )}

          <div className="flex md:flex-col gap-2 overflow-y-auto max-h-[400px] py-8 hide-scrollbar">
            {visibleThumbnails.map((img, idx) => {
              const actualIndex = thumbnailStart + idx;
              return (
                <Button
                  key={actualIndex}
                  onPress={() => setCurrentIndex(actualIndex)}
                  className="relative group flex-shrink-0 p-0 bg-transparent w-full h-20 md:h-24"
                >
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <NextImage
                      src={img}
                      alt={`Thumb ${actualIndex + 1}`}
                      width={100}
                      height={100}
                      className={`
                        w-full h-full object-cover transition-all duration-300
                        ${
                          currentIndex === actualIndex
                            ? "ring-2 ring-primary opacity-100 scale-95"
                            : "opacity-50 group-hover:opacity-75"
                        }
                      `}
                      loading="lazy"
                    />
                  </div>
                </Button>
              );
            })}
          </div>

          {thumbnailStart + THUMBNAILS_PER_VIEW < cardData.length && (
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => scrollThumbnails("down")}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-7 h-7"
            >
              <ChevronDown className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Main Carousel */}
        <div className="relative flex-1 overflow-hidden rounded-md order-1 md:order-2">
          <div className="relative h-80 md:h-[420px] overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-md">
            {loadedImages.has(cardData[currentIndex]) && (
              <div className="relative w-full h-full">
                <NextImage
                  src={cardData[currentIndex]}
                  alt={`Slide ${currentIndex + 1}`}
                  fill
                  priority={currentIndex === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  className="object-cover"
                />
              </div>
            )}

            {!loadedImages.has(cardData[currentIndex]) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="lg" color="primary" />
              </div>
            )}
          </div>

          <Button
            isIconOnly
            size="md"
            variant="flat"
            onPress={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? cardData.length - 1 : prev - 1,
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 rounded-full shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            isIconOnly
            size="md"
            variant="flat"
            onPress={() =>
              setCurrentIndex((prev) => (prev + 1) % cardData.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 rounded-full shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          <Chip className="absolute bottom-4 left-4 bg-black/60 text-white">
            {currentIndex + 1} / {cardData.length}
          </Chip>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Gallery;
