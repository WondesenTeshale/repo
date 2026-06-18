"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, Archive, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { ContactMessage, apiFetchContactMessages, apiDeleteContactMessage, apiUpdateMessageStatus } from "@/lib/db";

interface Props {
  token: string;
}

export default function MessagesTab({ token }: Props) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "archived">("all");

  const loadMessages = async () => {
    setLoading(true);
    const msgs = await apiFetchContactMessages(token);
    setMessages(msgs);
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, [token]);

  const handleToggleRead = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent expanding/collapsing the card
    const newStatus = msg.status === "unread" ? "read" : "unread";
    const updated = await apiUpdateMessageStatus(msg.id, newStatus, token);
    if (updated) {
      setMessages(prev => prev.map(m => m.id === msg.id ? updated : m));
    }
  };

  const handleArchive = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = msg.status === "archived" ? "read" : "archived";
    const updated = await apiUpdateMessageStatus(msg.id, newStatus, token);
    if (updated) {
      setMessages(prev => prev.map(m => m.id === msg.id ? updated : m));
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this message?")) {
      const ok = await apiDeleteContactMessage(id, token);
      if (ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        if (expandedId === id) setExpandedId(null);
      }
    }
  };

  const toggleExpand = async (msg: ContactMessage) => {
    const isExpanding = expandedId !== msg.id;
    setExpandedId(isExpanding ? msg.id : null);
    
    // Auto mark as read when expanded if it is currently unread
    if (isExpanding && msg.status === "unread") {
      const updated = await apiUpdateMessageStatus(msg.id, "read", token);
      if (updated) {
        setMessages(prev => prev.map(m => m.id === msg.id ? updated : m));
      }
    }
  };

  const filtered = messages.filter(m => {
    if (filter === "all") return m.status !== "archived"; // by default don't show archived in "all"
    return m.status === filter;
  });

  const unreadCount = messages.filter(m => m.status === "unread").length;

  if (loading) {
    return <p className="text-sm text-[#556080]">Loading messages...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header / Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#e8eaf2]">Inbox Submissions</h2>
          <p className="text-xs text-[#8b92a9]">Manage contact requests and project proposals.</p>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center gap-1 bg-[#151922] p-1 rounded-lg border border-[#252d3d]">
          {(["all", "unread", "read", "archived"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded transition-colors ${
                filter === f 
                  ? "bg-[#1f2433] text-[#4f8ef7]" 
                  : "text-[#556080] hover:text-[#8b92a9]"
              }`}
            >
              {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#252d3d] rounded-xl">
          <Mail size={24} className="mx-auto text-[#252d3d] mb-3" />
          <p className="text-xs text-[#556080]">No messages found in this folder.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(msg => {
            const isExpanded = expandedId === msg.id;
            return (
              <div 
                key={msg.id}
                onClick={() => toggleExpand(msg)}
                className={`border rounded-xl transition-all cursor-pointer ${
                  isExpanded 
                    ? "bg-[#151922]/60 border-[#4f8ef7]/40" 
                    : msg.status === "unread"
                      ? "bg-[#151922]/30 border-[#4f8ef7]/20 hover:border-[#4f8ef7]/40"
                      : "bg-transparent border-[#252d3d] hover:border-[#3a4454]"
                }`}
              >
                {/* Header Summary */}
                <div className="p-4 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3 min-w-0">
                    {msg.status === "unread" ? (
                      <div className="w-2 h-2 rounded-full bg-[#4f8ef7] shrink-0" title="Unread" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#252d3d] shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-[#e8eaf2]">{msg.name}</span>
                        <span className="text-[10px] text-[#556080] font-mono break-all">&lt;{msg.email}&gt;</span>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${msg.status === "unread" ? "text-[#e8eaf2] font-medium" : "text-[#8b92a9]"}`}>
                        {msg.subject || "(No Subject)"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
                    <span className="text-[10px] text-[#556080] flex items-center gap-1">
                      <Clock size={11} /> {new Date(msg.createdAt).toLocaleDateString()}
                    </span>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        title={msg.status === "unread" ? "Mark as Read" : "Mark as Unread"}
                        onClick={(e) => handleToggleRead(msg, e)}
                        className={`p-1.5 rounded hover:bg-[#252d3d] transition-colors ${
                          msg.status === "unread" ? "text-[#4f8ef7]" : "text-[#556080] hover:text-[#e8eaf2]"
                        }`}
                      >
                        {msg.status === "unread" ? <Mail size={13} /> : <MailOpen size={13} />}
                      </button>
                      <button
                        title={msg.status === "archived" ? "Move to Inbox" : "Archive Message"}
                        onClick={(e) => handleArchive(msg, e)}
                        className={`p-1.5 rounded hover:bg-[#252d3d] text-[#556080] hover:text-[#e8eaf2] transition-colors ${
                          msg.status === "archived" ? "text-amber-500" : ""
                        }`}
                      >
                        <Archive size={13} />
                      </button>
                      <button
                        title="Delete Message"
                        onClick={(e) => handleDelete(msg.id, e)}
                        className="p-1.5 rounded hover:bg-[#252d3d] text-[#556080] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-5 border-t border-[#252d3d]/50 pt-4 cursor-default" onClick={e => e.stopPropagation()}>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#556080] block font-semibold">Sender Email</span>
                        <a 
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "Your message to BetterDose")}`}
                          className="text-[#4f8ef7] hover:underline inline-flex items-center gap-1 font-mono mt-0.5"
                        >
                          {msg.email} <ExternalLink size={11} />
                        </a>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#556080] block font-semibold">Submitted At</span>
                        <span className="text-[#8b92a9] block mt-0.5">{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#556080] block font-semibold mb-1">Message Content</span>
                      <div className="bg-[#0f1117] border border-[#252d3d]/70 rounded-lg p-4 text-xs text-[#e8eaf2] whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
