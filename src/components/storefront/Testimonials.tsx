import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Eleanor P.",
    role: "Verified Buyer",
    text: "The quality of the silk blouse is simply unmatched. It feels like a second skin. Shipping was incredibly fast to London.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus T.",
    role: "Verified Buyer",
    text: "I appreciate the sustainable packaging. It makes me feel good about my purchase. The fit is true to size and very flattering.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah J.",
    role: "Verified Buyer",
    text: "Customer service went above and beyond to help me with an exchange. This is what luxury service feels like.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-surface/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="mb-12 space-y-4">
            <h2 className="text-3xl font-serif font-bold text-brand">Voices of Luxe</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
                Join thousands of satisfied patrons who have elevated their wardrobe with our curated pieces.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="mb-6 text-brand/20">
                <Quote size={40} />
              </div>
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < review.rating ? "fill-brand text-brand" : "text-gray-200"} 
                  />
                ))}
              </div>

              <p className="text-gray-600 font-medium italic mb-6 leading-relaxed">
                &quot;{review.text}&quot;
              </p>

              <div className="mt-auto">
                <p className="font-bold text-brand text-sm uppercase tracking-widest">{review.name}</p>
                <p className="text-xs text-sale font-bold mt-1">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}