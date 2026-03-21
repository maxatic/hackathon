"use client";

import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

export function AnnouncementBanner() {
  return (
    <div className="flex items-center justify-center py-3 px-4">
      <div
        className={cn(
          "group rounded-full border border-white/10 bg-neutral-900 text-sm text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-800",
        )}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 font-mono text-[11px] tracking-wide whitespace-nowrap transition ease-out hover:text-neutral-300 hover:duration-300">
          <span>Now in Early Access — Built for job seekers in the DACH region</span>
          <ArrowRightIcon className="ml-1.5 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div>
    </div>
  );
}
