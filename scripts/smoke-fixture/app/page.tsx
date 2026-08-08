import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/patterns/reveal";

export default function Home() {
  return (
    <main className="p-8">
      <p className="label-mono">SMOKE CONSUMER</p>
      <Reveal>
        <Button variant="primary">It landed</Button>
      </Reveal>
    </main>
  );
}
