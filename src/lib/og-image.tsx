import type { CollectionEntry } from "astro:content";
import React from "react";
import satori from "satori";
import { ImageResponse } from "@vercel/og";
import { SITE } from "@/consts";

async function fetchFont(font: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${font}`;

  const css = await fetch(url).then((res) => res.text());

  const fontUrl = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  )?.[1];

  if (!fontUrl) {
    throw new Error("Font not found");
  }

  const res = await fetch(fontUrl);

  return await res.arrayBuffer();
}

export const fontWeights = {
  Regular: "400",
  Medium: "500",
  SemiBold: "600",
  Bold: "700",
};

export const RedHatDisplayFont = async (
  weight: keyof typeof fontWeights = "Medium",
) => fetchFont(`Red+Hat+Display:wght@${fontWeights[weight]}`);
export const PoppinsDynamicFont = async () => fetchFont("Poppins");
export const MPlus2Font = async (
  weight: keyof typeof fontWeights = "SemiBold",
) => fetchFont(`M+PLUS+2:wght@${fontWeights[weight]}`);
export const IBMPlexSansJPFont = async (
  weight: keyof typeof fontWeights = "Regular",
) => fetchFont(`IBM+Plex+Sans+JP:wght@${fontWeights[weight]}`);
export const ComfortaaFont = async (
  weight: keyof typeof fontWeights = "Medium",
) => fetchFont(`Comfortaa:wght@${fontWeights[weight]}`);

const generateOgpImage = async (children: React.ReactNode) => {
  const [redHatDisplay, ibmPlexSansJP, comfortaa] = await Promise.all([
    RedHatDisplayFont("SemiBold"),
    IBMPlexSansJPFont("Medium"),
    ComfortaaFont("Bold"),
  ]);

  return new ImageResponse(
    (
      <div
        lang={SITE.locale}
        style={{
          backgroundColor: "#13161b",
          //   backgroundColor: "#fff",
          //   backgroundColor: "#dfe6ef",
          fontFamily: '"Red Hat Display", "IBM Plex Sans JP", sans-serif',
        }}
        tw="relative text-primary w-full h-full flex m-auto p-16"
      >
        {children}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Red Hat Display",
          data: redHatDisplay,
          style: "normal",
          weight: 600,
        },
        {
          name: "IBM Plex Sans JP",
          data: ibmPlexSansJP,
          style: "normal",
          weight: 500,
        },
        {
          name: "Comfortaa",
          data: comfortaa,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
};

export const BlogOgImage = (post: CollectionEntry<"blog">) => {
  const { data } = post as CollectionEntry<"blog">;
  const { title, description, date, tags } = data;

  return generateOgpImage(
    <div
      tw="relative rounded-2xl shadow-sm border border-[#dfe6ef] px-10 pt-10 w-full flex flex-col text-[#080a0e]"
      style={{
        backgroundColor: "#fbffff",
        gap: "1rem",
      }}
    >
      <div tw="flex w-full text-6xl font-bold">{title}</div>
      <div tw="flex w-full grow text-4xl font-semibold text-[#080a0e]/80">
        {description}
      </div>
      <div
        tw="flex"
        style={{
          gap: "0.5rem",
        }}
      >
        {tags?.map((tag) => (
          <div
            key={tag}
            tw="text-3xl flex justify-center rounded-lg bg-[#f1f6fc] text-[#14171c] px-2 py-1 w-fit whitespace-nowrap shrink-0 "
          >
            {tag}
          </div>
        ))}
      </div>
      <div tw="h-0.5 rounded-full bg-[#dfe6ef]" />
      <div tw="flex justify-between items-baseline">
        <div tw="text-4xl text-[#080a0e]/75">
          {date.toLocaleDateString(SITE.locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div
          tw="flex items-baseline pt-2 pb-8 text-5xl font-bold tracking-tighter"
          style={{
            fontFamily: '"Comfortaa", sans-serif',
          }}
        >
          {SITE.title}
        </div>
      </div>
    </div>,
  );
};
