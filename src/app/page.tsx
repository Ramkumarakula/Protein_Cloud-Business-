import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PlanSwitcher } from "@/components/hero/PlanSwitcher";
import { PlateBuilder } from "@/components/builder/PlateBuilder";
import { Sandwiches } from "@/components/sections/Sandwiches";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhyUs } from "@/components/sections/WhyUs";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Preloader } from "@/components/Preloader";
import { OrderPrompt } from "@/components/OrderPrompt";
import { PlanSwitcherProvider } from "@/hooks/usePlanSwitcher";
import { jsonLdString } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <script type="application/ld+json">{jsonLdString()}</script>
      <Preloader />
      <Navbar />
      <main>
        <PlanSwitcherProvider>
          <PlanSwitcher />
          <PlateBuilder />
        </PlanSwitcherProvider>
        <Sandwiches />
        <HowItWorks />
        <WhyUs />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <OrderPrompt />
    </>
  );
}
