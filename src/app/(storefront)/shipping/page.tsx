import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Metadata } from "next";
import { Truck, Clock, Globe, AlertCircle, MapPin, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy | LuxeStore Worldwide Delivery",
  description: "Learn about LuxeStore's global shipping rates, delivery times, and zones. We offer fast, carbon-neutral shipping to over 50 countries.",
  openGraph: {
    title: "Shipping Policy | LuxeStore",
    description: "Fast, reliable, and sustainable delivery options for your luxury fashion needs.",
    type: "website",
  },
};

export default function ShippingPage() {
  const shippingZones = [
    {
      region: "North America (USA & Canada)",
      time: "2-4 Business Days",
      cost: "Free over $200",
      standard: "$15.00",
    },
    {
      region: "Europe (UK, EU)",
      time: "3-5 Business Days",
      cost: "Free over €200",
      standard: "€15.00",
    },
    {
      region: "Asia Pacific (Australia, Japan)",
      time: "4-7 Business Days",
      cost: "Free over $250 AUD",
      standard: "$25.00 AUD",
    },
    {
      region: "Middle East (UAE, Saudi Arabia)",
      time: "3-5 Business Days",
      cost: "Free over 750 AED",
      standard: "50 AED",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Hero Section */}
      <section className="relative py-20 bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest mb-6 border border-brand/20">
              <Truck size={12} /> Global Logistics
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 tracking-tight">
              Shipping & Delivery
            </h1>
            <p className="text-lg md:text-xl text-accent max-w-2xl mx-auto leading-relaxed">
              We are committed to getting your order to you as quickly and sustainably as possible. 
              Explore our shipping zones and estimated delivery times below.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Key Features Grid */}
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <div className="w-10 h-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-4">
                <Globe size={20} />
              </div>
              <h3 className="font-bold text-foreground mb-2">Global Reach</h3>
              <p className="text-sm text-accent">We ship to over 50 countries worldwide using premium courier partners like DHL and FedEx.</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <div className="w-10 h-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-4">
                <Package size={20} />
              </div>
              <h3 className="font-bold text-foreground mb-2">Carbon Neutral</h3>
              <p className="text-sm text-accent">Every shipment is offset to minimize our environmental impact, at no extra cost to you.</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <div className="w-10 h-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-4">
                <AlertCircle size={20} />
              </div>
              <h3 className="font-bold text-foreground mb-2">Customs & Duties</h3>
              <p className="text-sm text-accent">For most regions, duties are calculated at checkout so there are no surprises upon delivery.</p>
            </div>
          </div>
        </FadeIn>

        {/* Shipping Zones Table */}
        <FadeIn>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-8">Shipping Rates & Times</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-xs">Region</th>
                  <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-xs">Estimated Time</th>
                  <th className="px-6 py-4 font-bold text-foreground uppercase tracking-widest text-xs">Standard Rate</th>
                  <th className="px-6 py-4 font-bold text-brand uppercase tracking-widest text-xs">Free Shipping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shippingZones.map((zone, idx) => (
                  <tr key={idx} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-2">
                      <MapPin size={14} className="text-accent" /> {zone.region}
                    </td>
                    <td className="px-6 py-4 text-accent">
                      <span className="flex items-center gap-2">
                        <Clock size={14} /> {zone.time}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground font-medium">{zone.standard}</td>
                    <td className="px-6 py-4 text-brand font-bold">{zone.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-accent mt-4">
            * Delivery times are estimates and start from the date of dispatch. During peak seasons, please allow extra time.
          </p>
        </FadeIn>

        {/* FAQ / Policy Details */}
        <FadeInStagger className="mt-20 space-y-12">
          <FadeIn>
            <div className="border-l-2 border-brand pl-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Order Processing</h3>
              <p className="text-accent leading-relaxed">
                Orders are processed Monday through Friday, excluding holidays. Please allow 1-2 business days for your order to be packed and ready for shipment. 
                You will receive a confirmation email with tracking information once your package has left our facility.
              </p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="border-l-2 border-brand pl-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Tracking Your Order</h3>
              <p className="text-accent leading-relaxed">
                Once your order has shipped, you will receive an email with a tracking number. You can track the status of your shipment 
                via the carrier&apos;s website or through your LuxeStore account dashboard.
              </p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="border-l-2 border-brand pl-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Lost or Damaged Items</h3>
              <p className="text-accent leading-relaxed">
                In the unlikely event that your order is lost or damaged during transit, please contact our support team immediately at 
                <span className="font-medium text-foreground"> support@luxestore.com</span>. We will work with the carrier to resolve the issue as quickly as possible.
              </p>
            </div>
          </FadeIn>
        </FadeInStagger>

      </div>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DeliveryChargeSpecification",
            "name": "LuxeStore Global Shipping",
            "appliesToDeliveryMethod": "http://purl.org/goodrelations/v1#FedEx",
            "areaServed": "World",
            "priceCurrency": "USD",
            "price": "15.00",
            "eligibleTransactionVolume": {
              "@type": "PriceSpecification",
              "priceCurrency": "USD",
              "price": "200.00",
            },
          }),
        }}
      />
    </div>
  );
}