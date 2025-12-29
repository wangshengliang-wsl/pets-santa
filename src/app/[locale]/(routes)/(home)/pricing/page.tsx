import { Suspense } from "react";
import PetsSantaApp from "../components/PetsSantaApp";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="animate-bounce text-4xl">🐾</div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PetsSantaApp initialPage="pricing" />
    </Suspense>
  );
}
