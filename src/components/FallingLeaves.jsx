import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function FallingLeaves() {
  // Generate 25 leaves with random properties
  const leaves = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      xStart: Math.random() * 100, // random start percentage
      drift: (Math.random() - 0.5) * 120, // drift left or right in px
      size: 14 + Math.random() * 18, // random size in px
      duration: 7 + Math.random() * 9, // fall duration between 7s and 16s
      delay: Math.random() * 10, // staggered start
      rotationStart: Math.random() * 360,
      opacity: 0.25 + Math.random() * 0.45,
      // Color variations: vibrant emerald, forest mint, gold-tinted leaf
      color: ['#40916c', '#52b788', '#74c69d', '#95d5b2', '#c9a84c'][i % 5],
    }))
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1, // Behind cards, above background
      }}
    >
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{
            y: '-10vh',
            x: `${leaf.xStart}vw`,
            rotate: leaf.rotationStart,
            opacity: 0,
          }}
          animate={{
            y: '110vh',
            x: `calc(${leaf.xStart}vw + ${leaf.drift}px)`,
            rotate: leaf.rotationStart + 360 * 2,
            opacity: [0, leaf.opacity, leaf.opacity, 0],
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            delay: leaf.delay,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: leaf.size,
            height: leaf.size * 1.5,
          }}
        >
          {/* Elegant SVG outline/filled Ceylon tropical leaf */}
          <svg
            viewBox="0 0 24 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          >
            <path
              d="M12 2 C18 10 22 20 12 34 C2 20 6 10 12 2 Z"
              fill={leaf.color}
              fillOpacity={0.7}
              stroke={leaf.color}
              strokeWidth="1.2"
            />
            {/* Center vein */}
            <path
              d="M12 4 L12 32"
              stroke="#0a1a0e"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            {/* Side veins */}
            <path
              d="M12 12 Q16 10 18 13 M12 18 Q17 16 19 20 M12 24 Q16 23 18 26"
              stroke="#0a1a0e"
              strokeWidth="0.6"
              strokeOpacity="0.4"
            />
            <path
              d="M12 12 Q8 10 6 13 M12 18 Q7 16 5 20 M12 24 Q8 23 6 26"
              stroke="#0a1a0e"
              strokeWidth="0.6"
              strokeOpacity="0.4"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
