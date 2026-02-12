"use client";

import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";
import { useEffect, useState } from "react";

interface OrderSlipProps {
  order: any;
}

export function OrderSlip({ order }: OrderSlipProps) {
  const [printDate, setPrintDate] = useState("");
  // Mock tracking number for demo
  const trackingNumber = `PK-LEX${order.id.slice(-8).toUpperCase()}`;
  
  useEffect(() => {
    // Format: "05 Jun 2024"
    setPrintDate(new Date().toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric"
    }));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  });

  return (
    <>
      <button 
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border hover:bg-accent/5 text-xs font-bold uppercase tracking-widest text-foreground transition-all shadow-sm active:scale-95 print:hidden"
      >
        <Printer size={16} />
        <span>Print Label</span>
      </button>

      {/* PRINT CONTAINER (Hidden on screen, visible on print) */}
      <div className="hidden print:block print:w-[100mm] print:mx-auto bg-white text-black font-sans leading-tight">
        <div className="border-2 border-black">
            
            {/* 1. Top Header */}
            <div className="flex border-b-2 border-black text-xs font-bold uppercase">
                <div className="w-1/2 border-r-2 border-black p-1 text-center">Sales_order</div>
                <div className="w-1/2 p-1 text-center">Marketplace</div>
            </div>

            {/* 2. Main Barcode */}
            <div className="p-2 flex flex-col items-center justify-center border-b-2 border-black">
                <Barcode value={order.id.slice(-12)} height={50} width={2} displayValue={false} margin={0} />
                <p className="text-sm font-bold mt-1">Tracking Number {trackingNumber}</p>
            </div>

            {/* 3. Main Grid: Logo & Delivery Details */}
            <div className="flex border-b-2 border-black h-36">
                {/* Left: Branding & Route Code */}
                <div className="w-2/3 border-r-2 border-black flex flex-col items-center justify-center p-2">
                    <h1 className="text-3xl font-serif font-black tracking-tighter mb-4">LuxeStore</h1>
                    <p className="text-xl font-bold font-mono">D-006-02601</p>
                </div>

                {/* Right: Specs */}
                <div className="w-1/3 flex flex-col text-xs font-bold text-center">
                    <div className="border-b-2 border-black p-1">STANDARD</div>
                    <div className="border-b-2 border-black p-1">0.5 KG</div>
                    <div className="border-b-2 border-black p-1">HOME</div>
                    <div className="border-b-2 border-black p-1 bg-black text-white">COD</div>
                    <div className="flex-1 flex items-center justify-center p-1 text-sm">
                        PKR {Number(order.amountTotal).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* 4. Order Number Strip */}
            <div className="border-b-2 border-black p-1 text-center text-sm font-bold">
                Order Number: {order.id}
            </div>

            {/* 5. Dates Strip */}
            <div className="flex border-b-2 border-black text-[10px] font-medium">
                <div className="w-1/2 border-r-2 border-black p-1 text-center">
                    Order Creation Date {orderDate}
                </div>
                <div className="w-1/2 p-1 text-center">
                    AWB Print Date {printDate}
                </div>
            </div>

            {/* 6. Address Section */}
            <div className="flex h-40">
                {/* Left: QR */}
                <div className="w-1/3 border-r-2 border-black flex flex-col items-center justify-center p-2">
                    <QRCodeSVG value={trackingNumber} size={80} />
                    <p className="text-[10px] font-bold mt-2">PK-LEX</p>
                </div>

                {/* Right: Addresses */}
                <div className="w-2/3 p-2 text-xs">
                    <div className="mb-3">
                        <span className="font-bold mr-1">Recipient</span>
                        <span className="font-bold">{order.shippingName}</span>
                        <div className="mt-1 leading-snug">
                            {order.shippingAddress}, {order.shippingCity}
                        </div>
                        <div className="mt-1 font-bold">Phone {order.shippingPhone}</div>
                    </div>
                    
                    <div className="border-t border-black pt-2">
                        <span className="font-bold mr-1">Sender</span>
                        <span>LuxeStore Operations</span>
                        <div className="mt-1 leading-snug">
                            Warehouse 4, Industrial Estate, Karachi
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t-2 border-black p-4">
                <div className="flex justify-between items-center text-xl font-black">
                    <span>AMOUNT TO COLLECT</span>
                    <span>PKR {Number(order.amountTotal).toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-center mt-6 uppercase tracking-widest text-gray-500">
                    Thank you for shopping with LuxeStore
                </p>
            </div>

        </div>
      </div>
    </>
  );
}