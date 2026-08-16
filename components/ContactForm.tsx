"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const { error } = await supabase
      .from("contact_messages")
      .insert([{ name, email, message }]);

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-cognac/30 bg-cognac/5 px-6 py-8 text-center">
        <p className="mb-2 font-display text-xl text-chestnut">Message sent.</p>
        <p className="text-[#4A3B2E]">
          Thanks for reaching out — we read every message and reply from{" "}
          <span className="font-mono text-sm">hello@jeldi.com</span> as soon
          as we can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full border border-chestnut/25 bg-transparent px-4 py-3 text-[#1C1712] outline-none transition-colors focus:border-cognac"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-chestnut/25 bg-transparent px-4 py-3 text-[#1C1712] outline-none transition-colors focus:border-cognac"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full border border-chestnut/25 bg-transparent px-4 py-3 text-[#1C1712] outline-none transition-colors focus:border-cognac"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-oxblood">
          Something went wrong sending that — mind trying again, or emailing{" "}
          <a href="mailto:hello@jeldi.com" className="underline">
            hello@jeldi.com
          </a>{" "}
          directly?
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-block border border-chestnut bg-chestnut px-8 py-3.5 text-sm uppercase tracking-[0.06em] text-ivory transition-colors hover:bg-transparent hover:text-chestnut disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
