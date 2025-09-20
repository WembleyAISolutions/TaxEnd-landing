'use client'

import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  className?: string
}

export function SkeletonLoader({ className = '' }: SkeletonLoaderProps) {
  return (
    <motion.div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <SkeletonLoader className="w-12 h-12 rounded-lg" />
      </div>
      <SkeletonLoader className="h-8 w-24 mb-2" />
      <SkeletonLoader className="h-4 w-20" />
    </div>
  )
}

export function ActivitySkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b">
        <SkeletonLoader className="h-6 w-32" />
      </div>
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start space-x-3">
            <SkeletonLoader className="w-5 h-5 rounded-full mt-1" />
            <div className="flex-1 space-y-2">
              <SkeletonLoader className="h-4 w-3/4" />
              <SkeletonLoader className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
