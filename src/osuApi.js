import axios from "axios";
import dayjs from "dayjs";
import { config } from "./config.js";
import { Auth, Client } from "osu-web.js";

const expiresInSecondsOffset = 30;
const osuApiUrl = "https://osu.ppy.sh/api/v2";

class OsuApi {
    token = null;
    expiresIn = null;
    client = new Client("");

    isAuthenticated() {
        if (this.token == null) {
            return false;
        }

        return dayjs(this.expiresIn).isAfter(Date.now());
    }

    async beforeApiRequest() {
        await this.handleAuthentication();
    }

    async handleAuthentication() {
        if (this.isAuthenticated()) {
            return;
        }

        const auth = new Auth(config.OSU_API_CLIENT_ID, config.OSU_API_SECRET, config.OSU_API_CALLBACK_URL);
        const response = await auth.clientCredentialsGrant();
        const token = response.access_token;

        this.client = new Client(token);
        this.expiresIn = dayjs(Date.now()).add(response.expires_in - expiresInSecondsOffset, "seconds").toDate();
        this.token = token;
    }


    async getUser(userArgument) {
        await this.beforeApiRequest();

        return await this.client.users.getUser(userArgument, {
            urlParams: {
                mode: "osu"
            }
        });
    }

    async getBeatmap(beatmapId) {
        await this.beforeApiRequest();

        return await this.client.beatmaps.getBeatmap(beatmapId);
    }

    async getTopicListing(forumId = null) {
        await this.beforeApiRequest();
        
        const params = {};

        if (forumId != null) {
            params.forum_id = forumId;
        }

        const response = await axios.get(`${osuApiUrl}/forums/topics`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
            },
            params,
        });

        return response.data;
    }

    async getTopic(forumId) {
        await this.beforeApiRequest();

        return await this.client.forum.getTopic(forumId);
    }
}

const osuApi = new OsuApi();

export default osuApi;
