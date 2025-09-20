'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface AnimatedCounterProps {
  value: string
  duration?: number
  className?: string
}

export function AnimatedCounter({ value, duration = 2, className = '' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState('0')
  
  useEffect(() => {
    // Extract numeric value from string (e.g., "$3,247" -> 3247)
    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0
    const prefix = value.replace(/[0-9.,]/g, '')
    const suffix = value.includes('%') ? '%' : ''
    
    let startTime: number
    let startValue = 0
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + (numericValue - startValue) * easeOutQuart
      
      // Format the number with commas
      const formattedValue = Math.floor(currentValue).toLocaleString()
      setDisplayValue(`${prefix}${formattedValue}${suffix}`)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration])
  
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue}
    </motion.span>
  )
}
