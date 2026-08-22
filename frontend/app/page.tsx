import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ProblemSection />
    </div>
  );
}