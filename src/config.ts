import dotenv from "dotenv";
import { Config } from "./types/IGuildConfig.js";
dotenv.config();

const { TOKEN } = process.env;
if (!TOKEN) {
    throw new Error("Missing TOKEN variable in .env file");
}

export const config: Config = {
    TOKEN,
    ESNUPICORE: {
        guildId: "1168209025763135578",
        channelId: "1356839367578222673",
        pingRoleId: "1364637261026689206",
        memberRoleId: "1364402339724787752",
    },
    MECHANICS: {
        guildId: "1381385016235524156",
        channelId: "1381389103098232963",
        pingRoleId: "1381413534528835664",
        memberRoleId: "1381413534528835664",
    },
    MIN_RANK_THRESHOLD: 2000,
    tournamentForumId: 55,
    refreshSeconds: 300,
};
