"use client";

import { useRef } from "react";
import type { ContactMessageStatus } from "@/lib/database.types";

const OPTIONS: ContactMessageStatus[] = ["new", "read", "replied"];

export default function MessageStatusSelect({
  action,
  defaultValue
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValue: ContactMessageStatus;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      <select
        name="status"
        defaultValue={defaultValue}
        onChange={() => formRef.current?.requestSubmit()}
        className="border border-chestnut/25 bg-white px-2 py-1 font-mono text-xs uppercase tracking-wide"
      >
        {OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </form>
  );
}
