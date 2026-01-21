export function StoreFooter() {
  return (
    <footer className="bg-secondary/30 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center">
        <p className="text-sm text-muted-foreground font-serif">
          &copy; {new Date().getFullYear()} LuxeStore. Defined by elegance.
        </p>
      </div>
    </footer>
  );
}