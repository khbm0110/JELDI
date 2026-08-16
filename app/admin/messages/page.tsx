import type { Metadata } from "next";
import AdminTopbar from "@/components/AdminTopbar";
import MessageStatusSelect from "@/components/MessageStatusSelect";
import { supabaseAdmin } from "@/lib/supabase-server";
import { updateMessageStatus } from "./actions";

// Every /admin/* page reads live data straight from Supabase
// (orders, products, messages...) behind a login wall — there is
// no correct cached/static version of any of these. Marking them
// force-dynamic also stops Next.js from trying to prerender them
// at BUILD time, which would run these queries against whatever
// Supabase credentials (or lack of them) the build environment has
// and fail the build the same way /sitemap.xml did before the
// lib/supabase.ts fallback fix — same root cause, different route.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Messages — Jeldi Admin",
  robots: { index: false, follow: false }
};

export default async function AdminMessagesPage() {
  const { data: messages, error } = await supabaseAdmin
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <>
      <AdminTopbar />
      <h1 className="mb-8 font-display text-2xl text-chestnut">Messages</h1>

      {!messages || messages.length === 0 ? (
        <p className="border border-chestnut/20 bg-white px-6 py-8 text-center text-[#4A3B2E]">
          No messages yet — this fills in automatically as people submit the
          contact form.
        </p>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="border border-chestnut/20 bg-white px-6 py-5">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg text-chestnut">{message.name}</div>
                  <a
                    href={`mailto:${message.email}`}
                    className="font-mono text-xs text-cognac hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.68rem] text-[#4A3B2E]">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                  <MessageStatusSelect
                    action={updateMessageStatus.bind(null, message.id)}
                    defaultValue={message.status}
                  />
                </div>
              </div>
              <p className="whitespace-pre-wrap text-[#4A3B2E]">{message.message}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
