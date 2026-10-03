"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AmbientLight } from "./home-navigation";

export function SiteSurface({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // The authored technical essay keeps its own layout and visual treatment.
  if (pathname === "/projects/sany-welding-robotics/technical") return children;

  return <div className="site-surface"><AmbientLight />{children}</div>;
}
