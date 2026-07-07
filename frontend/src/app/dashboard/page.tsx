"use client"

import dynamic from "next/dynamic"

const DashboardContent = dynamic(
  () => import("./dashboard-content").then((mod) => mod.DashboardContent),
  { ssr: false }
)

export default function Page() {
  return <DashboardContent />
}
