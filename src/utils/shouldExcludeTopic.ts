import { config } from "../config.js";

/**
 * Parses a rank string and converts it to a number.
 * @param {string} rankString Rank string to parse.
 * @returns {number} Rank as a number.
 */
function parseRank(rankString: string): number {
    if (!rankString) {
        return 0;
    }

    const lcRank = rankString.toLowerCase(); // lc = lower case
    if (lcRank.includes("k")) {
        const numericValue = Number(lcRank.replace(",", ".").replace("k", ""));
        return numericValue * 1000;
    }

    return Number(lcRank);
}

/**
 * Checks if a topic should be excluded based on its title.
 * @param {string} title Topic tittle
 * @return {boolean} True if the topic should be excluded & false if not.
 */
export default function shouldExcludeTopic(title: string): boolean {
    const excludeStrings = ["ctb", "o!m", "taiko", "4k", "7k"];
    const minRankThreshold = config.MIN_RANK_THRESHOLD;

    if (excludeStrings.some((excludeString) => title.toLowerCase().includes(excludeString))) {
        return true;
    }

    const match = title.match(/(\d+([.,]\d+)?k?)\s*-\s*\d+([.,]\d+)?k?/i);

    if (match != null) {
        const minRank = parseRank(match[1]);

        if (minRank > minRankThreshold) {
            return true;
        }
    }

    return false;
}
