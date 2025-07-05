import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: session } = await supabase
    .from("sessions")
    .select("name")
    .eq("id", params.id)
    .single();

  const sessionName = session?.name ? session.name + " - Planning Poker" : "Planning Poker";
  const description = `Join the planning poker session "${session?.name}" to estimate tasks collaboratively.`;

  return {
    title: sessionName,
    description,
    openGraph: {
      title: sessionName,
      description,
    },
  };
}

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
