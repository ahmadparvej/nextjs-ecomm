import Header from "@/components/custom/header";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "AC Expert",
  description: "Ac Technician",
};

export default function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
