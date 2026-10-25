import { createFileRoute } from "@tanstack/react-router";
import { PsychoPassApp } from "@/components/psycho/terminal";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <PsychoPassApp />;
}
