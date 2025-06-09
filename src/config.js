import dotenv from "dotenv";

dotenv.config();

const { TOKEN, OSU_API_SECRET, OSU_API_CALLBACK_URL } = process.env;
const OSU_API_CLIENT_ID = Number(process.env.OSU_API_CLIENT_ID);

if (!OSU_API_CLIENT_ID || !OSU_API_SECRET || !OSU_API_CALLBACK_URL) {
    throw new Error("Missing environment variables");
}

export const config = {
    TOKEN,
    OSU_API_CLIENT_ID,
    OSU_API_SECRET,
    OSU_API_CALLBACK_URL,
};
