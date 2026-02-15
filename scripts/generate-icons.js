import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdirSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#1a0a0a"/>
      <stop offset="100%" style="stop-color:#0a0505"/>
    </radialGradient>
    <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffd700"/>
      <stop offset="40%" style="stop-color:#ff8c00"/>
      <stop offset="70%" style="stop-color:#ff4500"/>
      <stop offset="100%" style="stop-color:#8b0000"/>
    </radialGradient>
    <radialGradient id="pupilGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#000000"/>
      <stop offset="100%" style="stop-color:#1a0a0a"/>
    </radialGradient>
    <radialGradient id="flameGrad" cx="50%" cy="100%" r="80%">
      <stop offset="0%" style="stop-color:#ffd700"/>
      <stop offset="50%" style="stop-color:#ff6b00"/>
      <stop offset="100%" style="stop-color:#ff4500;stop-opacity:0"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <rect width="512" height="512" fill="url(#bgGrad)"/>
  
  <ellipse cx="256" cy="256" rx="180" ry="120" fill="#1a0505" stroke="#ff4500" stroke-width="2" opacity="0.5"/>
  
  <circle cx="256" cy="256" r="100" fill="url(#irisGrad)" filter="url(#glow)"/>
  
  <g transform="translate(256,256)">
    <line x1="-80" y1="0" x2="80" y2="0" stroke="#ffd700" stroke-width="2" opacity="0.5"/>
    <line x1="0" y1="-80" x2="0" y2="80" stroke="#ffd700" stroke-width="2" opacity="0.5"/>
    <line x1="-57" y1="-57" x2="57" y2="57" stroke="#ffd700" stroke-width="1.5" opacity="0.4"/>
    <line x1="57" y1="-57" x2="-57" y2="57" stroke="#ffd700" stroke-width="1.5" opacity="0.4"/>
  </g>
  
  <circle cx="256" cy="256" r="35" fill="url(#pupilGrad)"/>
  
  <circle cx="240" cy="240" r="12" fill="rgba(255,255,255,0.6)"/>
  <circle cx="265" cy="260" r="5" fill="rgba(255,255,255,0.3)"/>
  
  <g filter="url(#glow)">
    <path d="M256 130 Q240 100 256 70 Q272 100 256 130" fill="url(#flameGrad)"/>
    <path d="M230 145 Q210 120 225 90 Q245 115 230 145" fill="url(#flameGrad)" opacity="0.7"/>
    <path d="M282 145 Q302 120 287 90 Q267 115 282 145" fill="url(#flameGrad)" opacity="0.7"/>
    
    <path d="M256 382 Q240 412 256 442 Q272 412 256 382" fill="url(#flameGrad)" opacity="0.5"/>
  </g>
  
  <ellipse cx="256" cy="256" rx="180" ry="120" fill="none" stroke="#ff6b00" stroke-width="3" opacity="0.3"/>
</svg>`

const iconsDir = join(__dirname, 'public', 'icons')

if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true })
}

async function generateIcons() {
  console.log('🔥 开始生成炽瞳图标...')
  
  for (const size of sizes) {
    try {
      await sharp(Buffer.from(svgIcon))
        .resize(size, size)
        .png()
        .toFile(join(iconsDir, `icon-${size}.png`))
      
      console.log(`✅ 生成 icon-${size}.png`)
    } catch (error) {
      console.error(`❌ 生成 icon-${size}.png 失败:`, error)
    }
  }
  
  console.log('🎉 图标生成完成！')
}

generateIcons()
