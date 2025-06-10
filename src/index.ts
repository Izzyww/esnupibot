import { Client, IntentsBitField } from "discord.js";
import { config } from "./config.js";

// Utilities
import { pollLastTopic } from "./utils/pollLastTopic.js";
import { addRole } from "./utils/addRole.js";

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

setInterval(async () => {
    await pollLastTopic(client, config);
}, config.refreshSeconds * 1000);

client.on("ready", async (c) => {
    console.log(`🦈 ${c.user.username} is on!!!🦈`);

    await pollLastTopic(client, config);
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
