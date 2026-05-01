'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Cinzel, Cormorant_Garamond } from 'next/font/google'
import { X } from 'lucide-react'
import Image from 'next/image'

import { TornPaperEdge } from './TornPaperEdge'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: '400',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

interface StorySectionProps {
  imageSrc: string
  title?: string
  text: React.ReactNode
  layout: 'image-left' | 'image-right'
  theme: 'dark' | 'light'
  /** Reserved for section sequencing / future use */
  isFirst?: boolean
  isLast?: boolean
  /** Optional override when you know orientation (layout before load). */
  imageAspect?: 'auto' | 'portrait' | 'landscape' | 'square'
}

const fallbackAspect = { w: 3, h: 4 }

function ratioFromVariant(
  variant: StorySectionProps['imageAspect'],
): { w: number; h: number } {
  switch (variant) {
    case 'landscape':
      return { w: 4, h: 3 }
    case 'square':
      return { w: 1, h: 1 }
    case 'portrait':
      return { w: 3, h: 4 }
    case 'auto':
    default:
      return fallbackAspect
  }
}

function scaledIntrinsic(r: { w: number; h: number }) {
  const k = 512
  return { w: Math.max(1, Math.round(r.w * k)), h: Math.max(1, Math.round(r.h * k)) }
}

/** Square and landscape → full-width + text below on desktop; portrait → side-by-side. */
function isLandscapeLike(w: number, h: number) {
  return w >= h
}

