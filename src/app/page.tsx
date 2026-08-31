"use client";

import React, { useState, useMemo, useEffect } from "react";
import { MEDIA_ITEMS, MediaItem } from "@/data/media";
import { Navbar } from "@/components/Navbar";
import { MediaGrid } from "@/components/MediaGrid";
import { MediaModal } from "@/components/MediaModal";
import { DonateModal } from "@/components/DonateModal";
import { Toast } from "@/components/Toast";
import { AmbientBackground } from "@/components/AmbientBackground";
import { saveMediaItem, getAllMediaItems, deleteMediaItem } from "@/utils/db";

export default function Home() {
  const [items, setItems] = useState<MediaItem[]>(MEDIA_ITEMS);
  const [activeFilter, setActiveFilter] = useState<"all" | "video" | "image">("all");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  // Load persistent uploaded media from IndexedDB on page load
  useEffect(() => {
    async function loadStoredMedia() {
      const stored = await getAllMediaItems();
      if (stored && stored.length > 0) {
        stored.sort((a, b) => b.timestamp - a.timestamp);

        const customMediaItems: MediaItem[] = stored.map((item) => {
          const fileUrl = URL.createObjectURL(item.file);
          return {
            id: item.id,
            filename: item.filename,
            type: item.type,
            url: fileUrl,
            thumbnailUrl: item.type === "image" ? fileUrl : "",
            duration: item.duration,
            size: item.size,
            isCustom: true,
          };
        });

        setItems(customMediaItems);
      } else {
        setItems([]);
      }
    }

    loadStoredMedia();
  }, []);

  // Owner mode check (URL query param e.g. ?admin=true or persistent localStorage)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const adminParam = params.get("admin") || params.get("owner") || params.get("upload");

      if (adminParam === "true" || adminParam === "1") {
        setIsOwner(true);
        localStorage.setItem("isOwner", "true");
        setToastMessage("Owner upload enabled");
      } else if (adminParam === "false" || adminParam === "0") {
        setIsOwner(false);
        localStorage.removeItem("isOwner");
        setToastMessage("Owner upload hidden");
      } else {
        const savedOwner = localStorage.getItem("isOwner");
        if (savedOwner === "true") {
          setIsOwner(true);
        }
      }
    }
  }, []);

  // Keyboard shortcut Ctrl+Shift+U to toggle owner mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        setIsOwner((prev) => {
          const next = !prev;
          if (next) {
            localStorage.setItem("isOwner", "true");
            setToastMessage("Owner upload enabled");
          } else {
            localStorage.removeItem("isOwner");
            setToastMessage("Owner upload hidden");
          }
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Check URL search params for direct shareable link (e.g. ?media=vid-1)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const mediaId = params.get("media");
      if (mediaId) {
        const found = items.find((item) => item.id === mediaId);
        if (found) {
          setSelectedMedia(found);
        }
      }
    }
  }, [items]);

  // Handle uploaded files from user's device & save persistently to IndexedDB
  const handleUploadFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    showToast(`Processing ${fileArray.length} file${fileArray.length > 1 ? "s" : ""}...`);

    const newItems: MediaItem[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");

      if (!isVideo && !isImage) continue;

      const fileUrl = URL.createObjectURL(file);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      const newItemId = `custom-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`;
      const timestamp = Date.now() + i;

      let durationStr: string | undefined;

      if (isVideo) {
        durationStr = await new Promise<string>((resolve) => {
          let resolved = false;
          const timeout = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              resolve("00:00");
            }
          }, 1000);

          const tempVideo = document.createElement("video");
          tempVideo.preload = "metadata";
          tempVideo.muted = true;
          tempVideo.playsInline = true;
          tempVideo.src = fileUrl;

          tempVideo.onloadedmetadata = () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              if (isNaN(tempVideo.duration) || !isFinite(tempVideo.duration)) {
                resolve("00:00");
              } else {
                const minutes = Math.floor(tempVideo.duration / 60);
                const seconds = Math.floor(tempVideo.duration % 60);
                const formatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                resolve(formatted);
              }
            }
          };

          tempVideo.onerror = () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              resolve("00:00");
            }
          };
        });
      }

      await saveMediaItem({
        id: newItemId,
        filename: file.name,
        type: isVideo ? "video" : "image",
        file: file,
        duration: durationStr,
        size: fileSizeMB,
        timestamp: timestamp,
      });

      newItems.push({
        id: newItemId,
        filename: file.name,
        type: isVideo ? "video" : "image",
        url: fileUrl,
        thumbnailUrl: isImage ? fileUrl : "",
        duration: durationStr,
        size: fileSizeMB,
        isCustom: true,
      });
    }

    if (newItems.length > 0) {
      setItems((prev) => [...newItems, ...prev]);
      showToast(`Uploaded ${newItems.length} file${newItems.length > 1 ? "s" : ""}`);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    await deleteMediaItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Filter media based on active filter tab (all / video / image)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeFilter === "video" && item.type !== "video") return false;
      if (activeFilter === "image" && item.type !== "image") return false;
      return true;
    });
  }, [items, activeFilter]);

  const videoCount = useMemo(() => items.filter((i) => i.type === "video").length, [items]);
  const imageCount = useMemo(() => items.filter((i) => i.type === "image").length, [items]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
      {/* Top-Notch Squarespace Ambient Aurora & Glowing Nodes Background */}
      <AmbientBackground />

      {/* Navbar (Top Navigation Bar) */}
      <div className="relative z-10">
        <Navbar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onOpenDonate={() => setIsDonateOpen(true)}
          onUploadFiles={handleUploadFiles}
          isOwner={isOwner}
          videoCount={videoCount}
          imageCount={imageCount}
        />
      </div>

      {/* Main Content Area: Immediately show Media Grid */}
      <div className="relative z-10 flex-1">
        <MediaGrid
          items={filteredItems}
          onSelectItem={(item) => setSelectedMedia(item)}
          onUploadFiles={handleUploadFiles}
          isOwner={isOwner}
        />
      </div>

      {/* Media Preview Modal */}
      <MediaModal
        item={selectedMedia}
        allItems={filteredItems.length > 0 ? filteredItems : items}
        onClose={() => setSelectedMedia(null)}
        onNavigate={(item) => setSelectedMedia(item)}
        onShowToast={showToast}
        onDeleteMedia={handleDeleteMedia}
        isOwner={isOwner}
      />

      {/* Donate Modal */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </main>
  );
}
