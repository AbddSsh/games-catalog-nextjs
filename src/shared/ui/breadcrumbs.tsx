/**
 * Breadcrumbs Component
 * Navigation breadcrumbs with customizable separator
 */

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib";

export interface IBreadcrumbItem {
  label: string;
  href?: string;
}

interface IBreadcrumbsProps {
  items: IBreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: IBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1 text-sm", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-1">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-text-primary transition-colors hover:text-text-muted"
              >
                {item.label}
              </Link>
            ) : (
              <span>
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="h-4 w-4 text-text-primary" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
