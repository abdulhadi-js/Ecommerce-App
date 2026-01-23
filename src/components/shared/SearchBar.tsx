"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="hidden lg:flex items-center relative mx-4">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-3 pr-8 py-1 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors w-48"
      />
      <button type="submit" className="absolute right-2 text-gray-400 hover:text-black">
        <Search size={14} />
      </button>
    </form>
  );
}