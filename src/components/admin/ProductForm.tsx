"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/widgets/ImageUploader";
import { Plus, X, Loader2, Save, Trash2 } from "lucide-react";
import { createProduct, updateProduct } from "@/actions/products";
import { useRouter } from "next/navigation";

// --- TYPE DEFINITIONS ---
interface Category {
  id: string;
  name: string;
}

// Updated structure: 'images' is an array of strings
interface ColorVariant {
    name: string;
    images: string[]; 
    hex: string;
}

interface ExtraDetail {
  key: string;
  value: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: any; 
  actionType: "create" | "update";
}

export function ProductForm({ categories, initialData, actionType }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE ---
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
  const [details, setDetails] = useState<ExtraDetail[]>(
    initialData?.extraDetails ? Object.entries(initialData.extraDetails).map(([key, value]) => ({ key, value: String(value) })) : []
  );

  // Colors State with Multiple Images Support
  const [colors, setColors] = useState<ColorVariant[]>(
    initialData?.colors?.map((c: any) => ({
        name: c.name,
        hex: c.hex || "#000000",
        // Handle legacy data (single image) vs new data (array)
        images: Array.isArray(c.images) ? c.images : (c.image ? [c.image] : [])
    })) || []
  );

  // --- HANDLERS ---

  // Size Handler
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSizes(e.target.value.split(",").map((s) => s.trim()));
  };

  // Details Handler
  const addDetail = () => setDetails([...details, { key: "", value: "" }]);
  const removeDetail = (index: number) => setDetails(details.filter((_, i) => i !== index));
  const updateDetail = (index: number, field: "key" | "value", text: string) => {
    const newDetails = [...details];
    newDetails[index][field] = text;
    setDetails(newDetails);
  };

  // --- NEW COLOR HANDLERS ---
  const addColor = () => setColors([...colors, { name: "", hex: "#000000", images: [] }]);
  
  const removeColor = (index: number) => setColors(colors.filter((_, i) => i !== index));
  
  const updateColorField = (index: number, field: "name" | "hex", value: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  // Add an image to a specific color variant
  const addImageToColor = (index: number, url: string) => {
    const newColors = [...colors];
    newColors[index].images.push(url);
    setColors(newColors);
  };

  // Remove an image from a specific color variant
  const removeImageFromColor = (colorIndex: number, imgIndex: number) => {
    const newColors = [...colors];
    newColors[colorIndex].images = newColors[colorIndex].images.filter((_, i) => i !== imgIndex);
    setColors(newColors);
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    formData.append("sizes", JSON.stringify(sizes));
    // Save the new colors structure (with image arrays)
    formData.append("colors", JSON.stringify(colors));
    
    const detailsObj = details.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
    formData.append("extraDetails", JSON.stringify(detailsObj));

    try {
      const result = actionType === "create" 
        ? await createProduct(formData)
        : await updateProduct(initialData.id, formData);

      if (result.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        alert(result.error || "Error saving product");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT SIDE: PRODUCT CONTENT */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Basic Information</h2>
            <input name="name" required defaultValue={initialData?.name} placeholder="Product Name" className="w-full text-4xl font-serif border-b border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent" />
            <textarea name="description" required defaultValue={initialData?.description} placeholder="Product Description" rows={4} className="w-full text-lg border-b border-gray-200 py-2 focus:outline-none focus:border-black resize-none bg-transparent" />
          </section>

          {/* --- NEW COLOR VARIANTS UI --- */}
          <section className="space-y-6 border-t pt-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Color Variants & Gallery</h2>
            <p className="text-xs text-gray-500">Add colors first, then upload multiple images for each color.</p>
            
            <div className="space-y-8">
              {colors.map((color, idx) => (
                <div key={idx} className="p-6 border border-gray-200 rounded-xl bg-gray-50/50 relative">
                  <button type="button" onClick={() => removeColor(idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                  
                  {/* Color Header */}
                  <div className="flex gap-6 mb-6">
                    <div className="w-1/3">
                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Color Name</label>
                        <input 
                            value={color.name} 
                            placeholder="e.g. Navy Blue" 
                            onChange={(e) => updateColorField(idx, "name", e.target.value)} 
                            className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" 
                        />
                    </div>
                    <div className="w-1/3">
                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Color Hex</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="color" 
                                value={color.hex} 
                                onChange={(e) => updateColorField(idx, "hex", e.target.value)} 
                                className="h-9 w-9 border-none cursor-pointer p-0 bg-transparent" 
                            />
                            <span className="text-xs font-mono text-gray-500 uppercase">{color.hex}</span>
                        </div>
                    </div>
                  </div>

                  {/* Variant Gallery */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Variant Images ({color.images.length})</label>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {/* Existing Images */}
                        {color.images.map((img, imgIdx) => (
                            <div key={imgIdx} className="relative aspect-[3/4] group rounded-md overflow-hidden bg-white border border-gray-200">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button 
                                    type="button" 
                                    onClick={() => removeImageFromColor(idx, imgIdx)}
                                    className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        
                        {/* Add Button */}
                        <div className="aspect-[3/4]">
                            <ImageUploader 
                                allowMultiple={true}
                                onUploadComplete={(url) => addImageToColor(idx, url)} 
                            />
                        </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={addColor} 
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-500 hover:border-black hover:text-black transition-all"
              >
                <Plus size={20} />
                <span className="text-sm font-bold uppercase tracking-widest">Add New Color Variant</span>
              </button>
            </div>
          </section>

          {/* MAIN CATALOG IMAGE (Generic) */}
          <section className="space-y-6 border-t pt-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Default Catalog Image</h2>
            <div className="max-w-md">
                <ImageUploader inputName="imageUrl" initialUrl={initialData?.images?.[0]} />
            </div>
          </section>
        </div>

        {/* RIGHT SIDE: ATTRIBUTES */}
        <div className="space-y-10 bg-gray-50 p-8 rounded-lg h-fit sticky top-24 border border-gray-100">
          {/* ... (Categories, Price, Inventory, Sizes, Specs sections remain the same) ... */}
          <section className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2">Category</label>
              <select name="categoryId" defaultValue={initialData?.categoryId || ""} className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none text-sm">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2">Price ($)</label>
                <input name="price" type="number" step="0.01" required defaultValue={initialData ? Number(initialData.price) : ""} className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none text-sm font-medium" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2">Stock</label>
                <input name="inventory" type="number" required defaultValue={initialData?.inventory || 10} className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none text-sm font-medium" />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2">Available Sizes</label>
              <input placeholder="S, M, L, XL" value={sizes.join(", ")} onChange={handleSizeChange} className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none text-sm" />
            </div>
            <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-4">Specifications</label>
                <div className="space-y-3">
                    {details.map((d, i) => (
                    <div key={i} className="flex gap-2 group">
                        <input value={d.key} placeholder="Key" onChange={(e) => { const newD = [...details]; newD[i].key = e.target.value; setDetails(newD); }} className="w-1/2 text-xs border-b border-gray-200 bg-transparent focus:outline-none" />
                        <input value={d.value} placeholder="Value" onChange={(e) => { const newD = [...details]; newD[i].value = e.target.value; setDetails(newD); }} className="w-1/2 text-xs border-b border-gray-200 bg-transparent focus:outline-none" />
                        <button type="button" onClick={() => removeDetail(i)} className="text-gray-300 hover:text-red-500"><X size={14}/></button>
                    </div>
                    ))}
                    <button type="button" onClick={addDetail} className="text-[10px] font-bold uppercase text-black hover:underline mt-2">+ Add Spec</button>
                </div>
            </div>
          </section>

          <button disabled={isLoading} type="submit" className="w-full bg-black text-white py-4 font-bold uppercase text-xs tracking-[0.2em] hover:bg-gray-900 flex justify-center items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={14} />}
            {actionType === "create" ? "Publish Product" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}