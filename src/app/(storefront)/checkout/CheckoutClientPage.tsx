"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { placeOrder } from "@/actions/placeOrder";
import { clearCart } from "@/lib/store/features/cartSlice";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { countries } from "@/lib/countries";

export default function CheckoutClientPage({ user }: { user: any }) {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix Hydration Mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Add shipping calculation here if needed

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const customerName = formData.get("fullName") as string;

    // Smart Phone Logic
    const countryCode = formData.get("countryCode") as string;
    const rawPhone = formData.get("phone") as string;
    const cleanPhone = rawPhone.replace(/\s+/g, "");
    formData.set("phone", `${countryCode}${cleanPhone}`);

    const cartPayload = items.map((i) => ({ id: i.id, quantity: i.quantity }));

    try {
      const result = await placeOrder(cartPayload, formData);

      if (result.success) {
        dispatch(clearCart());
        router.push(
          `/checkout/success?orderId=${result.orderId}&customerName=${encodeURIComponent(customerName)}`
        );
      } else {
        alert(result.error || "Failed to place order.");
        setLoading(false);
      }
    } catch (error) {
      console.error("CHECKOUT_ERROR:", error);
      alert("Network error. Please try again.");
      setLoading(false);
    }
  }

  // Loading State
  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center justify-center animate-pulse">
        <Loader2 className="w-8 h-8 animate-spin text-gray-200 mb-4" />
        <p className="text-gray-400 font-serif italic">Securely loading checkout...</p>
      </div>
    );
  }

  // Empty Cart State
  if (items.length === 0 && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif text-gray-900 mb-4">Your bag is empty</h2>
        <Link
          href="/products"
          className="bg-black text-white px-10 py-4 uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-zinc-800 transition-all inline-block"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
      {/* PROGRESS INDICATOR */}
      <div className="flex items-center justify-center mb-16 space-x-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
        <span className="text-black">1. Bag</span>
        <span className="w-8 h-[1px] bg-gray-200"></span>
        <span className="text-black">2. Details</span>
        <span className="w-8 h-[1px] bg-gray-200"></span>
        <span>3. Complete</span>
      </div>

      <Link
        href="/cart"
        className="inline-flex items-center text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-black mb-12 transition-colors"
      >
        <ArrowLeft className="w-3 h-3 mr-2" /> Back to shopping bag
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* LEFT COLUMN: SHIPPING FORM */}
        <div className="lg:col-span-7">
          <h1 className="text-3xl font-serif text-gray-900 mb-10 tracking-tight">Shipping Destination</h1>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Full Name */}
            <div className="group">
              <label htmlFor="fullName" className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2 group-focus-within:text-black transition-colors">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                type="text"
                defaultValue={user?.name || ""}
                placeholder="e.g. Abdullah Khan"
                className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
              />
            </div>

            {/* Phone with Dynamic Country Picker */}
            <div className="group">
              <label htmlFor="phone" className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2 group-focus-within:text-black transition-colors">
                Contact Number
              </label>
              <div className="flex items-center border-b border-gray-200 group-focus-within:border-black transition-colors">
                <div className="relative flex items-center pr-3 border-r border-gray-100">
                  <select
                    name="countryCode"
                    className="bg-transparent text-sm font-medium focus:outline-none appearance-none cursor-pointer pr-5 z-10"
                    defaultValue="+92"
                    aria-label="Country Code"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.dialCode}>
                        {c.flag} {c.dialCode}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-1 pointer-events-none text-[8px] text-gray-400">▼</span>
                </div>
                <input
                  id="phone"
                  name="phone"
                  required
                  type="tel"
                  pattern="[0-9]{7,15}"
                  placeholder="300 1234567"
                  className="w-full bg-transparent py-3 pl-4 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div className="group">
              <label htmlFor="address" className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2 group-focus-within:text-black transition-colors">
                Residential Address
              </label>
              <input
                id="address"
                name="address"
                required
                type="text"
                placeholder="House #, Street name, Area"
                className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
              />
            </div>

            {/* City */}
            <div className="group">
              <label htmlFor="city" className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2 group-focus-within:text-black transition-colors">
                City
              </label>
              <select
                id="city"
                name="city"
                required
                className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent appearance-none rounded-none"
              >
                <option value="">Select city</option>
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Multan">Multan</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Quetta">Quetta</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="pt-6">
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Complete Purchase"}
              </button>
              <p className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest text-gray-400 mt-4">
                <ShieldCheck size={12} /> Secure encrypted transaction
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="lg:col-span-5 bg-[#F9F9F9] p-8 rounded-lg sticky top-24 border border-gray-100">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-8 pb-4 border-b border-gray-200">
            Order Summary
          </h3>
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className="relative w-14 h-16 bg-white border border-gray-200 rounded overflow-hidden flex-shrink-0">
                    <img src={item.image || "/placeholder.jpg"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-900 leading-tight uppercase tracking-tighter">
                        {item.name}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-6 mt-6 space-y-3">
              <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">Complimentary</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg text-black uppercase tracking-tighter">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 p-4 bg-white border border-gray-100 rounded text-[9px] text-gray-400 uppercase tracking-[0.2em] text-center leading-relaxed">
            Payment Method: Cash on Delivery <br />
            <span className="font-bold text-zinc-800">Pay when your order arrives</span>
          </div>
        </div>
      </div>
    </div>
  );
}