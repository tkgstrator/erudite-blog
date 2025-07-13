import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoonIcon, PaletteIcon, RotateCcwIcon, SunIcon } from "lucide-react";
import { applyThemeHue, DEFAULT_HUE, getHue, storeHue } from "./dynamicHue";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const onThemeToggle = () => {
  const element = document.documentElement;
  const currentTheme = element.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  element.setAttribute("data-theme", newTheme);
  element.classList.remove("scheme-dark", "scheme-light");
  element.classList.add(newTheme === "dark" ? "scheme-dark" : "scheme-light");

  window.getComputedStyle(element).getPropertyValue("opacity");

  localStorage.setItem("theme", newTheme);
};

function ThemePopover() {
  const [hue, setHue] = useState<number>(DEFAULT_HUE);
  const isHueChanged = hue != DEFAULT_HUE;

  const initHue = () => {
    const initialHue = getHue();
    setHue(initialHue);
    applyThemeHue(initialHue);
  };

  useEffect(() => {
    initHue();

    document.addEventListener("astro:after-swap", () => {
      const storedTheme = localStorage.getItem("theme") || "light";
      const element = document.documentElement;

      element.classList.add("[&_*]:transition-none");

      window.getComputedStyle(element).getPropertyValue("opacity");

      element.setAttribute("data-theme", storedTheme);
      element.classList.remove("scheme-dark", "scheme-light");
      element.classList.add(
        storedTheme === "dark" ? "scheme-dark" : "scheme-light",
      );
      initHue();

      requestAnimationFrame(() => {
        element.classList.remove("[&_*]:transition-none");
      });
    });
  }, []);

  return (
    <Popover>
      <Tooltip delayDuration={500}>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size="icon"
              className="size-8"
              aria-label="Theme Settings"
            >
              <PaletteIcon className="size-4" />
              <span className="sr-only">Theme Settings</span>
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>
          <p>Theme Settings</p>
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="mx-2 flex items-center gap-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="theme-toggle"
              variant={"ghost"}
              size={"icon"}
              className="size-8 cursor-pointer transition-all disabled:cursor-not-allowed"
              onClick={() => {
                // reset hue to default
                setHue(DEFAULT_HUE);
                applyThemeHue(DEFAULT_HUE);
                storeHue(DEFAULT_HUE);
              }}
              disabled={!isHueChanged}
              aria-label="Toggle Theme"
              tabIndex={-1} // Prevent focus
            >
              <RotateCcwIcon className={"size-5"} />
              <span className="sr-only">Reset Theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset Theme</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <input
              type="range"
              value={hue}
              min={0}
              max={360}
              id="hue-slider"
              onInput={(e) => {
                if (!(e.target instanceof HTMLInputElement)) return;

                const angle = parseFloat(e.target.value);
                setHue(angle);
                applyThemeHue(angle);
                storeHue(angle);
              }}
              className="w-full"
              tabIndex={-1} // Prevent focus
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Hue Slider</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="theme-toggle"
              variant={"ghost"}
              size={"icon"}
              className="size-8 cursor-pointer transition-all"
              onClick={() => {
                onThemeToggle();
                applyThemeHue(hue);
              }}
              aria-label="Toggle Theme"
              tabIndex={-1}
            >
              <SunIcon
                className={
                  "size-5 rotate-0 opacity-100 transition-all dark:scale-0 dark:-rotate-90 dark:opacity-0"
                }
              />
              <MoonIcon
                className={
                  "absolute size-5 rotate-90 opacity-0 transition-all dark:scale-100 dark:rotate-0 dark:opacity-100"
                }
              />
              <span className="sr-only">Toggle Theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Theme</p>
          </TooltipContent>
        </Tooltip>
      </PopoverContent>
    </Popover>
  );
}

export { ThemePopover };
