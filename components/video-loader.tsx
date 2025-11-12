"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface VideoLoaderProps {
  videoSrc: string
  onLoadComplete?: () => void
}

export function VideoLoader({ videoSrc, onLoadComplete }: VideoLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showExpand, setShowExpand] = useState(false)

  useEffect(() => {
    // Preload video
    const video = document.createElement("video")
    video.src = videoSrc
    video.preload = "auto"

    const handleCanPlayThrough = () => {
      // Video is ready to play
      setShowExpand(true)

      // After expansion animation, hide loader
      setTimeout(() => {
        setIsLoading(false)
        onLoadComplete?.()
      }, 1200) // Duration of expand + fade animation
    }

    video.addEventListener("canplaythrough", handleCanPlayThrough)

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlayThrough)
    }
  }, [videoSrc, onLoadComplete])

  if (!isLoading) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
      >
        <AnimatePresence>
          {showExpand && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 15, 20],
                opacity: [1, 0.6, 0]
              }}
              transition={{
                duration: 1.2,
                times: [0, 0.6, 1],
                ease: [0.4, 0, 0.2, 1]
              }}
              className="absolute h-32 w-32 rounded-full bg-[#FF5728]"
              style={{
                filter: "blur(0px)",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
