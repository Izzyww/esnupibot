import { GuildMember } from "discord.js";

/**
 * Adds a role to a guild member
 * @param {GuildMember} member The member object that will receive the role
 * @param {string} roleId The ID of the role to be added
 */
export default async function addRole(member, roleId) {
    if (!member || !roleId) {
        console.error("Not enough parameters provided to addRole function");
        return;
    }

    try {
        const role = await member.guild.roles.fetch(roleId);
        if (!role) {
            console.error(`Role with ID ${roleId} not found in guild ${member.guild.name}`);
            return;
        }

        await member.roles.add(role);
    } catch (error) {
        console.error(`Failed to add role: ${error}`);
    }
}
