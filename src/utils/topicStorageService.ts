import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filename = path.join(__dirname, "seenTopicIds.json");

function getSeenTopicIds(): string[] {
    try {
        const content = fs.readFileSync(filename, "utf-8");
        const seenTopicIds = JSON.parse(content);

        return seenTopicIds;
    } catch (e) {
        return [];
    }
}

function updateSeenTopicIds(seenTopicIds: string[]): void {
    const content = JSON.stringify(seenTopicIds, null, " ".repeat(4));

    fs.writeFileSync(filename, content);
}

const topicStorageService = {
    getSeenTopicIds,
    updateSeenTopicIds,
};

export default topicStorageService;
