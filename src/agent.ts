import { askAI } from "./ai.js";
import { tools } from "./tools/index.js";

function isToolCall(response: string) {
  try {
    const parsed = JSON.parse(response);
    return parsed.tool;
  } catch {
    return false;
  }
}

export async function runAgent(userInput: string) {
  let messages: any[] = [
    {
      role: "system",
      content: `
You are an AI coding agent.

You can use tools:
- readFile(path)

RULES:
1. If you need file content → call tool
2. After receiving tool result → DO NOT return JSON again
3. Instead → explain or summarize the result clearly

Tool call format:
{
  "tool": "tool_name",
  "args": {}
}
`,
    },
    {
      role: "user",
      content: userInput,
    },
  ];

  for (let i = 0; i < 5; i++) {
    const response = await askAI(messages);

    console.log("AI:", response);

    if (isToolCall(response)) {
      const { tool, args } = JSON.parse(response);

      const result = tools[tool](args.path);

      console.log("Tool Result:", result);


      messages.push({
        role: "assistant",
        content: response,
      });

      messages.push({
        role: "user",
        content: `Tool result: ${result}`,
      });
    } else {
      console.log("Final Answer:", response);
      break;
    }
  }
}