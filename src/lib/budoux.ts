import { loadDefaultJapaneseParser } from "budoux";

export const useBudoux = () => {
  const parser = loadDefaultJapaneseParser();

  const parse = (text: string) => parser.parse(text).join("\u200b");

  const maybeParse = (text: string | undefined, fallback: string) => {
    if (!text) {
      return fallback;
    }

    return parse(text);
  };

  const style = "break-keep text-ellipsis";

  return {
    parse,
    maybeParse,
    style,
  };
};
