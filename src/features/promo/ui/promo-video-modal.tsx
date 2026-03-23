"use client";

import { Dialog, DialogContent } from "@/shared/ui";
import { getYoutubeEmbedUrl } from "@/shared/lib/video.util";

interface IPromoVideoModalProps {
  open: boolean;
  onClose: () => void;
  videoUrl: string | null;
  title?: string;
}

export function PromoVideoModal({
  open,
  onClose,
  videoUrl,
  title = "Promo video",
}: IPromoVideoModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        showClose={false}
        className="w-[calc(100vw-2rem)] max-w-4xl p-0 overflow-hidden rounded-2xl border-none bg-[linear-gradient(90deg,#200C33_0%,#0A172B_100%)] shadow-xl"
      >
        {videoUrl ? (
          <div className="aspect-video overflow-hidden bg-black">
            <iframe
              src={getYoutubeEmbedUrl(videoUrl, { autoplay: false })}
              className="h-full w-full"
              title={title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center text-text-secondary">
            Video unavailable
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

