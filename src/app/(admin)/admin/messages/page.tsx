import { prisma } from "@/lib/db";
import { Mail, MailOpen, Trash2, Calendar, User } from "lucide-react";
import { toggleMessageRead, deleteMessage } from "@/actions/contact";

// Manual Type for Safety
type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export default async function AdminInboxPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Inbox</h1>
        <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Customer Inquiries</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-400 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-tighter">Status</th>
              <th className="px-6 py-4 font-bold uppercase tracking-tighter">Sender</th>
              <th className="px-6 py-4 font-bold uppercase tracking-tighter">Subject</th>
              <th className="px-6 py-4 font-bold uppercase tracking-tighter text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic">
                  Your inbox is currently empty.
                </td>
              </tr>
            ) : (
              (messages as Message[]).map((msg) => (
                <tr key={msg.id} className={`transition-colors ${msg.isRead ? 'bg-white opacity-60' : 'bg-white font-semibold'}`}>
                  <td className="px-6 py-4">
                    {msg.isRead ? (
                      <MailOpen size={18} className="text-gray-300" />
                    ) : (
                      <Mail size={18} className="text-primary animate-pulse" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{msg.name}</div>
                    <div className="text-[10px] text-gray-400 lowercase">{msg.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 truncate max-w-[300px]">{msg.subject}</div>
                    <div className="text-[10px] text-gray-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      {/* Toggle Read Action */}
                      <form action={async () => {
                        "use server";
                        await toggleMessageRead(msg.id, msg.isRead);
                      }}>
                        <button className="text-[10px] uppercase font-bold tracking-widest hover:underline">
                          {msg.isRead ? "Mark Unread" : "Mark Read"}
                        </button>
                      </form>

                      {/* Delete Action */}
                      <form action={async () => {
                        "use server";
                        await deleteMessage(msg.id);
                      }}>
                        <button className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}