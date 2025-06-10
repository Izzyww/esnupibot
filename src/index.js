import { Client, IntentsBitField } from "discord.js";
import { JSDOM } from "jsdom";

import { config } from "./config.js";
import topicStorageService from "./topicStorageService.js";
import addRole from "./utils/addRole.js";

const seenTopicIds = topicStorageService.getSeenTopicIds();
const tournamentForumId = 55;
const pollMs = 300000;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildModeration,
  ],
});

async function fetchLastPostData(forumId) {
  const response = await fetch(`https://osu.ppy.sh/community/forums/${forumId}?sort=created#topics`);
  const text = await response.text();
  const dom = new JSDOM(text);
  const htmlDoc = dom.window.document;
  const element = htmlDoc.querySelector("#topics .forum-list__items .forum-topic-entry__content a");

  if (element == null) {
    throw new Error("Chega fi quebrou o web scraping it's over -100 green aura 💀");
  }

  return {
    topicId: element.href.match(/\d+/g).at(-1),
    title: element.textContent.trim(),
    link: element.href,
  };
}

function shouldExcludeTopic(title) {
  const excludeStrings = ["ctb", "o!m", "taiko", "4k", "7k"];
  const minRankThreshold = 2000;

  if (excludeStrings.some((excludeString) => title.toLowerCase().includes(excludeString))) {
    return true;
  }

  const match = title.match(/(\d+k?)\s*-\s*\d+k?/i);

  if (match != null) {
    const min = Number(match[1].toLowerCase().replace("k", "000"));
    
    if (min <= minRankThreshold) {
      return true;
    }
  }

  return false;
}

async function pollLastTopic() {
  let guild, targetChannel, role;
  let guild2, targetChannel2, role2;

  try {
    // Server principal (esnupicore)
    guild = await client.guilds.fetch(config.ESNUPICORE.guildId);
    targetChannel = await guild.channels.fetch(config.ESNUPICORE.channelId);
    role = await guild.roles.fetch(config.ESNUPICORE.pingRoleId);

    // Server mechanics
    guild2 = await client.guilds.fetch(config.MECHANICS.guildId);
    targetChannel2 = await guild2.channels.fetch(config.MECHANICS.channelId);
    role2 = await guild2.roles.fetch(config.MECHANICS.pingRoleId);
  } catch (error) {
    console.error("Erro ao buscar os canais ou roles:", error);
    return;
  }

  try {
    const { topicId, title, link } = await fetchLastPostData(tournamentForumId);

    if (shouldExcludeTopic(title)) {
      return;
    }

    if (seenTopicIds.includes(topicId)) {
      return;
    }

    seenTopicIds.push(topicId);
    topicStorageService.updateSeenTopicIds(seenTopicIds);

    // Bagui de mandar mensagem no discord
    try {
      targetChannel.send(`**[${title}](${link})**\n${role}`);
    } catch (e) {
      console.error("It's over, num deu pra mandar a mensagem pro esnupicore 💀: ", e);
    }
    try {
      targetChannel2.send(`**[${title}](${link})**\n${role2} mano...`);
    } catch (e) {
      console.error("GG aqui acabo num deu pra mandar a mensagem pro MECHANICS 💀: ", e);
    }
  } catch (e) {
    const memberIdsToPing = ["239388097714978817", "307586669220200448", "395422473929359370"];
    const membersToPing = guild.members.cache.filter((member) => memberIdsToPing.includes(member.id));
    const memberNames = membersToPing.map((member) => member.toString());

    await targetChannel.send(`⚠️ ${e.message}\n\n${memberNames.join("")}`);
    console.error(e);
  }
}

setInterval(async () => {
  await pollLastTopic();
}, pollMs);

client.on("ready", async (c) => {
  console.log(`🦈 ${c.user.username} is on!!!🦈`);

  await pollLastTopic();
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  const replies = ["me mata", "se mata", ":kms:", "kys"];

  if (replies.some((reply) => message.content.includes(reply))) {
    await message.channel.send("https://files.catbox.moe/q6z1hs.mp4");
  }
});

client.on("guildMemberAdd", async (member) => {
  if (member.guild.id === config.ESNUPICORE.guildId) {
    await addRole(member, config.ESNUPICORE.memberRoleId);
  } else if (member.guild.id === config.MECHANICS.guildId) {
    await addRole(member, config.MECHANICS.memberRoleId);
  }
});

client.login(config.TOKEN);
// Jashin
// eu odeio JavaScript puro - Nyash.
