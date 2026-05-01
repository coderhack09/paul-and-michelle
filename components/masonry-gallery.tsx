"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"

type ImageItem = {
  /** Stable id for skeleton/load state when multiple sources exist */
  loadId: string
  src: string
  /** Art-directed mobile crop; shown below md when present */
  srcMobile?: string
  category: "desktop" | "mobile" | "front" | "gallery"
  width: number
  height: number
  orientation: "portrait" | "landscape"
}

export default function MasonryGallery({ images }: { images: ImageItem[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})
  const topRef = useRef<HTMLDivElement | null>(null)
  

  // Keep images in sequence (no shuffling)
  const filtered = useMemo(() => {
    return images
  }, [images])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIdx == null) return
      if (e.key === "Escape") setLightboxIdx(null)
      if (e.key === "ArrowRight") setLightboxIdx((idx) => (idx == null ? null : (idx + 1) % filtered.length))
      if (e.key === "ArrowLeft") setLightboxIdx((idx) => (idx == null ? null : (idx - 1 + filtered.length) % filtered.length))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [filtered.length, lightboxIdx])

  const getCardAspect = (image: ImageItem, variant: "desktop" | "mobile") => {
    if (image.srcMobile && variant === "desktop") return "aspect-[4/3]"
    return "aspect-[4/5]"
  }

  return (
    <div ref={topRef} className="relative">
      {/* Header (buttons removed per request) */}
      <div className="mb-6 flex justify-end">
        <div className="text-motif-medium/90 text-sm font-sans">
          {filtered.length} photos
        </div>
      </div>

      {/* Masonry grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-motif-medium/80 font-sans">No images to display.</div>
      ) : (
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
          {filtered.map((img, idx) => (
          <button
            key={img.loadId}
            type="button"
            className="group mb-3 sm:mb-4 block break-inside-avoid w-full text-left"
            onClick={() => setLightboxIdx(idx)}
            aria-label="Open image"
          >
            <div className="relative w-full overflow-hidden rounded-xl border border-motif-deep/25 bg-motif-cream/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:border-motif-accent/45">
              {!loaded[img.loadId] && (
                <div
                  className={`${img.srcMobile ? "hidden md:block" : ""} ${getCardAspect(img, img.srcMobile ? "desktop" : "mobile")} w-full animate-pulse bg-gradient-to-br from-motif-soft/50 via-motif-cream to-motif-accent/20`}
                />
              )}
              {!loaded[img.loadId] && img.srcMobile && (
                <div
                  className={`md:hidden ${getCardAspect(img, "mobile")} w-full animate-pulse bg-gradient-to-br from-motif-soft/50 via-motif-cream to-motif-accent/20`}
                />
              )}
              {img.srcMobile ? (
                <>
                  <div className={`relative w-full md:hidden ${getCardAspect(img, "mobile")}`}>
                    <CloudinaryImage
                      src={img.srcMobile}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={`rounded-xl transition-transform duration-300 group-hover:scale-[1.02] object-cover object-top ${
                        loaded[img.loadId] ? "opacity-100" : "opacity-0"
                      }`}
                      quality={90}
                      loading="lazy"
                      onLoad={() => setLoaded((l) => ({ ...l, [img.loadId]: true }))}
                      onError={() => setLoaded((l) => ({ ...l, [img.loadId]: true }))}
                    />
                  </div>
                  <div className={`relative w-full hidden md:block ${getCardAspect(img, "desktop")}`}>
                    <CloudinaryImage
                      src={img.src}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 33vw, 25vw"
                      className={`rounded-xl transition-transform duration-300 group-hover:scale-[1.02] object-cover object-top ${
                        loaded[img.loadId] ? "opacity-100" : "opacity-0"
                      }`}
                      quality={90}
                      loading="lazy"
                      onLoad={() => setLoaded((l) => ({ ...l, [img.loadId]: true }))}
                      onError={() => setLoaded((l) => ({ ...l, [img.loadId]: true }))}
                    />
                  </div>
                </>
              ) : (
                <div className={`relative w-full ${getCardAspect(img, "mobile")}`}>
                  <CloudinaryImage
                    src={img.src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={`rounded-xl transition-transform duration-300 group-hover:scale-[1.02] object-cover object-top ${
                      loaded[img.loadId] ? "opacity-100" : "opacity-0"
                    }`}
                    quality={90}
                    loading="lazy"
                    onLoad={() => setLoaded((l) => ({ ...l, [img.loadId]: true }))}
                    onError={() => setLoaded((l) => ({ ...l, [img.loadId]: true }))}
                  />
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-motif-deep/35 via-transparent to-transparent z-10" />
            </div>
          </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx != null && filtered[lightboxIdx] && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <div className="relative max-w-6xl w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-motif-cream bg-motif-deep/85 hover:bg-motif-deep border border-motif-cream/25 rounded-full px-4 py-2.5 transition-all duration-200 shadow-lg hover:scale-110"
              onClick={() => setLightboxIdx((i) => (i == null ? null : (i - 1 + filtered.length) % filtered.length))}
            >
              ‹
            </button>
            <div className="relative max-h-[80vh] w-auto flex items-center justify-center">
              {filtered[lightboxIdx].srcMobile ? (
                <>
                  <CloudinaryImage
                    src={filtered[lightboxIdx].srcMobile!}
                    alt=""
                    width={filtered[lightboxIdx].width}
                    height={filtered[lightboxIdx].height}
                    className="md:hidden max-h-[80vh] w-auto rounded-xl shadow-2xl border border-motif-silver/40 object-contain"
                    quality={95}
                    priority={true}
                    style={{
                      imageRendering: "high-quality",
                      WebkitImageRendering: "high-quality",
                    }}
                  />
                  <CloudinaryImage
                    src={filtered[lightboxIdx].src}
                    alt=""
                    width={filtered[lightboxIdx].width}
                    height={filtered[lightboxIdx].height}
                    className="hidden md:block max-h-[80vh] w-auto rounded-xl shadow-2xl border border-motif-silver/40 object-contain"
                    quality={95}
                    priority={true}
                    style={{
                      imageRendering: "high-quality",
                      WebkitImageRendering: "high-quality",
                    }}
                  />
                </>
              ) : (
                <CloudinaryImage
                  src={filtered[lightboxIdx].src}
                  alt=""
                  width={filtered[lightboxIdx].width}
                  height={filtered[lightboxIdx].height}
                  className="max-h-[80vh] w-auto rounded-xl shadow-2xl border border-motif-silver/40 object-contain"
                  quality={95}
                  priority={true}
                  style={{
                    imageRendering: "high-quality",
                    WebkitImageRendering: "high-quality",
                  }}
                />
              )}
            </div>
            <button
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-motif-cream bg-motif-deep/85 hover:bg-motif-deep border border-motif-cream/25 rounded-full px-4 py-2.5 transition-all duration-200 shadow-lg hover:scale-110"
              onClick={() => setLightboxIdx((i) => (i == null ? null : (i + 1) % filtered.length))}
            >
              ›
            </button>
            <button
              className="absolute top-3 right-3 text-motif-cream bg-motif-deep/85 hover:bg-motif-deep border border-motif-cream/25 rounded-full px-4 py-2 transition-all duration-200 shadow-lg hover:scale-105 font-sans text-sm"
              onClick={() => setLightboxIdx(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Back to top */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          className="px-6 py-3 rounded-full bg-motif-soft text-motif-deep font-semibold border border-motif-deep/35 hover:bg-motif-cream hover:border-motif-accent/50 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-sans"
          onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })}
        >
          Back to top
        </button>
      </div>
    </div>
  )
}


