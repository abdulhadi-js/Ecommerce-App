import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, User, MapPin, Phone } from "lucide-react";
import { OrderSlip } from "@/components/admin/OrderSlip";

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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="text-muted-foreground hover:text-black transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-serif font-bold">Order Details</h1>
                        <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                    </div>
                </div>
                
                {/* Pass serialized object to client component */}
                <OrderSlip order={serializedOrder} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <Package size={18} className="text-gray-500" /> 
                            Order Items
                        </h2>
                        <ul className="divide-y divide-gray-100">
                            {order.items.map(item => (
                                <li key={item.id} className="flex items-center gap-4 py-4">
                                    <div className="h-20 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img 
                                            src={Array.isArray(item.product.images) ? (item.product.images as string[])[0] : '/placeholder.jpg'} 
                                            alt={item.product.name} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.product.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-sm text-gray-900">
                                            ${(Number(item.price) * item.quantity).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            ${Number(item.price).toFixed(2)} each
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="text-2xl font-bold font-mono text-gray-900">
                                ${Number(order.amountTotal).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Details */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <User size={18} className="text-gray-500" /> 
                            Customer
                        </h2>
                        <div className="space-y-1">
                            <p className="font-medium text-gray-900">{order.user.name}</p>
                            <p className="text-sm text-gray-500">{order.user.email}</p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <MapPin size={18} className="text-gray-500" /> 
                            Shipping Address
                        </h2>
                        <address className="not-italic text-sm text-gray-600 space-y-2">
                            <p className="font-bold text-gray-900 uppercase">
                                {order.shippingName || "N/A"}
                            </p>
                            <p>{order.shippingAddress || "No address provided"}</p>
                            <p className="uppercase">{order.shippingCity || ""}</p>
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
                                <Phone size={14} className="text-gray-400" />
                                <span className="font-mono text-gray-900">
                                    {order.shippingPhone || "N/A"}
                                </span>
                            </div>
                        </address>
                    </div>

                    {/* Status */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Current Status</p>
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                             order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                             order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                             order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                             "bg-green-100 text-green-700"
                        }`}>
                            {order.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}