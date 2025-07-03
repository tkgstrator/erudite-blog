import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: Date, locale: string = "en-US"): string {
	return Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
	// return dateFormat(date, "yyyy/MMdd");
}

interface TextLengthCount {
	words: number;
	characters: number;
}

export function calculateWordCountFromHtml(
	html: string | null | undefined,
): TextLengthCount {
	if (!html)
		return {
			words: 0,
			characters: 0,
		};
	const textOnly = html.replace(/<[^>]+>/g, "");

	const japaneseChars = (textOnly.match(/[\u4e00-\u9fff\u3040-\u30ff]/g) || [])
		.length;
	const englishOnly = textOnly.replace(/[\u4e00-\u9fff\u3040-\u30ff]+/g, " ");
	const englishWords = (englishOnly.match(/\w+/g) || []).length;

	return { words: englishWords, characters: japaneseChars };
}

export function readingTime(
	count: TextLengthCount,
	locale: string = "en-US",
): string {
	const minutes = readingTimeNumber(count);
	switch (locale) {
		case "ja-JP": {
			return `${minutes} 分`;
		}
		default: {
			return `${minutes} min read`;
		}
	}
}

export function readingTimeNumber(count: TextLengthCount): number {
	const readingTimeMinutes = Math.max(
		1,
		Math.round(count.words / 200) + Math.round(count.characters / 500),
	);
	return readingTimeMinutes;
}

export function subpostCountToString(
	count: number,
	locale: string = "en-US",
): string {
	switch (locale) {
		case "ja-JP": {
			return `${count} 件`;
		}
		default: {
			return `${count} subpost${count === 1 ? "" : "s"}`;
		}
	}
}

export function getHeadingMargin(depth: number): string {
	const margins: Record<number, string> = {
		3: "ml-4",
		4: "ml-8",
		5: "ml-12",
		6: "ml-16",
	};
	return margins[depth] || "";
}
