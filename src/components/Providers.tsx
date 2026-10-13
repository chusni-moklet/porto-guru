"use client";

import React from "react";
import { PortoGuruProvider } from "@/context/PortoGuruContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <PortoGuruProvider>{children}</PortoGuruProvider>;
}
