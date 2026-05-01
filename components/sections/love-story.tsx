"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StorySection } from '@/components/StorySection';
import { Cinzel } from "next/font/google";
import { siteConfig } from '@/content/site';

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

// Palette lives in globals.css → @theme inline → --color-motif-*
// Edit there once to update every component.

export function LoveStory() {
  return (
    <div className="relative min-h-screen bg-motif-cream overflow-x-hidden">
      {/* Corner flower decorations */}
      {/* <div className="pointer-events-none absolute left-0 top-0 z-[1]">
        <Image
          src="/decoration/left-top-corner.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[min(36vw,136px)] sm:max-w-[156px] md:max-w-[170px] opacity-90 select-none"
          priority
        />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-[1]">
        <Image
          src="/decoration/right-top-corner.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[min(36vw,136px)] sm:max-w-[156px] md:max-w-[170px] opacity-90 select-none"
          priority
        />
      </div>
      <div className="pointer-events-none absolute left-0 bottom-0 z-[1]">
        <Image
          src="/decoration/left-bottom-corner.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[min(36vw,136px)] sm:max-w-[156px] md:max-w-[170px] opacity-90 select-none"
          priority
        />
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 z-[1]">
        <Image
          src="/decoration/right-bottom-corner.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[min(36vw,136px)] sm:max-w-[156px] md:max-w-[170px] opacity-90 select-none"
          priority
        />
      </div> */}

      <div className="relative z-[2]">
      <div className="text-center text-motif-medium z-0 relative px-4">
        <div className="w-12 sm:w-16 h-[1px] bg-motif-silver mx-auto mb-4 sm:mb-6 opacity-60"></div>
        <h1 className={`${cinzel.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl uppercase tracking-[0.14em] sm:tracking-[0.18em] font-normal leading-tight text-motif-deep mt-8`}>
        Love Story
        </h1>
        {/* <p className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl tracking-[0.14em] sm:tracking-[0.18em] font-normal leading-tight text-motif-medium mb-1`}>
        From Paper to Forever
        </p> */}
      </div>

      {/* SECTION 1: Top - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isFirst={true}
        title="The Beginning"
        imageSrc="/LoveStory/The Beginning.jpg"
        text={
          <>
            <p className="mb-4">
            Our story began in the simplest, most unexpected way—
on April 26, 2019, at exactly 1:05 AM.
Paul, a little drunk in his apartment in Makati,
and Michelle, just arriving home from work in Dubai—
two different worlds, awake at the same time.
<br />

In that quiet moment, a simple “hello” was sent—
not knowing it would change everything.
            </p>
           
          </>
        }
      />

      {/* SECTION 2: Middle - Light */}
      <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/LoveStory/Late Night Conversations.jpg"
        title="Late Night Conversations"
        text={
          <>
            <p>
            What started as a casual conversation quickly became something more.
Messages turned into long talks,
late nights became a routine,
and distance slowly felt smaller with every shared story, laugh, and “ingat ka.”
            </p>
          </>
        }
      />

      {/* SECTION 3: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/LoveStory/The First Meeting.jpg"
        title="The First Meeting"
        text={
          <>
            <p>
            Then, in July or August of 2019,
Michelle came home from Dubai to Pangasinan—
and for the first time, our worlds finally met.
<br />
In August, we saw each other face to face.
What we built through messages felt even more real in person—
easy, genuine, and meant to be.
           </p>
           
          </>
        }
      />
            {/* SECTION 4: Middle - Light */}
            <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/LoveStory/Shared Moments.jpg"
        title="Shared Moments"
        text={
          <>
            <p>
            We discovered how much we both loved food—
from simple meals to spontaneous food trips,
sharing not just plates, but laughter and moments that made everything feel like home.
            </p>
          </>
        }
      />

      {/* SECTION 5: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/LoveStory/Perfect Timing.jpg"
        title="Perfect Timing"
        text={
          <>
            <p>
            And just like any good plan—especially with Paul being good in site acquisition—
everything fell perfectly into place.
<br />
On September 30, 2019,
we officially became girlfriend and boyfriend.
            </p>
           
          </>      
        }
      />
                  {/* SECTION 6: Middle - Light */}
                  <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/LoveStory/Copy of FC647A60-FA82-4963-8E5F-DE9F80558CAB_1_105_c.jpeg"
        title="Growing Together"
        text={
          <>
            <p>
            What we had wasn’t rushed.
It grew naturally, patiently, and sincerely—
built on friendship, trust, and choosing each other every single day.
            </p>
          </>
        }
      />

      {/* SECTION 7: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/LoveStory/A Love That Feels Like Home.png"
        title="A Love That Feels Like Home"
        text={
          <>
            <p>
            Through the years, we’ve shared countless conversations,
celebrated milestones, faced challenges,
and continued to grow not just as individuals, but together.
<br />
And now, as we stand here,
we celebrate not just how our story began,
but how far we’ve come…
<br />
From a simple message at 1:05 AM,
to a love that feels like home—
and a lifetime we are choosing to build together.
            </p>
           
          </>      
        }
      />

                 
      {/* Footer Decoration */}
      <div className="bg-motif-cream pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24 text-center text-motif-deep z-0 relative px-4">
        <div className="w-12 sm:w-16 h-[1px] bg-motif-silver mx-auto mb-4 sm:mb-6 opacity-60"></div>
        <Link 
          href="#guest-list"
          className={`${cinzel.className} group relative inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 text-[0.7rem] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase font-normal text-motif-cream bg-motif-deep rounded-sm border border-motif-deep transition-all duration-300 hover:bg-motif-accent hover:border-motif-accent hover:text-motif-cream hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-motif-soft/50 focus-visible:ring-offset-2 focus-visible:ring-offset-motif-cream`}
        >
          <span className="relative z-10">Join us</span>
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 rounded-sm bg-motif-soft opacity-0 group-hover:opacity-25 blur-md transition-opacity duration-300 -z-0"></div>
        </Link>
      </div>

      </div>
    </div>
  );
}