'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// Lazy Loading Image Component
export const LazyImage = React.memo(({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 animate-pulse" />
      )}
    </div>
  )
})

// Virtual Scrolling für große Listen
export const VirtualList = React.memo(({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem 
}: {
  items: any[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: any, index: number) => React.ReactNode
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const visibleItemCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  return (
    <div
      ref={containerRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {items.slice(startIndex, endIndex).map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

// Performance-optimierte Animation Container
export const AnimationContainer = React.memo(({ 
  children, 
  delay = 0, 
  duration = 0.6
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-50px"
  })

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  )
})

// Service Worker für Caching
export const useServiceWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }, [])
}

// Intersection Observer Hook für Performance
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry?.isIntersecting ?? false)
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [ref, options])

  return isIntersecting
}

// Debounced Scroll Hook
export const useDebouncedScroll = (callback: () => void, delay: number = 16) => {
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleScroll = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(callback, delay)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [callback, delay])
}

// Memory-optimierte Animation Frame Hook
export const useAnimationFrame = (callback: (time: number) => void) => {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current
        callback(deltaTime)
      }
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [callback])
}

// Preload Hook für kritische Ressourcen - nur verwenden wenn wirklich benötigt
export const usePreload = (urls: string[]) => {
  useEffect(() => {
    // Nur preloaden wenn die URLs tatsächlich verwendet werden
    const timeoutId = setTimeout(() => {
      urls.forEach(url => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = url
        link.as = 'image'
        document.head.appendChild(link)
      })
    }, 1000) // Verzögerung um sicherzustellen, dass die Ressource bald verwendet wird

    return () => clearTimeout(timeoutId)
  }, [urls])
}

// Performance Monitoring Hook
export const usePerformanceMonitor = () => {
  useEffect(() => {
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime)
          }
          if (entry.entryType === 'first-input') {
            const firstInputEntry = entry as any
            console.log('FID:', firstInputEntry.processingStart - entry.startTime)
          }
        }
      })

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] })

      return () => observer.disconnect()
    }
    return undefined
  }, [])
}