export const StorySection: React.FC<StorySectionProps> = ({
  imageSrc,
  title,
  text,
  layout,
  theme,
  imageAspect = 'auto',
}: StorySectionProps) => {
  const isDark = theme === 'dark'
  const [loadedSize, setLoadedSize] = useState<{ w: number; h: number } | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    setLoadedSize(null)
  }, [imageSrc])

  useEffect(() => {
    if (!lightboxOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [lightboxOpen])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen])

  const intrinsic =
    loadedSize ??
    (imageAspect !== 'auto'
      ? scaledIntrinsic(ratioFromVariant(imageAspect))
      : scaledIntrinsic(fallbackAspect))

  const layoutKnown = imageAspect !== 'auto' || loadedSize !== null

  const landscapeLike =
    imageAspect === 'landscape' || imageAspect === 'square'
      ? true
      : imageAspect === 'portrait'
        ? false
        : loadedSize
          ? isLandscapeLike(loadedSize.w, loadedSize.h)
          : false

  /** Desktop: side-by-side only when we know it’s portrait-like; `auto` before load stays stacked to avoid wrong crop. */
  const usePortraitSplitDesktop = layoutKnown && !landscapeLike

  const bgColor = isDark ? 'bg-motif-accent' : 'bg-motif-cream relative z-10'
  const textColor = isDark ? 'text-motif-cream' : 'text-motif-deep'

  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const imageFrameClass = isDark
    ? 'bg-motif-cream p-1.5 md:p-3 shadow-lg'
    : 'bg-motif-medium p-1.5 md:p-3 shadow-md'

  const rotation =
    layout === 'image-left' ? 'rotate-1 md:rotate-2' : '-rotate-1 md:-rotate-2'

  const flexDirectionRow = layout === 'image-left' ? 'md:flex-row' : 'md:flex-row-reverse'
  const textAlignment = layout === 'image-left' ? 'text-left' : 'text-left md:text-right'

  const imageBg = isDark ? 'bg-black/15' : 'bg-motif-deep/[0.04]'

  const sizesInline =
    '(max-width: 767px) 100vw, ' +
    (usePortraitSplitDesktop ? '(max-width: 1024px) 45vw, 38vw' : '(max-width: 1024px) 90vw, min(1200px, 85vw)')

  const imageClassMobile =
    'w-full h-auto max-h-[min(88vh,26rem)] object-contain object-center transition-[transform,opacity] duration-500 ease-out group-hover/image:scale-[1.03] group-hover/image:opacity-[0.97]'

  const imageClassPortraitMd =
    'md:max-h-[min(90vh,40rem)] lg:max-h-[min(92vh,44rem)]'

  const imageClassLandscapeMd =
    'md:max-h-[min(82vh,48rem)] lg:max-h-[min(85vh,56rem)] xl:max-h-[min(88vh,60rem)]'

  const storyImage = (
    <Image
      src={imageSrc}
      alt={title ? `Story: ${title}` : 'Story moment'}
      width={intrinsic.w}
      height={intrinsic.h}
      sizes={sizesInline}
      className={`${imageClassMobile} ${usePortraitSplitDesktop ? imageClassPortraitMd : imageClassLandscapeMd}`}
      quality={90}
      priority={false}
      onLoadingComplete={(img) => {
        setLoadedSize({
          w: img.naturalWidth,
          h: img.naturalHeight,
        })
      }}
    />
  )

  const framedImage = (
    <div
      className={`${imageFrameClass} w-full max-w-full overflow-hidden rounded-sm ${usePortraitSplitDesktop ? rotation : 'md:rotate-0'}`}
    >
      <div className={`relative w-full overflow-hidden ${imageBg}`}>
        {storyImage}
        {isDark && (
          <div className="pointer-events-none absolute inset-0 z-10 bg-black/5 mix-blend-multiply" />
        )}
      </div>
    </div>
  )

  const textBlock = (
    <div
      className={`${textColor} w-full ${usePortraitSplitDesktop ? `md:w-7/12 ${textAlignment}` : 'max-w-3xl mx-auto text-center md:px-4'}`}
    >
      {title && (
        <h2
          className={`${cinzel.className} text-2xl sm:text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-6 tracking-wide leading-tight transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } ${isDark ? 'text-motif-cream' : 'text-motif-deep'}`}
        >
          {title}
        </h2>
      )}

      <div
        className={`${cormorant.className} text-[15px] leading-relaxed sm:text-base md:text-xl md:leading-relaxed lg:text-2xl space-y-3 md:space-y-6 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } ${theme === 'light' ? 'italic font-normal' : 'font-light'}`}
      >
        {text}
      </div>
    </div>
  )

  return (
    <div className={`${bgColor} relative`}>
      {!isDark && (
        <>
          <div className="absolute top-0 left-0 w-full -mt-[8px] md:-mt-[20px] z-20 text-motif-cream pointer-events-none">
            <TornPaperEdge flipped={true} />
          </div>
          <div className="absolute bottom-0 left-0 w-full -mb-[8px] md:-mb-[20px] z-20 text-motif-cream pointer-events-none">
            <TornPaperEdge flipped={false} />
          </div>
        </>
      )}

      <div
        ref={sectionRef}
        className={`container mx-auto px-3 sm:px-4 md:px-12 py-12 md:py-24 lg:py-32 relative z-10 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}
      >
        {/* Mobile: always column, image first. Desktop portrait: row; desktop landscape: column full-width image. */}
        <div
          className={`flex flex-col gap-6 sm:gap-8 md:gap-10 ${
            usePortraitSplitDesktop ? `${flexDirectionRow} md:items-start md:justify-between` : ''
          }`}
        >
          <div
            className={`group/image w-full transition-all duration-1000 delay-300 ease-out ${
              isVisible ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-0'
            } ${usePortraitSplitDesktop ? 'md:w-5/12 md:shrink-0' : ''}`}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className={`relative block w-full cursor-zoom-in rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-motif-accent/60 focus-visible:ring-offset-2 ${
                isDark ? 'focus-visible:ring-offset-motif-deep' : 'focus-visible:ring-offset-motif-cream'
              }`}
              aria-label={title ? `Enlarge photo: ${title}` : 'Enlarge story photo'}
            >
              {framedImage}
              <span className="pointer-events-none absolute inset-0 rounded-sm ring-0 ring-motif-accent/0 transition-[box-shadow,ring] duration-300 group-hover/image:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] group-hover/image:ring-2 group-hover/image:ring-motif-accent/25" />
            </button>
          </div>

          {textBlock}
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 backdrop-blur-sm p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Full size photo"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 z-10 rounded-full border border-white/25 bg-black/50 p-2.5 text-white transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-label="Close preview"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxOpen(false)
            }}
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
          </button>
          <div
            className="relative flex max-h-[min(92vh,900px)] w-full max-w-6xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageSrc}
              alt={title ? `Full size: ${title}` : 'Story moment full size'}
              width={intrinsic.w}
              height={intrinsic.h}
              sizes="100vw"
              className="max-h-[min(92vh,900px)] w-auto max-w-full object-contain"
              quality={95}
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}
