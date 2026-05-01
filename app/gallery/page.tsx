import fs from "fs/promises"
import path from "path"
import MasonryGallery from "@/components/masonry-gallery"
import { siteConfig } from "@/content/site"
import Image from "next/image"
import { Cinzel, Cormorant_Garamond } from "next/font/google"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

/** Tint corner florals toward the motif accent (see `--color-motif-accent` in globals.css). */
const MOTIF_FLORAL_FILTER =
  "brightness(0) saturate(100%) invert(48%) sepia(12%) saturate(900%) hue-rotate(235deg) brightness(96%) contrast(88%)"

function parsePhotoIndex(fileName: string): number {
  const m = fileName.match(/\((\d+)\)/)
  return m ? parseInt(m[1], 10) : 0
}

// Generate on each request so newly added images in public/ appear without a rebuild
export const dynamic = "force-dynamic"

async function getImagesFromFolder(folder: string): Promise<string[]> {
  const abs = path.join(process.cwd(), "public", folder)
  try {
    const entries = await fs.readdir(abs, { withFileTypes: true })
    return entries
      .filter((e) => e.isFile())
      .map((e) => `/${folder}/${e.name}`)
      .filter((p) => p.match(/\.(jpe?g|png|webp|gif)$/i))
  } catch {
    return []
  }
}

/** Pairs desktop- and mobile-background assets by `couple (n)` index; only those two folders. */
async function getGalleryImageSources() {
  const desktop = await getImagesFromFolder("desktop-background")
  const mobile = await getImagesFromFolder("mobile-background")
  const byIndex = new Map<number, { desktop?: string; mobile?: string }>()

  for (const p of desktop) {
    const i = parsePhotoIndex(path.basename(p))
    const cur = byIndex.get(i) ?? {}
    cur.desktop = p
    byIndex.set(i, cur)
  }
  for (const p of mobile) {
    const i = parsePhotoIndex(path.basename(p))
    const cur = byIndex.get(i) ?? {}
    cur.mobile = p
    byIndex.set(i, cur)
  }

  return [...byIndex.entries()]
    .filter(([, v]) => v.desktop != null || v.mobile != null)
    .sort((a, b) => a[0] - b[0])
    .map(([index, v]) => {
      const desktop = v.desktop
      const mobile = v.mobile
      const src = desktop ?? mobile!
      const srcMobile = desktop != null && mobile != null ? mobile : undefined
      return {
        loadId: `gallery-${index}`,
        src,
        srcMobile,
        category: "gallery" as const,
        width: 1200,
        height: 900,
        orientation: "landscape" as const,
      }
    })
}

export default async function GalleryPage() {
  const images = await getGalleryImageSources()

  return (
    <main className="min-h-screen relative overflow-hidden bg-motif-cream">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(165deg, var(--color-motif-cream) 0%, color-mix(in srgb, var(--color-motif-silver) 14%, transparent) 35%, color-mix(in srgb, var(--color-motif-medium) 6%, transparent) 70%, color-mix(in srgb, var(--color-motif-deep) 3%, transparent) 100%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 12%, color-mix(in srgb, var(--color-motif-soft) 35%, transparent) 0%, transparent 55%)",
        }}
      />

      {/* Flower decoration - top left corner */}
      <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-[0.14] scale-y-[-1]"
          priority={false}
          style={{ filter: MOTIF_FLORAL_FILTER }}
        />
      </div>

      {/* Flower decoration - top right corner */}
      <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-[0.14] scale-x-[-1] scale-y-[-1]"
          priority={false}
          style={{ filter: MOTIF_FLORAL_FILTER }}
        />
      </div>

      {/* Flower decoration - left bottom corner */}
      <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-[0.14]"
          priority={false}
          style={{ filter: MOTIF_FLORAL_FILTER }}
        />
      </div>

      {/* Flower decoration - right bottom corner */}
      <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-[0.14] scale-x-[-1]"
          priority={false}
          style={{ filter: MOTIF_FLORAL_FILTER }}
        />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 px-3 sm:px-4">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-motif-silver/55 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-motif-accent opacity-90" />
            <div className="w-1.5 h-1.5 rounded-full bg-motif-deep/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-motif-accent opacity-90" />
            <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-motif-silver/55 to-transparent" />
          </div>

          <h1
            className={`${cinzel.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-2 sm:mb-3 md:mb-4 text-motif-deep`}
          >
            Our Love Story Gallery
          </h1>
          <p
            className={`${cormorant.className} text-xs sm:text-sm md:text-base lg:text-lg font-light max-w-xl mx-auto leading-relaxed px-2 text-motif-medium`}
          >
            Every photograph tells a story of {siteConfig.couple.groomNickname} & {siteConfig.couple.brideNickname}'s journey to
            forever
          </p>

          <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-motif-accent opacity-90" />
            <div className="w-1.5 h-1.5 rounded-full bg-motif-deep/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-motif-accent opacity-90" />
          </div>
        </div>

        {images.length === 0 ? (
          <div className={`${cormorant.className} text-center text-motif-medium`}>
            <p className="font-light">
              No images found. Add files to{" "}
              <code className="px-2 py-1 rounded border border-motif-deep/35 bg-motif-cream/80 text-motif-deep">
                public/desktop-background
              </code>{" "}
              and{" "}
              <code className="px-2 py-1 rounded border border-motif-deep/35 bg-motif-cream/80 text-motif-deep">
                public/mobile-background
              </code>
              .
            </p>
          </div>
        ) : (
          <MasonryGallery images={images} />
        )}
      </section>
    </main>
  )
}
