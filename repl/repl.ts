import readline from "readline";
import { run } from "./run";

export async function main() {
  const prompt = ">>> ";
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt,
  });
  rl.prompt();
  let buf = "";

  rl.on("line", (input) => {
    buf += input;
    try {
      run(buf);
    } catch (e) {
      console.error(e);
    } finally {
      buf = "";
    }
    rl.setPrompt(prompt);
    rl.prompt();
  });

  rl.on("SIGINT", () => {
    process.exit(0);
  });

  rl.on("close", () => {
    process.exit(0);
  });
}

main();
