'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  color: string
  delay?: number
}

export default function FeatureCard({ icon, title, description, color, delay = 0 }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15])

  const springConfig = { damping: 20, stiffness: 300 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    mouseX.set((e.clientX - centerX) / (rect.width / 2))
    mouseY.set((e.clientY - centerY) / (rect.height / 2))
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative perspective-1000"
    >
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full transform-gpu"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}
          >
            {icon}
          </motion.div>
          
          <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </motion.div>
    </motion.div>
  )
}
