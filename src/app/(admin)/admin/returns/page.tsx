import { getReturnRequests } from "@/actions/admin-returns";
import { ReturnRequestList } from "@/components/admin/ReturnRequestList";
import { RotateCcw } from "lucide-react";

export default async function AdminReturnsPage() {
  const requests = await getReturnRequests();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand/10 text-brand rounded-xl">
            <RotateCcw size={24} />
        </div>
        <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Return Requests</h1>
            <p className="text-sm text-accent">Manage and process customer returns.</p>
        </div>
      </div>

      <ReturnRequestList initialRequests={requests as any} />
    </div>
  );
}