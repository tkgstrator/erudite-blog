import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoonIcon, PaletteIcon, SunIcon } from "lucide-react";
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
  const initHue = () => {
    const initialHue = getHue();
    setHue(initialHue);
    applyThemeHue(initialHue);
  };

  useEffect(() => {
    initHue();
  }, []);

  return (
    <Popover>
      <PopoverTrigger>
        <PaletteIcon className="size-4" />
      </PopoverTrigger>
      <PopoverContent className="mx-2 flex items-center gap-x-2">
        <input
          type="range"
          defaultValue={hue}
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
        />

        <Button
          id="theme-toggle"
          variant={"ghost"}
          size={"icon"}
          className="size-8 transition-all"
          onClick={() => {
            onThemeToggle();
            applyThemeHue(hue);
          }}
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
      </PopoverContent>
    </Popover>
  );
}

export { ThemePopover };
