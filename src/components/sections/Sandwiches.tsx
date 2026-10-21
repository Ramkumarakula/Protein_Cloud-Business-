"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { sandwiches, type Sandwich } from "@/data/sandwiches";
import { siteConfig } from "@/config/site";
import { FoodImage } from "@/components/ui/FoodImage";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatPrice } from "@/lib/format";
import { requestOrder } from "@/lib/orderPrompt";
import { SPRING } from "@/lib/motion";

function SandwichCard({ sandwich }: { sandwich: Sandwich }) {
  const reduce = useReducedMotion();
  // Tap on touch screens plays the hover pose briefly.
  const [tapped, setTapped] = useState(false);
  const lifted = { y: -6 };
  const imageLifted = { rotate: 3, scale: 1.05 };

  return (
    <motion.article
      className="bg-card shadow-card relative flex h-full flex-col rounded-3xl px-6 pt-0 pb-6"
      initial="rest"
      animate={tapped && !reduce ? "hover" : "rest"}
      whileHover={reduce ? undefined : "hover"}
      variants={{ rest: { y: 0 }, hover: lifted }}
      transition={SPRING}
      onTouchStart={() => {
        setTapped(true);
        setTimeout(() => setTapped(false), 450);
      }}
      data-testid={`sandwich-${sandwich.key}`}
    >
      <motion.div
        className="relative mx-auto -mt-16 w-[78%] max-w-[300px]"
        variants={{ rest: { rotate: 0, scale: 1 }, hover: imageLifted }}
        transition={SPRING}
      >
        <FoodImage
          src={sandwich.image}
          alt={`${sandwich.name} ${sandwich.hero} sandwich`}
          label={sandwich.hero}
          accent={sandwich.accent}
          sizes="(min-width: 1024px) 300px, 78vw"
          className="drop-shadow-[0_24px_24px_rgba(0,0,0,0.16)]"
        />
      </motion.div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <h3 className="font-display text-3xl font-extrabold tracking-tight uppercase">
          {sandwich.name}
        </h3>
        <Chip accent={sandwich.accent} className="text-sm">
          {sandwich.hero}
        </Chip>
      </div>
      <p className="text-muted mt-3 text-sm leading-relaxed">{sandwich.description}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Highlights">
        {sandwich.tags.map((tag) => (
          <li key={tag}>
            <Chip>{tag}</Chip>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <p className="font-display text-2xl font-extrabold">{formatPrice(sandwich.price)}</p>
        <Button
          onClick={requestOrder}
          className="py-2.5"
          aria-label={`Add ${sandwich.name} ${sandwich.hero} sandwich to order`}
          data-testid={`sandwich-add-${sandwich.key}`}
        >
          <Plus aria-hidden className="size-4" />
          Add to order
        </Button>
      </div>
    </motion.article>
  );
}

export function Sandwiches() {
  return (
    <section
      id="sandwiches"
      aria-labelledby="sandwiches-heading"
      className="relative isolate overflow-hidden px-4 py-20 sm:px-8 lg:py-28"
    >
      {/* Looping kitchen video behind this section only, dimmed so the cards stay the focus. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#2a2118]">
        <BackgroundVideo
          webm="/video/sandwich-loop.webm"
          mp4="/video/sandwich-loop.mp4"
          poster="/video/sandwich-loop-poster.jpg"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,15,10,0.72)_0%,rgba(20,15,10,0.45)_40%,rgba(20,15,10,0.6)_75%,rgba(20,15,10,0.85)_100%)]" />
      </div>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="sandwiches-heading"
            light="FRESH"
            heavy="SANDWICHES"
            eyebrow="Grilled to order, packed with your plan or on their own"
            tone="light"
          />
        </Reveal>
        <div className="mt-24 grid gap-x-6 gap-y-24 md:grid-cols-3 md:gap-y-6">
          {sandwiches.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.08} className="h-full">
              <SandwichCard sandwich={s} />
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-center text-sm font-medium text-white/85">
          {siteConfig.sandwichesFootnote}
        </p>
      </div>
    </section>
  );
}
