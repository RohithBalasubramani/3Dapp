"use client";

import Link from "next/link";
import React from "react";
import { Table, ChevronDown, LogIn, UserCircle2 } from "lucide-react"; // npm i lucide-react --legacy-peer-deps

export default function Topbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-950/80 backdrop-blur-lg shadow-lg z-50">
      {/* inner wrapper keeps everything aligned and max‑width constrained */}
      <div className="mx-auto max-w-screen-2xl h-[12vh] min-h-16 flex items-center px-6 lg:px-12 relative">
        {/* ── Left: App logo ─────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {/* Replace with your real SVG if you have one */}
          <span className="text-3xl">🧠</span>
        </Link>

        {/* ── Center: App name (absolutely centered) ────── */}
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold tracking-wide pointer-events-none">
          Neuraxis
        </h1>

        {/* ── Right: Utility icons ───────────────────────── */}
        <div className="ml-auto flex items-center gap-6">
          {/* BOQ page link */}
          <Link
            href="/BOQ"
            className="hover:text-gray-300 transition-colors"
            title="Bill of Quantities"
          >
            <Table className="h-6 w-6" />
          </Link>

          {/* Dummy dropdown button */}
          <button className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-800/60 hover:bg-gray-700/60 transition">
            Options
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Sign‑in icon button */}
          <button className="p-2 rounded-md bg-blue-600 hover:bg-blue-500 transition">
            <LogIn className="h-5 w-5" />
          </button>

          {/* Placeholder company / profile icon */}
          <UserCircle2 className="h-8 w-8 text-gray-300" />
        </div>
      </div>
    </nav>
  );
}
