"use client";

import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowRight, RotateCcw, PackageCheck, CreditCard, Search, HelpCircle, Loader2, CheckCircle2 } from "lucide-react";
import { getOrderDetails, createReturnRequest } from "@/actions/returns";
import Image from "next/image";

export default function ReturnsPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lookup State
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  
  // Selection State
  const [order, setOrder] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [returnQuantity, setReturnQuantity] = useState<number>(1);
  const [reason, setReason] = useState("");
  
  // Success State
  const [successMessage, setSuccessMessage] = useState("");

  // Reset quantity when item changes
  const handleItemSelect = (item: any) => {
      setSelectedItem(item);
      setReturnQuantity(item.quantity); // Default to max, but allow change
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await getOrderDetails(orderId, email);
    
    if (result.success) {
      setOrder(result.order);
      setStep(2);
    } else {
      setError(result.error || "Order not found");
    }
    setLoading(false);
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("orderId", order.id);
    formData.append("productId", selectedItem.productId);
    formData.append("quantity", returnQuantity.toString());
    formData.append("reason", reason);

    const result = await createReturnRequest(formData);

    if (result.success) {
      setSuccessMessage(result.message || "Return initiated");
      setStep(3);
    } else {
      setError(result.error as string);
    }
    setLoading(false);
  };

  const steps = [
    {
      icon: <Search size={24} />,
      title: "1. Initiate Return",
      desc: "Enter your order number and email below to start the process.",
    },
    {
      icon: <PackageCheck size={24} />,
      title: "2. Pack Items",
      desc: "Place items in original packaging with tags attached.",
    },
    {
      icon: <RotateCcw size={24} />,
      title: "3. Ship It",
      desc: "Use the prepaid label we provide and drop off at any carrier location.",
    },
    {
      icon: <CreditCard size={24} />,
      title: "4. Get Refunded",
      desc: "Once received, we'll process your refund within 5-7 business days.",
    },
  ];

  const faqs = [
    {
      q: "What is your return window?",
      a: "We accept returns within 30 days of delivery for a full refund.",
    },
    {
      q: "Do I have to pay for return shipping?",
      a: "No, returns are free for all domestic orders. A prepaid label is provided.",
    },
    {
      q: "Can I exchange an item?",
      a: "Yes, you can choose to exchange for a different size or color during the return process.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Hero Section */}
      <section className="relative py-20 bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest mb-6 border border-brand/20">
              <RotateCcw size={12} /> Hassle-Free Returns
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 tracking-tight">
              Returns & Exchanges
            </h1>
            <p className="text-lg md:text-xl text-accent max-w-2xl mx-auto leading-relaxed">
              We want you to love what you ordered. If something isn't right, let's fix it.
              Our return process is simple, free, and fast.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Interface */}
        <FadeIn>
          <div className="bg-surface border border-border p-8 rounded-3xl shadow-sm mb-20 max-w-3xl mx-auto">
            
            {step === 1 && (
              <>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6 text-center">Find Your Order</h2>
                <form onSubmit={handleLookup} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="orderId" className="text-xs font-bold uppercase tracking-widest text-accent">Order Number</label>
                      <input
                        id="orderId"
                        type="text"
                        required
                        placeholder="e.g. clz..."
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-accent">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="Used at checkout"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium animate-in fade-in">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    size="lg" 
                    isLoading={loading}
                    className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                  >
                    Find Order
                  </Button>
                </form>
              </>
            )}

            {step === 2 && order && (
              <>
                <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                    <h2 className="text-xl font-serif font-bold text-foreground">Select Item to Return</h2>
                    <button onClick={() => setStep(1)} className="text-xs text-accent hover:text-brand underline">Change Order</button>
                </div>
                
                <form onSubmit={handleSubmitReturn} className="space-y-8">
                    <div className="space-y-4">
                        {order.items.map((item: any) => (
                            <div 
                                key={item.productId} 
                                onClick={() => handleItemSelect(item)}
                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                                    selectedItem?.productId === item.productId 
                                    ? "border-brand bg-brand/5 ring-1 ring-brand" 
                                    : "border-border bg-background hover:border-brand/50"
                                }`}
                            >
                                <div className="h-16 w-16 bg-white rounded-lg overflow-hidden relative border border-border">
                                    <Image 
                                        src={item.image || "/placeholder.jpg"} 
                                        alt={item.name} 
                                        fill 
                                        className="object-cover" 
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-foreground text-sm">{item.name}</h4>
                                    <p className="text-xs text-accent">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                    selectedItem?.productId === item.productId ? "border-brand bg-brand text-white" : "border-input"
                                }`}>
                                    {selectedItem?.productId === item.productId && <CheckCircle2 size={12} />}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quantity Selection */}
                    {selectedItem && (
                        <div className="p-4 bg-brand/5 rounded-xl border border-brand/10 space-y-3">
                            <p className="text-xs font-bold text-brand uppercase tracking-widest">Return Details</p>
                            
                            <div className="flex items-center gap-4">
                                <div className="w-1/2">
                                    <label className="text-[10px] uppercase font-bold text-accent block mb-1">Item</label>
                                    <p className="text-sm font-medium text-foreground truncate">{selectedItem.name}</p>
                                </div>
                                <div className="w-1/2">
                                    <label className="text-[10px] uppercase font-bold text-accent block mb-1">Quantity to Return</label>
                                    <select 
                                        value={returnQuantity}
                                        onChange={(e) => setReturnQuantity(Number(e.target.value))}
                                        className="w-full bg-background border border-input rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-brand"
                                    >
                                        {Array.from({ length: selectedItem.quantity }, (_, i) => i + 1).map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="reason" className="text-xs font-bold uppercase tracking-widest text-accent">Reason for Return</label>
                        <textarea
                            id="reason"
                            required
                            rows={3}
                            placeholder="Please describe why you are returning this item (min 10 characters)..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium animate-in fade-in">
                        {error}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        size="lg" 
                        isLoading={loading}
                        disabled={!selectedItem || reason.length < 10}
                        className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                    >
                        Submit Return Request
                    </Button>
                </form>
              </>
            )}

            {step === 3 && (
                <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Request Submitted!</h2>
                    <p className="text-accent max-w-md mx-auto mb-8">
                        {successMessage}
                        <br/>
                        Check your email for the shipping label and further instructions.
                    </p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Return Another Item
                    </Button>
                </div>
            )}

          </div>
        </FadeIn>

        {/* Process Steps */}
        <div className="mb-20">
          <FadeIn>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-10 text-center">How It Works</h2>
          </FadeIn>
          <FadeInStagger>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step, idx) => (
                <FadeIn key={idx}>
                  <div className="text-center group">
                    <div className="w-16 h-16 mx-auto bg-surface border border-border text-brand rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand/5 transition-colors shadow-sm">
                      {step.icon}
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-accent leading-relaxed px-2">{step.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </div>

        {/* Policy Details & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeIn>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Return Policy</h2>
            <div className="prose prose-sm text-accent leading-relaxed">
              <p className="mb-4">
                Items must be returned within <strong>30 days</strong> of receiving your order. 
                Items must be unworn, unwashed, and in their original condition with all tags attached.
              </p>
              <p className="mb-4">
                <strong>Non-returnable items:</strong> Gift cards, underwear, swimwear, and final sale items cannot be returned or exchanged.
              </p>
              <p>
                Refunds are processed to the original payment method. Please allow up to 10 business days for your bank to post the refund to your account.
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-border pb-6 last:border-0 last:pb-0">
                  <h3 className="font-bold text-foreground mb-2 flex items-start gap-2">
                    <HelpCircle size={16} className="text-brand mt-0.5 flex-shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-sm text-accent pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

      </div>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Returns & Exchanges",
            "description": "LuxeStore Return Policy: 30-day free returns. Instructions on how to return or exchange items.",
            "mainEntity": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": "US",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 30,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn",
            }
          }),
        }}
      />
    </div>
  );
}