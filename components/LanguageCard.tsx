// Enhanced LanguageCard Component
"use client";
import { Language } from "@/data/languages";
import { Code2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface LanguageCardProps {
  language: Language;
}

export const LanguageCard = ({ language }: LanguageCardProps) => {
  const router = useRouter();

  return (
    <div 
      className="group relative overflow-hidden cursor-pointer transition-all hover:scale-[1.07] hover:shadow-xl hover:border-primary bg-card rounded-2xl border border-border/40 backdrop-blur-md"
      onClick={() => router.push(`/editor/${language.id}`)}
    >
      <div className="p-4 flex flex-col items-center gap-3">
        {/* Icon */}
        <div className="w-18 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary transition-all shadow-soft shadow-md">
          <span className="text-2xl font-bold text-foreground group-hover:text-primary-foreground drop-shadow-sm">
            {language.icon}
          </span>
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="font-semibold text-base text-foreground mb-1 tracking-wide">
            {language.name}
          </h3>
          <p className="text-sm text-muted-foreground">{language.category}</p>
        </div>

        {/* Corner Icon */}
        <Code2 className="absolute top-3 right-3 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Bottom Glow */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40 opacity-0 group-hover:opacity-100 transition-all" />
      </div>
    </div>
  );
};
