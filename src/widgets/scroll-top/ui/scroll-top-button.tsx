"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const SCROLL_TOP_VISIBLE_OFFSET = 120;

export function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_TOP_VISIBLE_OFFSET);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={handleClick}
      className={[
        "fixed bottom-10 right-10 z-50",
        "flex size-12 items-center justify-center rounded-full",
        "transition-all duration-300 ease-out hover:scale-105",
        isVisible ? "opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      style={{ backgroundColor: "#d2189a" }}
    >
      <ArrowUp className="size-6 text-white" />
    </button>
  );
}
