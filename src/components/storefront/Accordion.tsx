"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const AccordionContext = React.createContext<{
  openItems: string[];
  toggleItem: (value: string) => void;
} | null>(null);

const Accordion = ({
  children,
  type = "single",
  collapsible = false,
  className,
  defaultValue,
}: {
  children: React.ReactNode;
  type?: "single" | "multiple";
  collapsible?: boolean;
  className?: string;
  defaultValue?: string | string[];
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
  );

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      if (type === "single") {
        if (prev.includes(value)) {
          return collapsible ? [] : prev;
        }
        return [value];
      } else {
        if (prev.includes(value)) {
          return prev.filter((item) => item !== value);
        }
        return [...prev, value];
      }
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
};

const AccordionItemContext = React.createContext<{ value: string } | null>(null);

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => (
  <AccordionItemContext.Provider value={{ value }}>
    <div ref={ref} className={cn("border-b border-border last:border-0", className)} {...props}>
      {children}
    </div>
  </AccordionItemContext.Provider>
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { openItems, toggleItem } = React.useContext(AccordionContext)!;
  const { value } = React.useContext(AccordionItemContext)!;
  const isOpen = openItems.includes(value);

  return (
    <div className="flex">
      <button
        ref={ref}
        onClick={() => toggleItem(value)}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium text-foreground transition-all hover:text-brand hover:underline",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-accent transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
    </div>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { openItems } = React.useContext(AccordionContext)!;
  const { value } = React.useContext(AccordionItemContext)!;
  const isOpen = openItems.includes(value);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div ref={ref} className={cn("pb-4 pt-0 text-sm text-accent leading-relaxed", className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };