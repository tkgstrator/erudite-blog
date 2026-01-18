export const DEFAULT_HUE = 256 as const

export const applyThemeHue = (angle: number) => {
  const dataTheme = document.documentElement.getAttribute('data-theme') ?? 'light'

  const properties = {
    dark: {
      background: `oklch(20% 0.01 ${angle}deg)`,
      border: `oklch(25% 0.015 ${angle}deg)`,
      foreground: `oklch(98.5% 0.03 ${angle}deg)`,
      input: `oklch(25% 0.015 ${angle}deg)`,
      popover: `oklch(24% 0.01 ${angle}deg)`,
      ring: `oklch(43.9% 0.01 ${angle}deg)`,
      secondary: `oklch(25% 0.01 ${angle}deg)`
    },
    light: {
      background: `oklch(100% 0.01 ${angle}deg)`,
      border: `oklch(92.2% 0.015 ${angle}deg)`,
      foreground: `oklch(14.5% 0.05 ${angle}deg)`,
      input: `oklch(92.2% 0.015 ${angle}deg)`,
      popover: `oklch(100% 0.01 ${angle}deg)`,
      ring: `oklch(70.8% 0.015 ${angle}deg)`,
      secondary: `oklch(97% 0.01 ${angle}deg)`
    }
  }
  if (!Object.keys(properties).includes(dataTheme)) {
    console.warn(`Theme "${dataTheme}" not found. Using default properties.`)
    return
  }

  Object.entries(properties[dataTheme as keyof typeof properties]).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value)
  })
}

export const storeHue = (angle: number) => {
  localStorage.setItem('theme-hue', angle.toString())
}

export const getHue = () => {
  const storedHue = localStorage.getItem('theme-hue')
  return storedHue ? parseFloat(storedHue) : DEFAULT_HUE // Default to 256 if not set
}

export const getTheme = () => {
  return localStorage.getItem('theme') || 'light'
}
