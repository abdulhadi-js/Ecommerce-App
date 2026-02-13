"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/widgets/ImageUploader";
import { Plus, X, Loader2, Save, Trash2, Palette, Image as ImageIcon, Tag, List } from "lucide-react";
import { createProduct, updateProduct } from "@/actions/products";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// --- TYPE DEFINITIONS ---
interface Category {
  id: string;
  name: string;
}

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

  const [colors, setColors] = useState<ColorVariant[]>(
    initialData?.colors?.map((c: any) => ({
        name: c.name,
        hex: c.hex || "#000000",
        images: Array.isArray(c.images) ? c.images : (c.image ? [c.image] : [])
    })) || []
  );

  // --- HANDLERS ---
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSizes(e.target.value.split(",").map((s) => s.trim()));
  };

  const addDetail = () => setDetails([...details, { key: "", value: "" }]);
  const removeDetail = (index: number) => setDetails(details.filter((_, i) => i !== index));
  const addColor = () => setColors([...colors, { name: "", hex: "#000000", images: [] }]);
  const removeColor = (index: number) => setColors(colors.filter((_, i) => i !== index));
  
  const updateColorField = (index: number, field: "name" | "hex", value: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  const addImageToColor = (index: number, url: string) => {
    const newColors = [...colors];
    newColors[index].images.push(url);
    setColors(newColors);
  };

  const removeImageFromColor = (colorIndex: number, imgIndex: number) => {
    const newColors = [...colors];
    newColors[colorIndex].images = newColors[colorIndex].images.filter((_, i) => i !== imgIndex);
    setColors(newColors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    formData.append("sizes", JSON.stringify(sizes));
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
    <form onSubmit={handleSubmit} className="pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        
        {/* LEFT SIDE: PRODUCT CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Info Card */}
          <div className="bg-surface border border-border p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border">
                <Tag size={18} className="text-brand" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Basic Information</h2>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-accent uppercase tracking-wider mb-1 block">Product Name</label>
                    <input 
                        name="name" 
                        required 
                        defaultValue={initialData?.name} 
                        placeholder="e.g. Classic Oxford Shirt" 
                        className="w-full text-xl sm:text-2xl font-serif bg-transparent border-b border-input py-2 text-foreground focus:outline-none focus:border-brand transition-colors placeholder:text-accent/50" 
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-accent uppercase tracking-wider mb-1 block">Description</label>
                    <textarea 
                        name="description" 
                        required 
                        defaultValue={initialData?.description} 
                        placeholder="Detailed description of the product..." 
                        rows={4} 
                        className="w-full text-base bg-transparent border-b border-input py-2 text-foreground focus:outline-none focus:border-brand resize-none transition-colors placeholder:text-accent/50" 
                    />
                </div>
            </div>
          </div>

          {/* Color Variants Card */}
          <div className="bg-surface border border-border p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <Palette size={18} className="text-brand" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Color Variants</h2>
                </div>
                <button 
                    type="button" 
                    onClick={addColor} 
                    className="text-xs font-bold text-brand hover:text-brand/80 flex items-center gap-1 uppercase tracking-wider"
                >
                    <Plus size={14} /> Add Variant
                </button>
            </div>
            
            <div className="space-y-6">
              {colors.map((color, idx) => (
                <div key={idx} className="p-6 border border-border rounded-xl bg-background/50 relative group transition-colors hover:border-brand/30">
                  <button type="button" onClick={() => removeColor(idx)} className="absolute top-4 right-4 text-icon-muted hover:text-red-500 transition-colors p-1"><Trash2 size={16}/></button>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-accent mb-1 block">Color Name</label>
                        <input 
                            value={color.name} 
                            placeholder="e.g. Navy Blue" 
                            onChange={(e) => updateColorField(idx, "name", e.target.value)} 
                            className="w-full bg-surface border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all" 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-accent mb-1 block">Hex Code</label>
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full border border-border overflow-hidden shrink-0">
                                <input 
                                    type="color" 
                                    value={color.hex} 
                                    onChange={(e) => updateColorField(idx, "hex", e.target.value)} 
                                    className="h-[150%] w-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer p-0 border-none bg-transparent" 
                                />
                            </div>
                            <span className="text-xs font-mono text-foreground uppercase bg-surface px-2 py-1 rounded border border-border">{color.hex}</span>
                        </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-accent mb-2 flex items-center gap-2">
                        <ImageIcon size={12} /> Variant Images
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {color.images.map((img, imgIdx) => (
                            <div key={imgIdx} className="relative aspect-[3/4] group/img rounded-lg overflow-hidden border border-border bg-surface">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button 
                                    type="button" 
                                    onClick={() => removeImageFromColor(idx, imgIdx)}
                                    className="absolute top-1 right-1 bg-foreground/50 hover:bg-red-500 p-1 rounded-full text-background opacity-0 group-hover/img:opacity-100 transition-all backdrop-blur-sm"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))}
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
              
              {colors.length === 0 && (
                  <div className="text-center py-8 text-accent bg-accent/5 rounded-xl border border-dashed border-border">
                      <p className="text-sm">No color variants added yet.</p>
                  </div>
              )}
            </div>
          </div>

          {/* Main Catalog Image */}
          <div className="bg-surface border border-border p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border">
                <ImageIcon size={18} className="text-brand" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Catalog Cover</h2>
            </div>
            <div className="max-w-xs">
                <ImageUploader inputName="imageUrl" initialUrl={initialData?.images?.[0]} />
                <p className="text-xs text-accent mt-2">This image will be displayed on the product listing page.</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: ATTRIBUTES - Sticky on Desktop */}
        <div className="space-y-6">
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6 lg:sticky lg:top-24">
                <div className="flex items-center gap-2 pb-4 border-b border-border">
                    <List size={18} className="text-brand" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Attributes</h2>
                </div>

                <div className="space-y-5">
                    {/* Category */}
                    <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-2">Category</label>
                        <div className="relative">
                            <select 
                                name="categoryId" 
                                defaultValue={initialData?.categoryId || ""} 
                                className="w-full bg-surface border border-input text-foreground rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent appearance-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-accent text-[10px]">▼</div>
                        </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-2">Price ($)</label>
                            <input 
                                name="price" 
                                type="number" 
                                step="0.01" 
                                required 
                                defaultValue={initialData ? Number(initialData.price) : ""} 
                                className="w-full bg-surface border border-input text-foreground rounded-lg py-2.5 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" 
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-2">Stock</label>
                            <input 
                                name="inventory" 
                                type="number" 
                                required 
                                defaultValue={initialData?.inventory || 10} 
                                className="w-full bg-surface border border-input text-foreground rounded-lg py-2.5 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" 
                            />
                        </div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-2">Sizes (CSV)</label>
                        <input 
                            placeholder="S, M, L, XL" 
                            value={sizes.join(", ")} 
                            onChange={handleSizeChange} 
                            className="w-full bg-surface border border-input text-foreground rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" 
                        />
                    </div>

                    {/* Extra Specs */}
                    <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-3">Specifications</label>
                        <div className="space-y-3">
                            {details.map((d, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input 
                                    value={d.key} 
                                    placeholder="Material" 
                                    onChange={(e) => { const newD = [...details]; newD[i].key = e.target.value; setDetails(newD); }} 
                                    className="w-1/2 text-xs bg-transparent border-b border-border py-1 text-foreground focus:border-brand focus:outline-none" 
                                />
                                <input 
                                    value={d.value} 
                                    placeholder="Cotton" 
                                    onChange={(e) => { const newD = [...details]; newD[i].value = e.target.value; setDetails(newD); }} 
                                    className="w-1/2 text-xs bg-transparent border-b border-border py-1 text-foreground focus:border-brand focus:outline-none" 
                                />
                                <button type="button" onClick={() => removeDetail(i)} className="text-icon-muted hover:text-red-500 transition-colors"><X size={14}/></button>
                            </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={addDetail} 
                                className="w-full py-2 border border-dashed border-border rounded-lg text-[10px] font-bold uppercase text-accent hover:text-brand hover:border-brand/50 transition-all mt-2"
                            >
                                + Add Spec
                            </button>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-border">
                        <button 
                            disabled={isLoading} 
                            type="submit" 
                            className="w-full bg-brand text-brand-foreground py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand/90 flex justify-center items-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
                            {actionType === "create" ? "Publish Product" : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </form>
  );
}