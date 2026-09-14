"use client";

import { useCallback, useState } from "react";
import { StageMount } from "@/components/three/StageMount";
import { Navbar } from "@/components/navigation/Navbar";
import { Loader } from "@/components/ui/Loader";
import { Footer } from "@/components/ui/Footer";
import { useOpeningSnap } from "@/lib/use-opening-snap";

import { Hero } from "@/components/sections/Hero";
import { Movement } from "@/components/sections/Movement";
import { Ingredients } from "@/components/sections/Ingredients";
import { Benefits } from "@/components/sections/Benefits";
import { CloseUp } from "@/components/sections/CloseUp";
import { ColdPressed } from "@/components/sections/ColdPressed";
import { Statement } from "@/components/sections/Statement";
import { Story } from "@/components/sections/Story";
import { Finale } from "@/components/sections/Finale";

export function Landing() {
  const [started, setStarted] = useState(false);
  const onDone = useCallback(() => setStarted(true), []);
  useOpeningSnap(started);

  return (
    <>
      <Loader onDone={onDone} />
      <StageMount />
      <Navbar />

      <main className="page-clip relative">
        <Hero started={started} />
        <Movement />
        <Ingredients />
        <Benefits />
        <CloseUp />
        <ColdPressed />
        <Statement />
        <Story />
        <Finale />
        <Footer />
      </main>
    </>
  );
}
