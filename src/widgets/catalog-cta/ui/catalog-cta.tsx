import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/ui";
import type { ICatalogCtaSection } from "@/entities/page";
import { ROUTES } from "@/shared/router";

interface ICatalogCtaProps {
  data: ICatalogCtaSection;
  locale: string;
}

export function CatalogCta({ data, locale }: ICatalogCtaProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-[13px]">
      {/* Background Image */}
      {data.image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={data.image}
            alt=""
            fill
            className="object-cover"
            priority
          />
          {/* Overlay для лучшей читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center px-4 py-12 text-center sm:min-h-[400px] sm:px-6 sm:py-16 lg:min-h-[450px] lg:px-8 lg:py-20">
        <h3 className="mb-4 text-4xl font-bold uppercase leading-tight text-white">
          {data.title}
        </h3>
        <p className="mb-8 text-xl text-white">
          {data.subtitle}
        </p>
        <Link href={`/${locale}/${ROUTES.CATALOG}`}>
          <Button
            className="h-12 rounded-full bg-gradient-to-r from-[#8A18D2] to-[#2C3378] px-8 text-sm font-bold uppercase text-white transition-all hover:scale-105"
          >
            {data.buttonText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
