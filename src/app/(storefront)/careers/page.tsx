import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Heart, Globe, Zap, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers at LuxeStore | Join Our Team",
  description: "Explore career opportunities at LuxeStore. Join a passionate team defining the future of sustainable luxury fashion. View open positions in Design, Tech, and Operations.",
  openGraph: {
    title: "Careers at LuxeStore",
    description: "Build the future of fashion with us. We are hiring.",
    type: "website",
  },
};

export default function CareersPage() {
  const benefits = [
    {
      title: "Health & Wellness",
      description: "Comprehensive medical, dental, and vision coverage for you and your family.",
      icon: <Heart size={24} />,
    },
    {
      title: "Global Impact",
      description: "Work on sustainability initiatives that actively reduce fashion's carbon footprint.",
      icon: <Globe size={24} />,
    },
    {
      title: "Creative Freedom",
      description: "A culture that champions innovation, allowing you to bring bold ideas to life.",
      icon: <Zap size={24} />,
    },
  ];

  const jobs = [
    {
      id: "fashion-designer",
      title: "Senior Fashion Designer",
      department: "Design",
      location: "Lahore, Pakistan (Hybrid)",
      type: "Full-time",
      description: "Lead the creative direction for our upcoming sustainable winter collection.",
      datePosted: "2024-02-10",
    },
    {
      id: "ecommerce-manager",
      title: "E-commerce Operations Manager",
      department: "Operations",
      location: "Remote / Dubai",
      type: "Full-time",
      description: "Oversee global fulfillment logistics and optimize our digital customer journey.",
      datePosted: "2024-02-12",
    },
    {
      id: "frontend-dev",
      title: "Frontend Developer",
      department: "Technology",
      location: "Remote",
      type: "Contract",
      description: "Build immersive shopping experiences using Next.js and React.",
      datePosted: "2024-02-08",
    },
  ];

  // Generate Schema Markup for Jobs
  const schemaData = jobs.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.datePosted,
    "validThrough": "2024-12-31",
    "employmentType": job.type.toUpperCase().replace("-", "_"),
    "hiringOrganization": {
      "@type": "Organization",
      "name": "LuxeStore",
      "sameAs": "https://luxestore.com",
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location.split(",")[0],
        "addressCountry": "PK", // Simplified for demo
      },
    },
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-surface border-b border-border">
        <div className="absolute inset-0 bg-brand/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest mb-6 border border-brand/20">
              <Briefcase size={12} /> We Are Hiring
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6 text-foreground">
              Shape the Future of <span className="text-brand">Luxury</span>
            </h1>
            <p className="text-lg md:text-xl text-accent max-w-2xl mx-auto leading-relaxed">
              We&apos;re looking for visionaries, craftsmen, and innovators to help us redefine sustainable fashion. 
              Find your place at LuxeStore.
            </p>
            <div className="mt-10">
              <Button size="lg" className="bg-brand text-brand-foreground hover:bg-brand/90 shadow-lg">
                View Open Positions
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. Benefits / Culture */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Why LuxeStore?</h2>
              <p className="text-accent max-w-2xl mx-auto">
                We believe in nurturing talent and prioritizing well-being. Here is what you can expect when you join our team.
              </p>
            </div>
          </FadeIn>

          <FadeInStagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, idx) => (
                <FadeIn key={idx}>
                  <div className="p-8 rounded-3xl bg-surface border border-border hover:border-brand/30 transition-all duration-300 hover:shadow-md group h-full">
                    <div className="w-12 h-12 bg-background border border-border text-brand rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                    <p className="text-accent leading-relaxed text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* 3. Job Listings */}
      <section className="py-20 bg-surface/50 border-y border-border" id="open-roles">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Open Roles</h2>
                <p className="text-accent">Join us in our mission to create timeless, sustainable fashion.</p>
              </div>
              <div className="text-sm font-bold text-brand uppercase tracking-widest border-b border-brand/20 pb-1">
                {jobs.length} Positions Available
              </div>
            </div>
          </FadeIn>

          <FadeInStagger>
            <div className="space-y-4">
              {jobs.map((job) => (
                <FadeIn key={job.id}>
                  <div className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-background border border-border rounded-2xl hover:border-brand transition-all hover:shadow-lg">
                    <div className="space-y-2 mb-4 md:mb-0">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-brand transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-accent">
                        <span className="flex items-center gap-1 bg-surface px-2 py-1 rounded border border-border">
                          <Briefcase size={12} /> {job.department}
                        </span>
                        <span className="flex items-center gap-1 bg-surface px-2 py-1 rounded border border-border">
                          <MapPin size={12} /> {job.location}
                        </span>
                        <span className="flex items-center gap-1 bg-surface px-2 py-1 rounded border border-border">
                          <Clock size={12} /> {job.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Link href={`/contact?subject=Application for ${job.title}`}>
                        <Button variant="outline" className="w-full md:w-auto group-hover:bg-brand group-hover:text-brand-foreground border-brand/20 transition-all">
                          Apply Now <ArrowRight size={14} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Don&apos;t see the right fit?
            </h2>
            <p className="text-accent mb-8">
              We are always looking for exceptional talent. Send us your portfolio and resume, 
              and we&apos;ll keep you in mind for future opportunities.
            </p>
            <Link href="/contact?subject=General Career Inquiry">
              <Button size="lg" variant="secondary" className="bg-surface border border-border hover:bg-border text-foreground">
                Email Recruiting Team
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </div>
  );
}