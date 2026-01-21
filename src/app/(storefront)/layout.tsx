import { StoreHeader } from "@/components/layouts/StoreHeader";
import { StoreFooter } from "@/components/layouts/StoreFooter";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
    </div>
  );
}