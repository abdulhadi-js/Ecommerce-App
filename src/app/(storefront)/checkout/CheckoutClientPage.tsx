"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { placeOrder } from "@/actions/placeOrder";
import { clearCart } from "@/lib/store/features/cartSlice";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, ShieldCheck, MapPin, Phone, User, Building2 } from "lucide-react";
import { countries } from "@/lib/countries";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import Image from "next/image";

// Zod Schema for Validation
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  countryCode: z.string(),
  phone: z.string().min(7, "Phone number is invalid").regex(/^\d+$/, "Only numbers allowed"),
  address: z.string().min(5, "Full address is required"),
  city: z.string().min(1, "Please select a city"),
  paymentMethod: z.enum(["stripe", "cod"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutClientPage({ user }: { user: any }) {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      countryCode: "+92",
      city: "",
      paymentMethod: "stripe",
    },
  });

  const paymentMethod = watch("paymentMethod");

  // Fix Hydration Mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const onSubmit = async (data: CheckoutFormValues) => {
    setGlobalError(null);

    // Prepare FormData as expected by Server Action
    const formData = new FormData();
    formData.set("fullName", data.fullName);
    formData.set("phone", `${data.countryCode}${data.phone}`);
    formData.set("address", data.address);
    formData.set("city", data.city);
    formData.set("paymentMethod", data.paymentMethod);
    // Needed for backward compatibility if action uses these keys individually
    formData.set("countryCode", data.countryCode); 

    const cartPayload = items.map((i) => ({ id: i.id, quantity: i.quantity }));

    try {
      const result = await placeOrder(cartPayload, formData);

      if (result.success) {
        dispatch(clearCart());
        if (result.checkoutUrl) {
          window.location.href = result.checkoutUrl;
        } else {
          router.push(
            `/checkout/success?orderId=${result.orderId}&customerName=${encodeURIComponent(data.fullName)}`
          );
        }
      } else {
        setGlobalError(result.error || "Failed to place order.");
      }
    } catch (error) {
      console.error("CHECKOUT_ERROR:", error);
      setGlobalError("Network error. Please try again.");
    }
  };

  // Loading State
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <h2 className="text-3xl font-serif text-foreground mb-6">Your bag is empty</h2>
        <p className="text-accent mb-8">Looks like you haven&apos;t added any luxury items yet.</p>
        <Link
          href="/products"
          className="bg-brand text-brand-foreground px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-brand/90 transition-all shadow-lg"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <Link
                href="/cart"
                className="inline-flex items-center text-sm font-medium text-accent hover:text-brand transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to shopping bag
            </Link>
            
            {/* Steps Indicator */}
            <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span className="text-brand">1. Bag</span>
                <span className="w-8 h-[1px] bg-border"></span>
                <span className="text-foreground border-b-2 border-brand pb-1">2. Details</span>
                <span className="w-8 h-[1px] bg-border"></span>
                <span>3. Complete</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: SHIPPING FORM */}
          <div className="lg:col-span-7">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-8 tracking-tight">Shipping Destination</h1>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {globalError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
                            {globalError}
                        </div>
                    )}

                    {/* Full Name */}
                    <div className="space-y-2">
                        <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-widest text-accent">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-icon-muted w-5 h-5" />
                            <input
                                {...register("fullName")}
                                placeholder="e.g. Abdullah Khan"
                                className={`w-full bg-surface border ${errors.fullName ? "border-red-500" : "border-input"} text-foreground pl-10 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all placeholder:text-muted-foreground`}
                            />
                        </div>
                        {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-accent">
                            Contact Number
                        </label>
                        <div className={`flex items-center bg-surface border ${errors.phone ? "border-red-500" : "border-input"} rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand focus-within:border-transparent transition-all`}>
                            <div className="relative border-r border-border h-full">
                                <select
                                    {...register("countryCode")}
                                    className="h-full bg-transparent text-foreground pl-3 pr-8 py-3.5 text-sm font-medium focus:outline-none appearance-none cursor-pointer"
                                >
                                    {countries.map((c) => (
                                    <option key={c.code} value={c.dialCode}>
                                        {c.flag} {c.dialCode}
                                    </option>
                                    ))}
                                </select>
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">▼</span>
                            </div>
                            <input
                                {...register("phone")}
                                type="tel"
                                placeholder="300 1234567"
                                className="w-full bg-transparent text-foreground px-4 py-3.5 focus:outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label htmlFor="address" className="block text-xs font-bold uppercase tracking-widest text-accent">
                            Residential Address
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-icon-muted w-5 h-5" />
                            <input
                                {...register("address")}
                                placeholder="House #, Street name, Area"
                                className={`w-full bg-surface border ${errors.address ? "border-red-500" : "border-input"} text-foreground pl-10 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all placeholder:text-muted-foreground`}
                            />
                        </div>
                        {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                        <label htmlFor="city" className="block text-xs font-bold uppercase tracking-widest text-accent">
                            City
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-icon-muted w-5 h-5" />
                            <select
                                {...register("city")}
                                className={`w-full bg-surface border ${errors.city ? "border-red-500" : "border-input"} text-foreground pl-10 pr-8 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all appearance-none cursor-pointer`}
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
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">▼</span>
                        </div>
                        {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                    </div>

                    {/* Payment Method Selection */}
                    <div className="space-y-3 pt-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-accent">
                            Payment Method
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className={`relative flex flex-col border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-brand bg-brand/5 ring-1 ring-brand' : 'border-border hover:border-brand/50'}`}>
                                <input type="radio" value="stripe" {...register("paymentMethod")} className="absolute opacity-0 w-0 h-0" />
                                <span className="font-bold text-sm text-foreground">Credit Card</span>
                                <span className="text-xs text-muted-foreground mt-1">Pay securely via Stripe</span>
                            </label>
                            <label className={`relative flex flex-col border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand bg-brand/5 ring-1 ring-brand' : 'border-border hover:border-brand/50'}`}>
                                <input type="radio" value="cod" {...register("paymentMethod")} className="absolute opacity-0 w-0 h-0" />
                                <span className="font-bold text-sm text-foreground">Cash on Delivery</span>
                                <span className="text-xs text-muted-foreground mt-1">Pay when order arrives</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full bg-brand text-brand-foreground py-4 text-sm font-bold uppercase tracking-widest hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg rounded-xl flex items-center justify-center gap-3 active:scale-[0.99]"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Complete Purchase"}
                        </button>
                        <p className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mt-4">
                            <ShieldCheck size={14} className="text-green-500" /> Secure encrypted transaction
                        </p>
                    </div>
                </form>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <div className="bg-surface p-8 rounded-2xl border border-border sticky top-24 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6 pb-4 border-b border-border">
                    Order Summary
                </h3>
                <div className="space-y-6">
                    {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-4">
                        <div className="flex gap-4 items-start flex-1">
                            <div className="relative w-16 h-20 bg-background border border-border rounded-lg overflow-hidden flex-shrink-0">
                                <Image 
                                    src={item.image || "/placeholder.jpg"} 
                                    alt={item.name} 
                                    fill
                                    sizes="64px"
                                    className="object-cover" 
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-foreground leading-tight line-clamp-2">
                                    {item.name}
                                </p>
                                <p className="text-xs text-muted-foreground uppercase">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-foreground whitespace-nowrap">
                            ${(item.price * item.quantity).toFixed(2)}
                        </span>
                    </div>
                    ))}

                    <div className="border-t border-border pt-6 mt-6 space-y-3">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Shipping</span>
                            <span className="text-green-600 dark:text-green-400 font-medium">Complimentary</span>
                        </div>
                        <div className="border-t border-border pt-4 flex justify-between font-bold text-xl text-foreground">
                            <span>Total Due</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-accent/5 border border-border rounded-xl text-xs text-center leading-relaxed">
                    <p className="text-muted-foreground uppercase tracking-widest mb-1">Payment Method</p>
                    <p className="font-bold text-foreground">
                        {paymentMethod === 'stripe' ? 'Credit Card (Stripe)' : 'Cash on Delivery'}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                        {paymentMethod === 'stripe' 
                            ? 'You will be redirected to Stripe to securely complete your payment.' 
                            : 'Pay securely when your order arrives at your doorstep.'}
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
