"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { placeOrder } from "@/actions/placeOrder";
import { clearCart } from "@/lib/store/features/cartSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

// The component now accepts the 'user' object as a prop
export default function CheckoutClientPage({ user }: { user: any }) {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0 && !loading) {
    // Redirect if cart is empty and we are not in the middle of processing an order
    router.push("/");
    return null; // Render nothing while redirecting
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const customerName = formData.get("fullName") as string;
    const cartPayload = items.map(i => ({ id: i.id, quantity: i.quantity }));
    try {
      const result = await placeOrder(cartPayload, formData); 
      if (result.success) {
        dispatch(clearCart());
        router.push(`/checkout/success?orderId=${result.orderId}&customerName=${customerName}`);
      } else {
        alert(result.error || "Something went wrong");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please try again.");
      setLoading(false);
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/cart" className="flex items-center text-sm text-gray-500 hover:text-black mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Shipping Form */}
        <div>
          <h1 className="text-2xl font-serif font-bold mb-6">Shipping Details</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">Full Name</label>
              {/* THIS IS THE UPDATED PART: We pre-fill the name */}
              <input name="fullName" required type="text" defaultValue={user?.name || ''} placeholder="Ali Khan" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black" />
            </div>
            {/* ... the rest of your form inputs (Phone, Address, City) remain exactly the same ... */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">Phone Number</label>
              <input name="phone" required type="tel" placeholder="0300 1234567" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">Address</label>
              <input name="address" required type="text" placeholder="House #, Street #, Area" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">City</label>
              <select name="city" required className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black bg-transparent">
                <option value="">Select City</option>
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Quetta">Quetta</option>
                <option value="Multan">Multan</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="pt-6">
              <button disabled={loading} type="submit" className="w-full bg-black text-white py-4 uppercase font-bold tracking-widest text-xs hover:bg-gray-800 disabled:opacity-50">
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Processing</span> : "Confirm Cash on Delivery"}
              </button>
            </div>
          </form>
        </div>
        {/* Right: Order Summary */}
        <div className="bg-gray-50 p-6 rounded h-fit">
          <h3 className="font-serif font-bold mb-4">Order Summary</h3>
          <div className="space-y-4 text-sm text-gray-600">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg text-black">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-6 text-center">
            You will pay upon delivery. Please have exact change ready.
          </p>
        </div>
      </div>
    </div>
  );
}