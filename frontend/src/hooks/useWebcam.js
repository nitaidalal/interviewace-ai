import { useRef, useState, useCallback } from 'react'

const useWebcam = () => {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [denied, setDenied] = useState(false)
  const [loading, setLoading] = useState(false)

  const requestWebcam = useCallback(async () => {
    setLoading(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setEnabled(true)
      setDenied(false)
    } catch {
      setDenied(true)
      setEnabled(false)
    } finally {
      setLoading(false)
    }
  }, [])

  const stopWebcam = useCallback(() => {
    if (streamRef.current) { 
      streamRef.current.getTracks().forEach((track) => track.stop()) 
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setEnabled(false)
  }, [])

  return { videoRef, enabled, denied, loading, requestWebcam, stopWebcam }
}

export default useWebcam