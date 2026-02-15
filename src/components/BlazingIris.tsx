import { useEffect, useRef } from 'react'

interface BlazingIrisProps {
  size?: number
  intensity?: 'low' | 'medium' | 'high'
}

function BlazingIris({ size = 300, intensity = 'medium' }: BlazingIrisProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let rotation = 0
    let flameOffset = 0

    const intensityMultiplier = {
      low: 0.7,
      medium: 1,
      high: 1.5
    }[intensity]

    const drawFlame = (x: number, y: number, radius: number, angle: number, offset: number) => {
      const flameHeight = radius * 0.4 * intensityMultiplier
      const gradient = ctx!.createLinearGradient(x, y, x, y - flameHeight)
      gradient.addColorStop(0, '#ffd700')
      gradient.addColorStop(0.3, '#ff8c00')
      gradient.addColorStop(0.6, '#ff4500')
      gradient.addColorStop(1, 'rgba(255, 69, 0, 0)')

      ctx!.beginPath()
      ctx!.moveTo(x - radius * 0.15, y)
      
      const wave = Math.sin(angle + offset) * radius * 0.1
      ctx!.quadraticCurveTo(
        x - radius * 0.1 + wave,
        y - flameHeight * 0.5,
        x,
        y - flameHeight
      )
      ctx!.quadraticCurveTo(
        x + radius * 0.1 - wave,
        y - flameHeight * 0.5,
        x + radius * 0.15,
        y
      )
      
      ctx!.fillStyle = gradient
      ctx!.fill()
    }

    const drawEye = () => {
      ctx!.clearRect(0, 0, size, size)
      
      const centerX = size / 2
      const centerY = size / 2
      const eyeRadius = size * 0.35

      const outerGlow = ctx!.createRadialGradient(centerX, centerY, eyeRadius * 0.8, centerX, centerY, eyeRadius * 1.5)
      outerGlow.addColorStop(0, 'rgba(255, 100, 0, 0.3)')
      outerGlow.addColorStop(0.5, 'rgba(255, 50, 0, 0.1)')
      outerGlow.addColorStop(1, 'rgba(255, 0, 0, 0)')
      ctx!.beginPath()
      ctx!.arc(centerX, centerY, eyeRadius * 1.5, 0, Math.PI * 2)
      ctx!.fillStyle = outerGlow
      ctx!.fill()

      ctx!.save()
      ctx!.translate(centerX, centerY)
      ctx!.scale(1.3, 0.7)
      ctx!.beginPath()
      ctx!.arc(0, 0, eyeRadius, 0, Math.PI * 2)
      ctx!.restore()

      const eyeGradient = ctx!.createRadialGradient(centerX, centerY - eyeRadius * 0.3, 0, centerX, centerY, eyeRadius)
      eyeGradient.addColorStop(0, '#2a0a0a')
      eyeGradient.addColorStop(0.5, '#1a0505')
      eyeGradient.addColorStop(1, '#0a0202')
      ctx!.fillStyle = eyeGradient
      ctx!.fill()

      const irisRadius = eyeRadius * 0.6
      const irisGradient = ctx!.createRadialGradient(centerX, centerY, 0, centerX, centerY, irisRadius)
      irisGradient.addColorStop(0, '#ffd700')
      irisGradient.addColorStop(0.3, '#ff8c00')
      irisGradient.addColorStop(0.6, '#ff4500')
      irisGradient.addColorStop(1, '#8b0000')
      
      ctx!.beginPath()
      ctx!.arc(centerX, centerY, irisRadius, 0, Math.PI * 2)
      ctx!.fillStyle = irisGradient
      ctx!.fill()

      ctx!.save()
      ctx!.translate(centerX, centerY)
      ctx!.rotate(rotation)
      
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        ctx!.beginPath()
        ctx!.moveTo(Math.cos(angle) * irisRadius * 0.2, Math.sin(angle) * irisRadius * 0.2)
        ctx!.lineTo(Math.cos(angle) * irisRadius * 0.9, Math.sin(angle) * irisRadius * 0.9)
        ctx!.strokeStyle = `rgba(255, 215, 0, ${0.3 + Math.sin(rotation * 2 + i) * 0.2})`
        ctx!.lineWidth = 2
        ctx!.stroke()
      }
      ctx!.restore()

      const pupilRadius = irisRadius * 0.35
      const pupilGradient = ctx!.createRadialGradient(centerX, centerY, 0, centerX, centerY, pupilRadius)
      pupilGradient.addColorStop(0, '#000000')
      pupilGradient.addColorStop(0.7, '#1a0a0a')
      pupilGradient.addColorStop(1, '#2a0a0a')
      
      ctx!.beginPath()
      ctx!.arc(centerX, centerY, pupilRadius, 0, Math.PI * 2)
      ctx!.fillStyle = pupilGradient
      ctx!.fill()

      ctx!.save()
      ctx!.translate(centerX, centerY)
      ctx!.rotate(-rotation * 1.5)
      
      const coreFlameGradient = ctx!.createRadialGradient(0, 0, 0, 0, 0, pupilRadius * 0.8)
      coreFlameGradient.addColorStop(0, '#ffffff')
      coreFlameGradient.addColorStop(0.3, '#ffd700')
      coreFlameGradient.addColorStop(0.7, '#ff4500')
      coreFlameGradient.addColorStop(1, 'rgba(255, 69, 0, 0)')
      
      ctx!.beginPath()
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const nextAngle = ((i + 1) / 8) * Math.PI * 2
        const r = pupilRadius * 0.6 * (0.8 + Math.sin(flameOffset + i * 0.5) * 0.2)
        
        if (i === 0) {
          ctx!.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
        } else {
          const midAngle = (angle + nextAngle) / 2
          const midR = r * 0.5
          ctx!.quadraticCurveTo(
            Math.cos(midAngle) * midR,
            Math.sin(midAngle) * midR,
            Math.cos(nextAngle) * r,
            Math.sin(nextAngle) * r
          )
        }
      }
      ctx!.closePath()
      ctx!.fillStyle = coreFlameGradient
      ctx!.fill()
      ctx!.restore()

      const highlightX = centerX - irisRadius * 0.3
      const highlightY = centerY - irisRadius * 0.3
      const highlightGradient = ctx!.createRadialGradient(highlightX, highlightY, 0, highlightX, highlightY, irisRadius * 0.2)
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      
      ctx!.beginPath()
      ctx!.arc(highlightX, highlightY, irisRadius * 0.2, 0, Math.PI * 2)
      ctx!.fillStyle = highlightGradient
      ctx!.fill()

      ctx!.save()
      ctx!.translate(centerX, centerY - eyeRadius * 0.7)
      for (let i = 0; i < 7; i++) {
        const angle = ((i - 3) / 10) * Math.PI
        const flameX = Math.sin(angle) * eyeRadius * 0.3
        drawFlame(flameX, 0, eyeRadius * 0.3, angle, flameOffset + i * 0.3)
      }
      ctx!.restore()

      ctx!.save()
      ctx!.translate(centerX, centerY + eyeRadius * 0.7)
      ctx!.scale(1, -1)
      for (let i = 0; i < 5; i++) {
        const angle = ((i - 2) / 10) * Math.PI
        const flameX = Math.sin(angle) * eyeRadius * 0.2
        drawFlame(flameX, 0, eyeRadius * 0.2, angle, flameOffset + i * 0.4 + Math.PI)
      }
      ctx!.restore()
    }

    const animate = () => {
      rotation += 0.01 * intensityMultiplier
      flameOffset += 0.05 * intensityMultiplier
      drawEye()
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [size, intensity])

  return (
    <div className="relative animate-float" style={{ width: size, height: size }}>
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size}
        className="animate-flame-pulse"
      />
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, transparent 30%, rgba(255, 100, 0, 0.1) 70%, transparent 100%)',
          filter: 'blur(10px)'
        }}
      />
    </div>
  )
}

export default BlazingIris
