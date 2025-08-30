'use client'

import React, { useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion'
import Logo from './Logo'

// HomeBud Design System Components

// Morphing Background mit interaktivem Maus-Tracking
export const MorphingBackground = React.memo(() => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const { clientX, clientY } = event
    mouseX.set(clientX)
    mouseY.set(clientY)
  }, [mouseX, mouseY])
  
  const background = useMotionTemplate`
    radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(34, 197, 94, 0.15), transparent 80%)
  `
  
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background }}
      onMouseMove={handleMouseMove}
    />
  )
})

// Floating Elements für dynamische Hintergrund-Animationen
export const FloatingElements = React.memo(({ count = 20 }: { count?: number }) => {
  const [positions, setPositions] = React.useState<Array<{x: number, y: number}>>([])
  
  React.useEffect(() => {
    const newPositions = Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }))
    setPositions(newPositions)
  }, [count])
  
  return (
    <div className="fixed inset-0 pointer-events-none">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="floating-element"
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
          }}
        />
      ))}
    </div>
  )
})

// Animated Background Blobs
export const BackgroundBlobs = React.memo(() => (
  <div className="absolute inset-0">
    <motion.div 
      className="bg-blob-homebud top-1/4 left-1/4"
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
    <motion.div 
      className="bg-blob-homebud bottom-1/4 right-1/4"
      animate={{ 
        scale: [1.2, 1, 1.2],
        rotate: [360, 180, 0]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
    />
  </div>
))

// Animated Gradient Text
export const AnimatedGradientText = React.memo(({ 
  children, 
  className = "",
  size = "default"
}: { 
  children: React.ReactNode
  className?: string
  size?: "default" | "large" | "hero"
}) => {
  const sizeClasses = {
    default: "text-2xl md:text-3xl",
    large: "text-4xl md:text-5xl",
    hero: "text-6xl md:text-8xl"
  }
  
  return (
    <motion.h2
      className={`${sizeClasses[size]} font-bold ${className}`}
      animate={{ 
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{
        background: 'linear-gradient(90deg, #22c55e, #10b981, #059669, #22c55e)',
        backgroundSize: '300% 300%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}
    >
      {children}
    </motion.h2>
  )
})

// Interactive Card mit 3D-Hover-Effekt
export const InteractiveCard = React.memo(({ 
  children, 
  className = "",
  onClick
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) => {

  const cardRef = useRef<HTMLDivElement>(null)
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 15
    const rotateY = (centerX - x) / 15
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }, [])
  
  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }
  }, [])
  
  return (
    <motion.div
      ref={cardRef}
      className={`card-homebud-interactive ${className}`}
      onMouseMove={handleMouseMove}

      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )
})

// Floating Element mit Animation
export const FloatingElement = React.memo(({ 
  children, 
  delay = 0, 
  duration = 3,
  className = ""
}: { 
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      scale: [1, 1.05, 1]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    whileHover={{
      scale: 1.1,
      rotate: 10,
      transition: { duration: 0.2 }
    }}
  >
    {children}
  </motion.div>
))

// Parallax Section
export const ParallaxSection = React.memo(({ 
  children, 
  speed = 0.5, 
  className = "" 
}: { 
  children: React.ReactNode
  speed?: number
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed])
  
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
})

// HomeBud Button Komponenten
export const HomeBudButton = React.memo(({ 
  children, 
  variant = "primary", 
  size = "default",
  onClick,
  className = "",
  disabled = false
}: { 
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline"
  size?: "default" | "large"
  onClick?: () => void
  className?: string
  disabled?: boolean
}) => {
  const baseClasses = "font-medium transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantClasses = {
    primary: "btn-homebud-primary",
    secondary: "btn-homebud-secondary",
    outline: "border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
  }
  
  const sizeClasses = {
    default: "px-6 py-3",
    large: "px-8 py-4 text-lg"
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  return (
    <motion.button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
    </motion.button>
  )
})



// HomeBud Navigation
export const HomeBudNavigation = React.memo(({ 
  children,
  isVisible = true,
  className = ""
}: { 
  children: React.ReactNode
  isVisible?: boolean
  className?: string
}) => (
  <motion.nav 
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className={`nav-homebud ${className}`}
  >
    {children}
  </motion.nav>
))

// HomeBud Hero Section
export const HomeBudHero = React.memo(({ 
  children,
  className = ""
}: { 
  children: React.ReactNode
  className?: string
}) => (
  <motion.section 
    className={`hero-homebud ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <BackgroundBlobs />
    <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
      {children}
    </div>
  </motion.section>
))

// HomeBud Section
export const HomeBudSection = React.memo(({ 
  children,
  className = "",
  withBackground = true
}: { 
  children: React.ReactNode
  className?: string
  withBackground?: boolean
}) => (
  <section className={`py-20 relative overflow-hidden ${className}`}>
    {withBackground && (
      <>
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5"></div>
        <FloatingElements count={8} />
      </>
    )}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {children}
    </div>
  </section>
))

// HomeBud Logo
export const HomeBudLogo = React.memo(({ 
  size = "default",
  onClick
}: { 
  size?: "small" | "default" | "large"
  onClick?: () => void
}) => {

  

  
  return (
    <motion.div 
      className="flex items-center space-x-2 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <Logo size={size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md'} variant="white" />
    </motion.div>
  )
})

// HomeBud Footer
export const HomeBudFooter = React.memo(({ 
  children,
  className = ""
}: { 
  children: React.ReactNode
  className?: string
}) => (
  <footer className={`py-12 border-t border-white/10 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </footer>
))
