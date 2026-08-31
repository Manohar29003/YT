"use client";

import React from "react";
import Image from "next/image";
import { Play, Film } from "lucide-react";
import { MediaItem } from "@/data/media";

interface MediaCardProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onClick }) => {
  return (
    <div
      onClick={() => onClick(item)}
      className="group cursor-pointer flex flex-col gap-2 transition-all duration-200 ease-out transform hover:-translate-y-1 [will-change:transform]"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-zinc-800/80 bg-zinc-900 shadow-md transition-all duration-200 ease-out group-hover:border-zinc-600 group-hover:shadow-xl group-hover:shadow-black/70">
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.filename}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            unoptimized
          />
        ) : item.type === "video" ? (
          <video
            src={item.url}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            preload="metadata"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-600 group-hover:text-zinc-400 transition-colors">
            <Film className="h-8 w-8" />
          </div>
        )}

        {/* Shimmer light sweep effect */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

        {/* Dynamic Dark Gradient Ambient Tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out" />

        {/* Video specific play indicator */}
        {item.type === "video" && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950/80 text-zinc-100 backdrop-blur-sm border border-zinc-700/60 shadow-lg transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-zinc-900">
                <Play className="h-4.5 w-4.5 fill-zinc-100 ml-0.5" />
              </div>
            </div>

            {/* Duration badge */}
            {item.duration && (
              <div className="absolute bottom-2.5 right-2.5 rounded bg-zinc-950/90 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-zinc-300 border border-zinc-800/80 group-hover:border-zinc-600 group-hover:text-zinc-100 transition-colors duration-200">
                {item.duration}
              </div>
            )}
          </>
        )}
      </div>

      {/* Understated Filename Label */}
      <div className="px-0.5 flex items-center justify-between">
        <span className="truncate font-mono text-xs text-zinc-400 group-hover:text-zinc-100 transition-colors duration-200">
          {item.filename}
        </span>
      </div>
    </div>
  );
};
