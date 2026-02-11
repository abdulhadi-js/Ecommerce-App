"use client";

import { motion, useInView, Variants, Transition } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

// --- 1. THE MAIN WRAPPER ---
export function FadeIn({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const transition: Transition = {
    type: "spring", // Explicitly typed
    stiffness: 100,
    damping: 20,
    duration: 0.8,
  };

  return (
    <motion.div
      ref={ref}
      className={cn("w-full", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

// --- 2. THE STAGGER CONTAINER ---
export function FadeInStagger({
  children,
  faster = false,
  className,
}: {
  children: ReactNode;
  faster?: boolean;
  className?: string;
}) {
  const staggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: faster ? 0.1 : 0.2,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerVariants}
    >
      {children}
    </motion.div>
  );
}

// --- 3. STAGGERED CHILD ITEM ---
export const FadeInItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      duration: 1,
    },
  },
};

export function FadeInChild({ children, className }: { children: ReactNode; className?: string }) {
    return (
      <motion.div variants={FadeInItem} className={className}>
        {children}
      </motion.div>
    );
  }