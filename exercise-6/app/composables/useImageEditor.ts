import type { IImageEditSettings } from '~/types'
import {
  DEFAULT_BRIGHTNESS,
  DEFAULT_COLOR_OPACITY,
} from '~/utils/constants'

export function useImageEditor() {
  const settings = reactive<IImageEditSettings>({
    brightness: DEFAULT_BRIGHTNESS,
    colorOverlay: '#ff0000',
    colorOpacity: DEFAULT_COLOR_OPACITY,
  })

  const isExporting = ref(false)

  function applyEdits(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
  ) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    ctx.filter = `brightness(${settings.brightness}%)`
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    ctx.filter = 'none'

    if (settings.colorOpacity > 0) {
      ctx.globalCompositeOperation = 'multiply'
      const alpha = settings.colorOpacity / 100
      ctx.fillStyle = hexToRgba(settings.colorOverlay, alpha)
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'source-over'
    }
  }

  function exportBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to export canvas to blob'))
        },
        'image/png',
      )
    })
  }

  function resetSettings() {
    settings.brightness = DEFAULT_BRIGHTNESS
    settings.colorOverlay = '#ff0000'
    settings.colorOpacity = DEFAULT_COLOR_OPACITY
  }

  return { settings, isExporting, applyEdits, exportBlob, resetSettings }
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
