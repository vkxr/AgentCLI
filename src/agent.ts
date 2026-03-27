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
- searchFiles(keyword)

Rules:

1. Use tools ONLY when needed (file read or file search)
2. For normal chat (hi, hello, questions) → reply normally
3. If using a tool → respond ONLY in JSON
4. args must always be an object

Examples:

User: hi
→ Hello! How can I help you?

User: find ts files
→ { "tool": "searchFiles", "args": { "keyword": "ts" } }

User: read package.json
→ { "tool": "readFile", "args": { "path": "package.json" } }

After tool result → explain normally
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
      const parsed = JSON.parse(response);
      const tool = parsed.tool;
      const args = typeof parsed.args === "string" ? { keyword: parsed.args } : parsed.args;


      let result;

      if (tool === "readFile") {
        result = tools.readFile(args.path);
      } else if (tool === "searchFiles") {
        result = tools.searchFiles(args.keyword);
      } else {
        result = "Unknown tool";
      }

      console.log("Tool Result:", result);

      messages.push({
        role: "assistant",
        content: response,
      });

      messages.push({
        role: "user",
        content: `Tool result: ${JSON.stringify(result)}`,
      });

    } else {
      console.log("Final Answer:", response);
      break;
    }
  }
}