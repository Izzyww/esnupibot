import { JSDOM } from "jsdom";

// Types
import { Config } from "../types/IGuildConfig.js";
import { Client, Guild, Role, TextChannel } from "discord.js";
import { IPostData } from "../types/IPostData.js";

// Utilities
import shouldExcludeTopic from "./shouldExcludeTopic.js";
import topicStorageService from "./topicStorageService.js";

const seenTopicIds = topicStorageService.getSeenTopicIds();

async function fetchLastPostData(forumId: number): Promise<IPostData> {
    const response = await fetch(
        `https://osu.ppy.sh/community/forums/${forumId}?sort=created#topics`,
    );
    const text = await response.text();
    const dom = new JSDOM(text);
    const element = dom.window.document.querySelector<HTMLAnchorElement>(
        "#topics .forum-list__items .forum-topic-entry__content a",
    );

    if (!element) {
        throw new Error("Chega fi quebrou o web scraping it's over -100 green aura 💀");
    }

    const topicIdMatch = element.href.match(/\d+/g);
    const topicId = topicIdMatch?.[topicIdMatch.length - 1];

    if (!topicId) {
        throw new Error("GG num deu pra encontrar o ID do tópico no link 💀");
    }

    return {
        topicId,
        title: element.textContent?.trim() || "Titulo não encontrado, alguém fez cagada...",
        link: element.href,
    };
}

export async function pollLastTopic(client: Client, config: Config) {
    let esnupicore: { guild: Guild; channel: TextChannel; role: Role };
    let mechanics: { guild: Guild; channel: TextChannel; role: Role };

    try {
        // Server principal (esnupicore)
        const guild = await client.guilds.fetch(config.ESNUPICORE.guildId);
        const targetChannel = (await guild.channels.fetch(
            config.ESNUPICORE.channelId,
        )) as TextChannel;
        const role = await guild.roles.fetch(config.ESNUPICORE.pingRoleId);

        // Server mechanics
        const guild2 = await client.guilds.fetch(config.MECHANICS.guildId);
        const targetChannel2 = (await guild2.channels.fetch(
            config.MECHANICS.channelId,
        )) as TextChannel;
        const role2 = await guild2.roles.fetch(config.MECHANICS.pingRoleId);

        if (!targetChannel || !targetChannel2 || !role || !role2) {
            throw new Error("Falha ao buscar canais ou roles dos servidores.");
        }

        esnupicore = { guild: guild, channel: targetChannel, role: role };
        mechanics = { guild: guild2, channel: targetChannel2, role: role2 };
    } catch (error) {
        console.error("Erro ao buscar os canais ou roles:", error);
        return;
    }

    try {
        const { topicId, title, link } = await fetchLastPostData(config.tournamentForumId);

        if (shouldExcludeTopic(title) || seenTopicIds.includes(topicId)) {
            return;
        }

        seenTopicIds.push(topicId);
        topicStorageService.updateSeenTopicIds(seenTopicIds);

        // Bagui de mandar mensagem no discord
        try {
            esnupicore.channel.send(`**[${title}](${link})**\n${esnupicore.role}`);
        } catch (error) {
            console.error("It's over, num deu pra mandar a mensagem pro esnupicore 💀: ", error);
        }
        try {
            mechanics.channel.send(`**[${title}](${link})**\n${mechanics.role}`);
        } catch (error) {
            console.error("GG aqui acabo num deu pra mandar a mensagem pro MECHANICS 💀: ", error);
        }
    } catch (error) {
        const memberIdsToPing = ["239388097714978817", "307586669220200448", "395422473929359370"];
        const membersToPing = esnupicore.guild.members.cache.filter((member) =>
            memberIdsToPing.includes(member.id),
        );
        const memberNames = membersToPing.map((member) => member.toString());

        await esnupicore.channel.send(
            `⚠️ ${(error as Error).message}\n\n${memberNames.join("")}Bot morreu aqui...`,
        );
        console.error("O erro em questão: ", error);
    }
}
