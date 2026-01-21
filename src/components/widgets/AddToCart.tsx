"use client";

import { useState } from "react";
import { useDispatch } from "react-redux"; // Redux hook
import { addItem } from "@/lib/store/features/cartSlice"; // Redux action

interface Props {
  productId: string;
  name: string;
  price: number;
  image: string;
}

export function AddToCart({ productId, name, price, image }: Props) {
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    dispatch(addItem({
      id: productId,
      name,
      price,
      quantity: 1,
      image,
    }));
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-4 uppercase tracking-[0.15em] text-xs font-bold transition-all duration-300 active:scale-[0.99] ${
        isAdded 
          ? "bg-green-700 text-white" 
          : "bg-black text-white hover:bg-gray-900"
      }`}
    >
      {isAdded ? "Added to Bag" : "Add to Shopping Bag"}
    </button>
  );
}