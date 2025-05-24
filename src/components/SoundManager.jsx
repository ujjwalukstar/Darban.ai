"use client"

import { useEffect } from "react"

const SoundManager = ({ enabled }) => {
  useEffect(() => {
    // This is Preload audio files when component mounts
    if (enabled) {
      const sounds = ["place", "vanish", "win", "error", "select", "start", "newGame"]
      sounds.forEach((sound) => {
        const audio = new Audio(`/sounds/${sound}.mp3`)
        audio.preload = "auto"
      })
    }
  }, [enabled])

  return null // This component doesn't render anything
}

export default SoundManager
