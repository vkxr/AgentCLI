import { runAgent } from "./agent.js";

const input = process.argv.slice(2).join(" ");
console.log(process.argv)

runAgent(input);