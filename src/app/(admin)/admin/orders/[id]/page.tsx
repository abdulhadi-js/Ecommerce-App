import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, User, MapPin, Phone, Calendar, CreditCard } from "lucide-react";
import { OrderSlip } from "@/components/admin/OrderSlip";
import { UpdateOrderStatus } from "@/components/admin/UpdateOrderStatus";
import Image from "next/image";

// --- 1. MANUAL TYPE DEFINITION ---
// This tells TypeScript exactly what fields to expect, ignoring the stale Prisma Client.
type OrderWithDetails = {
    id: string;
    createdAt: Date;
    status: string;
    amountTotal: any; // Using 'any' to handle the Decimal type safely
    shippingName: string | null;
    shippingAddress: string | null;
    shippingCity: string | null;
    shippingPhone: string | null;
    user: {
        name: string | null;
        email: string;
    };
    items: {
        id: string;
        quantity: number;
        price: any;
        product: {
            name: string;
            images: any;
            slug: string;
        };
    }[];
};

export default async function OrderDetailsPage(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    
    // Fetch from DB
    const rawOrder = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
            user: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!rawOrder) {
        return notFound();
    }

    // --- 2. FORCE TYPE CASTING ---
    // We force TypeScript to treat 'rawOrder' as our manual 'OrderWithDetails' type.
    const order = rawOrder as unknown as OrderWithDetails;

    // --- 3. SERIALIZATION ---
    // Convert Decimals to Numbers for the Client Component (OrderSlip)
    const serializedOrder = {
        ...order,
        amountTotal: Number(order.amountTotal),
        items: order.items.map((item) => ({
            ...item,
            price: Number(item.price),
            product: {
                ...item.product,
                price: 0, // We don't strictly need product price here for the slip
                images: Array.isArray(item.product.images) ? item.product.images : [],
            },
        })),
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <Link 
                        href="/admin/orders" 
                        className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-accent hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-serif font-bold text-foreground">Order #{order.id.slice(-8)}</h1>
                        <span className="bg-surface border border-border px-2 py-1 rounded text-xs font-mono text-accent">{order.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-accent">
                        <Calendar size={14} />
                        <span>{new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <UpdateOrderStatus 
                        orderId={order.id} 
                        currentStatus={order.status as any} 
                    />
                    <OrderSlip order={serializedOrder} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-border flex items-center gap-2 bg-accent/5">
                            <Package size={18} className="text-brand" /> 
                            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Order Items ({order.items.length})</h2>
                        </div>
                        <div className="divide-y divide-border">
                            {order.items.map(item => (
                                <div key={item.id} className="p-6 flex items-start gap-4 sm:gap-6 group hover:bg-accent/5 transition-colors">
                                    <div className="h-20 w-20 bg-background rounded-xl overflow-hidden flex-shrink-0 border border-border relative">
                                        <Image 
                                            src={Array.isArray(item.product.images) ? (item.product.images as string[])[0] : '/placeholder.jpg'} 
                                            alt={item.product.name} 
                                            fill
                                            className="object-cover" 
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/admin/products/`} className="font-bold text-foreground hover:text-brand transition-colors text-lg truncate block">
                                            {item.product.name}
                                        </Link>
                                        <p className="text-xs font-mono text-accent uppercase mt-1">{item.product.slug}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-foreground text-lg">
                                            ${(Number(item.price) * item.quantity).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-accent mt-1">
                                            {item.quantity} x ${Number(item.price).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-accent/5 border-t border-border p-6 flex justify-between items-center">
                            <span className="text-sm font-bold uppercase tracking-widest text-accent">Total Amount</span>
                            <span className="text-3xl font-bold font-serif text-foreground">
                                ${Number(order.amountTotal).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Customer & Shipping Details */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-surface border border-border rounded-2xl shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                            <User size={18} className="text-brand" /> 
                            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Customer</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold">
                                {order.user.name?.charAt(0) || "U"}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-foreground truncate">{order.user.name}</p>
                                <p className="text-sm text-accent truncate">{order.user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-surface border border-border rounded-2xl shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                            <MapPin size={18} className="text-brand" /> 
                            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Delivery Details</h2>
                        </div>
                        <div className="space-y-3">
                            <p className="font-bold text-foreground text-lg">{order.shippingName}</p>
                            <p className="text-sm text-accent leading-relaxed">
                                {order.shippingAddress}
                                <br />
                                <span className="uppercase font-bold text-foreground mt-1 block">{order.shippingCity}</span>
                            </p>
                            
                            <div className="flex items-center gap-2 pt-3 border-t border-border mt-3 text-sm">
                                <Phone size={14} className="text-brand" />
                                <span className="font-mono text-foreground">{order.shippingPhone || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-surface border border-border rounded-2xl shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                            <CreditCard size={18} className="text-brand" /> 
                            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Payment</h2>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-accent">Method</span>
                            <span className="font-bold text-foreground">Cash on Delivery</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-accent">Status</span>
                            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${
                                order.status === "PAID" ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900" : 
                                "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900"
                            }`}>
                                {order.status === "PAID" ? "Paid" : "Unpaid"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}