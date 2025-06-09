import osuApi from "./osuApi.js";

async function main() {
    const topic = await osuApi.getTopic(2061428);

    console.log(topic.topic.title);
}

main();
