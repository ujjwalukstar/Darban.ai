// Simple sound utility using Web Audio API and fallback to HTML5 Audio
export const playSound = (soundName) => {
  try {
    // I have Created audio element
    const audio = new Audio(`/sounds/${soundName}.mp3`)
    audio.volume = 0.3 // Set volume to 30%

    // This func Play the sound
    const playPromise = audio.play()

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Audio play failed:", error)
      })
    }
  } catch (error) {
    console.log("Sound playback error:", error)
  }
}

// I have Generated simple beep sounds programmatically if audio files are not available
export const generateBeep = (frequency = 440, duration = 200, type = "sine") => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration / 1000)
  } catch (error) {
    console.log("Web Audio API not supported:", error)
  }
}
