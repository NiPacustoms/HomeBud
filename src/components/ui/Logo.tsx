import React from 'react'
import Image from 'next/image'
import '../../styles/performance.css'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  className?: string
  showText?: boolean
  variant?: 'default' | 'white' | 'dark'
}

export default function Logo({ 
  size = 'md', 
  className = '', 
  showText = false,
  variant = 'default'
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-48 h-48',
    '3xl': 'w-96 h-96'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl',
    '3xl': 'text-6xl'
  }

  const textColors = {
    default: 'text-green-600',
    white: 'text-white',
    dark: 'text-gray-900'
  }

  if (!showText) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <Image
          src="/logo-text-only.svg"
          alt="HomeBud Logo"
          fill
          sizes="(max-width: 768px) 32px, (max-width: 1024px) 48px, 96px"
          className="object-contain"
          priority
        />
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
        <Image
          src="/Design ohne Titel (24).png"
          alt="HomeBud Logo"
          fill
          sizes="(max-width: 768px) 32px, (max-width: 1024px) 48px, 96px"
          className="object-contain"
          priority
        />
      </div>
      
      <div className={`font-bold ${textSizes[size]} ${textColors[variant]}`}>
        HomeBud
      </div>
    </div>
  )
}

// Varianten für verschiedene Anwendungsfälle
export function LogoIcon({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  return <Logo size={size} className={className} showText={false} />
}

// Nur das Logo-Symbol ohne Text
export function LogoOnly({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl', className?: string }) {
  return (
    <Image
      src="/Design ohne Titel (24).png"
      alt="HomeBud Logo"
      width={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 96 : size === '2xl' ? 192 : 384}
      height={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 96 : size === '2xl' ? 192 : 384}
      className={`object-contain ${className}`}
      priority
    />
  )
}

export function LogoWhite({ size = 'md', className = '', showText = false }: { size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl', className?: string, showText?: boolean }) {
  return <Logo size={size} className={className} showText={showText} variant="white" />
}

export function LogoDark({ size = 'md', className = '', showText = false }: { size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl', className?: string, showText?: boolean }) {
  return <Logo size={size} className={className} showText={showText} variant="dark" />
}

export function LogoTransparent({ size = 'md', className = '', showText = false }: { size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl', className?: string, showText?: boolean }) {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl'
  }

  if (!showText) {
    return (
      <Image
        src="/Design ohne Titel (24).png"
        alt="HomeBud Logo"
        width={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 96 : 192}
        height={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 96 : 192}
        className={`object-contain ${className}`}
        priority
      />
    )
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Image
        src="/Design ohne Titel (24).png"
        alt="HomeBud Logo"
        width={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 96 : 192}
        height={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 96 : 192}
        className="object-contain"
        priority
      />
      
      <div className={`font-bold ${textSizes[size]} text-green-600`}>
        HomeBud
      </div>
    </div>
  )
}

// Komplett transparentes Logo ohne Hintergrund - nur Schriftzug
export function LogoNoBackground({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl', className?: string }) {
  const getSize = () => {
    switch (size) {
      case 'sm': return 32
      case 'md': return 48
      case 'lg': return 64
      case 'xl': return 96
      case '2xl': return 192
      case '3xl': return 384
      default: return 48
    }
  }
  
  const logoSize = getSize()
  
  return (
    <div 
      className={`relative logo-container ${className}`} 
      data-size={logoSize}
    >
      <Image
        src="/Design ohne Titel (24).png"
        alt="HomeBud Logo"
        width={logoSize}
        height={logoSize}
        className="object-contain w-full h-full"
        priority
      />
    </div>
  )
}

// Nur der Schriftzug vom Logo (schwarz auf transparent)
export function LogoText({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl', className?: string }) {
  return (
    <Image
      src="/Design ohne Titel (24).png"
      alt="HomeBud Logo Text"
      width={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 96 : 192}
      height={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 96 : 192}
      className={`object-contain ${className}`}
      priority
    />
  )
}
