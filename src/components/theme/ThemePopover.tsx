import { MoonIcon, PaletteIcon, RotateCcwIcon, SunIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '../ui/button'
import { applyThemeHue, DEFAULT_HUE, getHue, getTheme, storeHue } from './dynamicHue'

const applyLinkCardTheme = (theme: string, hue: number) => {
  const linkCards = document.querySelectorAll('iframe')

  linkCards.forEach((card) => {
    card.contentWindow?.postMessage(
      {
        hue,
        theme,
        type: 'set-theme'
      },
      '*'
    )
  })
}

function ThemePopover() {
  const [hue, setHue] = useState<number>(DEFAULT_HUE)
  const [theme, setTheme] = useState<string>('light')
  const isHueChanged = hue !== DEFAULT_HUE

  const initHue = () => {
    const initialHue = getHue()
    setHue(initialHue)
    applyThemeHue(initialHue)
  }

  const initTheme = () => {
    const initialTheme = getTheme()
    setTheme(initialTheme)
    applyLinkCardTheme(initialTheme, hue)
  }

  const onHueChange = (newHue: number) => {
    setHue(newHue)
    applyThemeHue(newHue)
    storeHue(newHue)
    applyLinkCardTheme(theme, newHue)
  }

  const onThemeToggle = () => {
    const element = document.documentElement
    const currentTheme = element.getAttribute('data-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

    element.setAttribute('data-theme', newTheme)
    element.classList.remove('scheme-dark', 'scheme-light')
    element.classList.add(newTheme === 'dark' ? 'scheme-dark' : 'scheme-light')

    window.getComputedStyle(element).getPropertyValue('opacity')

    localStorage.setItem('theme', newTheme)

    setTheme(newTheme)
    applyLinkCardTheme(newTheme, hue)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: 初期化時のみ実行するため意図的に空の依存配列
  useEffect(() => {
    initHue()
    initTheme()

    const handleSwap = () => {
      const storedTheme = localStorage.getItem('theme') || 'light'
      const storedHue = getHue()
      const element = document.documentElement

      element.classList.add('[&_*]:transition-none')

      window.getComputedStyle(element).getPropertyValue('opacity')

      element.setAttribute('data-theme', storedTheme)
      element.classList.remove('scheme-dark', 'scheme-light')
      element.classList.add(storedTheme === 'dark' ? 'scheme-dark' : 'scheme-light')
      initHue()
      setTheme(storedTheme)

      applyLinkCardTheme(storedTheme, storedHue)

      requestAnimationFrame(() => {
        element.classList.remove('[&_*]:transition-none')
      })
    }

    document.addEventListener('astro:after-swap', handleSwap)

    return () => {
      document.removeEventListener('astro:after-swap', handleSwap)
    }
  }, [])

  return (
    <Popover>
      <Tooltip delayDuration={500}>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button aria-label='Theme Settings' className='size-8' size='icon' variant={'ghost'}>
              <PaletteIcon className='size-4' />
              <span className='sr-only'>Theme Settings</span>
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>
          <p>Theme Settings</p>
        </TooltipContent>
      </Tooltip>

      <PopoverContent className='mx-2 flex items-center gap-x-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label='Toggle Theme'
              className='size-8 cursor-pointer transition-all disabled:cursor-not-allowed'
              disabled={!isHueChanged}
              id='theme-toggle'
              onClick={() => {
                // reset hue to default
                onHueChange(DEFAULT_HUE)
              }}
              size={'icon'}
              tabIndex={-1}
              variant={'ghost'} // Prevent focus
            >
              <RotateCcwIcon className={'size-5'} />
              <span className='sr-only'>Reset Theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset Theme</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <input
              className='w-full'
              id='hue-slider'
              max={360}
              min={0}
              onInput={(e) => {
                if (!(e.target instanceof HTMLInputElement)) return

                const angle = parseFloat(e.target.value)
                onHueChange(angle)
              }}
              tabIndex={-1}
              type='range'
              value={hue} // Prevent focus
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Hue Slider</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label='Toggle Theme'
              className='size-8 cursor-pointer transition-all'
              id='theme-toggle'
              onClick={() => {
                onThemeToggle()
                applyThemeHue(hue)
              }}
              size={'icon'}
              tabIndex={-1}
              variant={'ghost'}
            >
              <SunIcon
                className={'size-5 rotate-0 opacity-100 transition-all dark:scale-0 dark:-rotate-90 dark:opacity-0'}
              />
              <MoonIcon
                className={
                  'absolute size-5 rotate-90 opacity-0 transition-all dark:scale-100 dark:rotate-0 dark:opacity-100'
                }
              />
              <span className='sr-only'>Toggle Theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Theme</p>
          </TooltipContent>
        </Tooltip>
      </PopoverContent>
    </Popover>
  )
}

export { ThemePopover }
