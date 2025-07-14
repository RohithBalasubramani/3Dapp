/* app/test/page.jsx  –  RSC (no "use client") */
import fs from "fs";
import path from "path";

/* ✨ simply import; no dynamic(), no ssr:false */
import ClientApp from "./ClientApp";

export default function TestPage() {
  /* collect every *.stl in /public/models */
  const modelsDir = path.join(process.cwd(), "public/models");
  const files = fs
    .readdirSync(modelsDir)
    .filter((f) => f.toLowerCase().endsWith(".stl"))
    .map((f) => `/models/${f}`);

  /* stream list down to the client component */
  return <ClientApp files={files} />;
}
