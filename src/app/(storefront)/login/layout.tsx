export const dynamic = "force-dynamic"; // <-- ADD THIS LINE

// This layout component's only job is to render its children directly
// without any extra navigation or footers.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}