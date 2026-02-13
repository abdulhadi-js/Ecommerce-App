import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Metadata } from "next";
import { HelpCircle, User, CreditCard, ShoppingBag, ChevronDown } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/storefront/Accordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | LuxeStore",
  description: "Find answers to common questions about your account, billing, shipping, and more.",
  openGraph: {
    title: "FAQ | LuxeStore",
    description: "Your questions, answered.",
    type: "website",
  },
};

export default function FAQPage() {
  const categories = [
    {
      id: "general",
      title: "General & Shipping",
      icon: <ShoppingBag size={20} />,
      items: [
        {
          q: "Do you ship internationally?",
          a: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location. Please visit our Shipping Policy page for detailed zones and rates.",
        },
        {
          q: "How can I track my order?",
          a: "Once your order ships, you will receive a confirmation email with a tracking link. You can also view the status of your order in your Account dashboard.",
        },
        {
          q: "What is your return policy?",
          a: "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and with original tags attached. Visit our Returns page to initiate a request.",
        },
      ],
    },
    {
      id: "account",
      title: "Account & Profile",
      icon: <User size={20} />,
      items: [
        {
          q: "Do I need an account to place an order?",
          a: "No, you can check out as a guest. However, creating an account allows you to track orders, save shipping addresses, and access exclusive offers.",
        },
        {
          q: "How do I reset my password?",
          a: "Go to the Login page and click 'Forgot Password'. Enter your email address, and we will send you a secure link to reset your password.",
        },
        {
          q: "Can I change my email address?",
          a: "Currently, for security reasons, you cannot change your registered email address directly. Please contact our support team for assistance.",
        },
      ],
    },
    {
      id: "billing",
      title: "Billing & Payment",
      icon: <CreditCard size={20} />,
      items: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and Apple Pay. We also offer Cash on Delivery in select regions.",
        },
        {
          q: "When will I be charged?",
          a: "For credit card purchases, your card is charged immediately upon order confirmation. For Cash on Delivery, you pay when the package arrives.",
        },
        {
          q: "Is my payment information secure?",
          a: "Yes, we use industry-standard SSL encryption to protect your data. We do not store your full credit card number on our servers.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      
      {/* Hero Section */}
      <section className="relative py-20 bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest mb-6 border border-brand/20">
              <HelpCircle size={12} /> Help Center
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl text-accent max-w-2xl mx-auto leading-relaxed">
              Have a question? We&apos;re here to help. Browse our topics below to find what you&apos;re looking for.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <FadeInStagger>
          {categories.map((category) => (
            <FadeIn key={category.id}>
              <div className="mb-12 last:mb-0">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
                  <div className="p-2 bg-brand/5 text-brand rounded-lg">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">
                    {category.title}
                  </h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`}>
                      <AccordionTrigger>{item.q}</AccordionTrigger>
                      <AccordionContent>{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </FadeIn>
          ))}
        </FadeInStagger>
      </div>

    </div>
  );
}