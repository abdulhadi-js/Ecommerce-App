import { prisma } from "@/lib/db";
import { Mail, MailOpen, Trash2, Calendar, User, Search, Inbox } from "lucide-react";
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
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">Inbox</h1>
          <p className="text-xs font-bold text-accent uppercase tracking-widest mt-2 flex items-center gap-2">
            <Inbox size={14} />
            Customer Inquiries ({messages.length})
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
        
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-4 text-center animate-in fade-in duration-500">
            <div className="bg-accent/10 p-6 rounded-full mb-6">
              <MailOpen size={48} className="text-brand opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">All caught up!</h3>
            <p className="text-accent max-w-xs mx-auto">
              Your inbox is empty. New messages from customers will appear here.
            </p>
          </div>
        ) : (
          <div className="w-full">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-accent/5 text-accent border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] w-16">Status</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Sender</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Subject & Message</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Date</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(messages as Message[]).map((msg) => (
                    <tr 
                      key={msg.id} 
                      className={`group transition-colors hover:bg-accent/5 ${msg.isRead ? 'bg-surface' : 'bg-brand/5'}`}
                    >
                      <td className="px-6 py-5 align-top">
                        <div className="pt-1">
                          {msg.isRead ? (
                            <MailOpen size={18} className="text-icon-muted" aria-label="Read Message" />
                          ) : (
                            <Mail size={18} className="text-brand fill-brand/10 animate-pulse" aria-label="Unread Message" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <div className="font-bold text-foreground mb-0.5">{msg.name}</div>
                        <a href={`mailto:${msg.email}`} className="text-xs text-accent hover:text-brand hover:underline transition-colors block">
                          {msg.email}
                        </a>
                      </td>
                      <td className="px-6 py-5 align-top max-w-md">
                        <div className={`text-sm mb-1 ${msg.isRead ? 'font-medium text-foreground' : 'font-bold text-brand'}`}>
                          {msg.subject}
                        </div>
                        <p className="text-xs text-accent line-clamp-2 leading-relaxed">
                          {msg.message}
                        </p>
                      </td>
                      <td className="px-6 py-5 align-top whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs text-accent font-medium">
                          <Calendar size={12} />
                          {new Date(msg.createdAt).toLocaleDateString(undefined, {
                             month: 'short', day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top text-right">
                        <div className="flex justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          {/* Toggle Read Action */}
                          <form action={async () => {
                            "use server";
                            await toggleMessageRead(msg.id, msg.isRead);
                          }}>
                            <button 
                              className="text-[10px] uppercase font-bold tracking-widest text-accent hover:text-brand transition-colors py-1 px-2 rounded hover:bg-background"
                              aria-label={msg.isRead ? "Mark as Unread" : "Mark as Read"}
                            >
                              {msg.isRead ? "Unread" : "Read"}
                            </button>
                          </form>

                          {/* Delete Action */}
                          <form action={async () => {
                            "use server";
                            await deleteMessage(msg.id);
                          }}>
                            <button 
                              className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                              aria-label="Delete Message"
                            >
                              <Trash2 size={16} />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-border">
              {(messages as Message[]).map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-5 space-y-4 ${msg.isRead ? 'bg-surface' : 'bg-brand/5'}`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {msg.isRead ? (
                            <MailOpen size={18} className="text-icon-muted" />
                          ) : (
                            <Mail size={18} className="text-brand fill-brand/10" />
                        )}
                      </div>
                      <div>
                        <h3 className={`text-sm ${msg.isRead ? 'font-bold text-foreground' : 'font-black text-brand'}`}>
                          {msg.subject}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-foreground">{msg.name}</span>
                          <span className="text-[10px] text-accent">• {new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-accent leading-relaxed pl-8 border-l-2 border-border ml-1.5">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-between pt-2 pl-8">
                     <a href={`mailto:${msg.email}`} className="text-xs font-bold text-brand hover:underline">
                        Reply via Email
                     </a>

                     <div className="flex items-center gap-3">
                        <form action={async () => {
                          "use server";
                          await toggleMessageRead(msg.id, msg.isRead);
                        }}>
                          <button className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-foreground">
                            {msg.isRead ? "Mark Unread" : "Mark Read"}
                          </button>
                        </form>
                        
                        <form action={async () => {
                          "use server";
                          await deleteMessage(msg.id);
                        }}>
                          <button className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 size={16} />
                          </button>
                        </form>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}