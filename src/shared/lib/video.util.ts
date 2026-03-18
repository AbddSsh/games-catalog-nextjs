export function getYoutubeEmbedUrl(
  videoUrl: string,
  options?: { autoplay?: boolean }
): string {
  const autoplay = options?.autoplay ?? true;

  try {
    const url = new URL(videoUrl);
    const autoplayParam = autoplay ? 1 : 0;

    if (url.hostname.includes("youtu.be")) {
      const videoId = url.pathname.replace("/", "");
      const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
      embedUrl.searchParams.set("autoplay", String(autoplayParam));
      return embedUrl.toString();
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        const embedUrl = new URL(`${url.origin}${url.pathname}`);
        // Сохраняем текущие query-параметры, но принудительно выставляем autoplay.
        for (const [k, v] of url.searchParams.entries()) {
          embedUrl.searchParams.set(k, v);
        }
        embedUrl.searchParams.set("autoplay", String(autoplayParam));
        return embedUrl.toString();
      }
      const videoId = url.searchParams.get("v");
      if (videoId) {
        const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
        embedUrl.searchParams.set("autoplay", String(autoplayParam));
        return embedUrl.toString();
      }
    }
  } catch {
    // ignore parse errors, fallback to original URL
  }

  return videoUrl;
}

