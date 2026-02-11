"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { 
    LucideIcon, ArrowUpRight, Sparkles, Zap, 
    Heart, TrendingUp 
} from "lucide-react";
import { motion } from "framer-motion"; // 1. Import motion
import { cn } from "@/lib/utils";

// 1. Create a map of icon names to components
const iconMap: Record<string, LucideIcon> = {
    sparkles: Sparkles,
    zap: Zap,
    heart: Heart,
    trendingUp: TrendingUp,
};

type BentoVariant = "default" | "primary" | "sale" | "outline";

export interface BentoCardProps {
  title: string;
  description?: string;
  href: string;
  // 2. Change the 'icon' prop to accept a STRING
  iconName?: keyof typeof iconMap;
  variant?: BentoVariant;
  children?: ReactNode;
  className?: string;
}

export function BentoCard({
  title,
  description,
  href,
  iconName, // Changed from 'icon'
  variant = "default",
  children,
  className,
}: BentoCardProps) {
  
  
  const Icon = iconName ? iconMap[iconName] : null;

  const variantStyles: Record<BentoVariant, string> = {
    default: "bg-white border-border hover:border-brand/40 shadow-sm text-foreground",
    primary: "bg-gradient-brand text-white border-transparent shadow-brand-glow",
    sale: "bg-gradient-sale text-white border-transparent shadow-lg",
    outline: "bg-transparent border-2 border-brand text-brand hover:bg-brand/5",
  };

  const iconStyles: Record<BentoVariant, string> = {
    default: "text-brand bg-brand/10",
    primary: "text-white bg-white/20",
    sale: "text-white bg-white/20",
    outline: "text-brand bg-brand/10",
  };

  return (
    <motion.div 
        className={className} 
        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
    >
      <Link
        href={href}
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden h-full rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1",
          variantStyles[variant]
        )}
      >
      {(variant === "primary" || variant === "sale") && (
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors" />
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          {/* Now it renders the icon dynamically */}
          {Icon && (
            <div className={cn("rounded-md p-2 transition-transform group-hover:scale-110", iconStyles[variant])}>
              <Icon size={20} />
            </div>
          )}
          <ArrowUpRight 
            size={18} 
            className={cn(
              "opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1",
              variant === "default" || variant === "outline" ? "text-brand" : "text-white"
            )} 
          />
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="font-serif text-xl font-bold leading-tight">
            {title}
          </h3>
          {description && (
            <p className={cn(
              "text-sm font-medium leading-relaxed line-clamp-2",
              variant === "default" || variant === "outline" ? "text-muted-foreground" : "text-white/80"
            )}>
              {description}
            </p>
          )}
        </div>
      </div>

      {children && (
        <div className="relative mt-4 h-full w-full">
          {children}
        </div>
      )}
    </Link>
    </motion.div>
  );
}