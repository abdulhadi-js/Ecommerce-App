"use client";

import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";
import { useEffect, useState } from "react";

interface OrderSlipProps {
  order: any;
}

export function OrderSlip({ order }: OrderSlipProps) {
  const trackingNumber = `LEO-${order.id.slice(-8).toUpperCase()}`;
  const [printDate, setPrintDate] = useState("");

  // Get the base URL from your environment variables
  // On localhost, this is http://localhost:3000
  // On Vercel, this will be your actual domain
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    setPrintDate(new Date().toLocaleDateString());
  }, []);
  
  const senderDetails = {
    name: "LuxeStore Pakistan",
    phone: "0300-1234567"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button 
        onClick={handlePrint}
        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-bold uppercase hover:bg-gray-800 transition-colors print:hidden"
      >
        <Printer size={16} /> Print COD Slip
      </button>

      <div className="hidden print:block print:w-[120mm] print:h-auto print:absolute print:top-0 print:left-0 bg-white text-black font-sans">
        <div className="border-2 border-black max-w-[600px] mx-auto">
          
          <div className="flex justify-between border-b-2 border-black p-2">
            <div className="flex flex-col items-center w-1/2 border-r border-black pr-2">
               <span className="text-xs font-bold mb-1">Sales Order</span>
               <Barcode value={order.id.slice(-8)} height={30} width={1.5} displayValue={false} margin={0} />
            </div>
            <div className="flex flex-col items-center w-1/2 pl-2">
               <span className="text-xs font-bold mb-1">Marketplace</span>
               <Barcode value="LUXE-STORE" height={30} width={1.5} displayValue={false} margin={0} />
            </div>
          </div>

          <div className="text-center border-b-2 border-black py-2">
            <h2 className="text-sm font-bold">Tracking Number {trackingNumber}</h2>
            <div className="flex justify-center mt-1">
               <Barcode value={trackingNumber} height={50} width={2} displayValue={false} margin={0} />
            </div>
          </div>

          <div className="flex border-b-2 border-black">
            <div className="w-1/2 border-r-2 border-black flex items-center justify-center p-4 bg-gray-100">
               <h1 className="text-2xl font-serif font-black tracking-tighter">Luxe Store</h1>
            </div>
            
            <div className="w-1/2 text-sm font-bold">
               <div className="border-b border-black p-1 text-center">STANDARD</div>
               <div className="border-b border-black p-1 text-center">HOME</div>
               <div className="border-b border-black p-1 text-center bg-gray-200">COD</div>
               <div className="p-1 text-center text-lg">PKR {Number(order.amountTotal).toFixed(0)}</div>
            </div>
          </div>

          <div className="border-b-2 border-black p-1 text-center text-xs font-bold">
            Order Number: {order.id}
          </div>

          <div className="flex justify-between text-[10px] border-b-2 border-black p-1">
             <span>Order Date: {new Date(order.createdAt).toLocaleDateString()}</span>
             <span>Print Date: {printDate}</span>
          </div>

          <div className="flex">
             <div className="w-1/2 border-r-2 border-black p-2">
                <h3 className="font-bold text-xs mb-1 underline">Recipient</h3>
                <p className="text-xs font-bold uppercase">{order.shippingName}</p>
                <p className="text-[10px] leading-tight mt-1 h-10 overflow-hidden">{order.shippingAddress}</p>
                <p className="text-xs font-bold mt-1">{order.shippingCity}</p>
                <p className="text-xs font-bold mt-1">{order.shippingPhone}</p>
             </div>

             <div className="w-1/2 p-2">
                <h3 className="font-bold text-xs mb-1 underline">Sender</h3>
                <p className="text-xs font-bold uppercase">{senderDetails.name}</p>
                <p className="text-xs font-bold mt-1">{senderDetails.phone}</p>
             </div>
          </div>

          {/* Footer QR Codes */}
          <div className="flex border-t-2 border-black p-2 items-center justify-around">
             {/* LEFT QR: Directs to the main Shop home page */}
             <QRCodeSVG value={baseUrl} size={80} />
             
             <div className="text-center">
                <span className="text-xl font-bold block">PK-LCS-LHE</span>
                <span className="text-[10px]">Route Code</span>
             </div>
          </div>

        </div>
      </div>
    </>
  );
}