import dotenv from "dotenv";

dotenv.config();

const { TOKEN, OSU_API_SECRET, OSU_API_CALLBACK_URL } = process.env;
const OSU_API_CLIENT_ID = Number(process.env.OSU_API_CLIENT_ID);

if (!OSU_API_CLIENT_ID || !OSU_API_SECRET || !OSU_API_CALLBACK_URL) {
    throw new Error("Missing environment variables");
}

const ESNUPICORE = {
    guildId: "1168209025763135578",
    channelId: "1356839367578222673",
    pingRoleId: "1364637261026689206",
    memberRoleId: "1364402339724787752",
}
const MECHANICS = {
    guildId: "1381385016235524156",
    channelId: "1381389103098232963",
    pingRoleId: "1381413534528835664",
    memberRoleId: "1381413534528835664",
}

export const config = {
    TOKEN,
    OSU_API_CLIENT_ID,
    OSU_API_SECRET,
    OSU_API_CALLBACK_URL,
    ESNUPICORE,
    MECHANICS
};
