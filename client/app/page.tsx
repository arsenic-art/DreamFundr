"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Home() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/health").then(res => {
      setMsg(res.data.message);
    });
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">DreamFundr</h1>
      <p className="mt-4 text-green-600">{msg}</p>
    </main>
  );
}
