export default interface IGuildConfig {
    guildId: string;
    channelId: string;
    pingRoleId: string;
    memberRoleId: string;
}

export interface Config {
    TOKEN: string;
    ESNUPICORE: IGuildConfig;
    MECHANICS: IGuildConfig;
    MIN_RANK_THRESHOLD: number;
    tournamentForumId: number;
    refreshSeconds: number;
}
