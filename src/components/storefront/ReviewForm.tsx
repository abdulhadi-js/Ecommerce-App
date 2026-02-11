"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { submitReview } from "@/actions/reviews";
import { Button } from "@/components/ui/button";

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await submitReview(productId, rating, comment);
    
    if (result.success) {
      setMsg({ type: "success", text: result.message });
      setComment("");
    } else {
      setMsg({ type: "error", text: result.message });
    }
    setLoading(false);
  };

  return (
    <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
      <h3 className="font-serif text-xl font-bold text-brand mb-6">Write a Review</h3>
      
      {msg && (
        <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xs uppercase font-bold text-accent block mb-3">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button 
                key={s} 
                type="button" 
                onClick={() => setRating(s)}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-full p-1 -m-1 transition-transform hover:scale-110"
                aria-label={`Rate ${s} stars`}
                aria-pressed={rating >= s}
              >
                <Star className={`w-6 h-6 transition-colors ${rating >= s ? "fill-brand text-brand" : "text-border fill-transparent"}`} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="review-comment" className="text-xs uppercase font-bold text-accent block mb-3">Comment</label>
          <textarea 
            id="review-comment"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 text-sm bg-ghost_white border border-border rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none placeholder:text-accent/50 text-brand"
            rows={4}
            placeholder="Share your experience with this product..."
          />
        </div>

        <Button 
          disabled={loading}
          className="w-full sm:w-auto bg-brand text-ghost_white hover:bg-charcoal_blue/90"
          isLoading={loading}
        >
          Post Review
        </Button>
      </form>
    </div>
  );
}