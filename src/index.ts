import Parser from "./core/parser";
import { evaluate } from "./runtime/interpreter";

async function repl() {
  const parser = new Parser();
  console.log("\nRepl v0.1");

  while (true) {
    const input = prompt("> ");
    if (!input || input.includes("-1")) {
      return;
    }

    const program = parser.produceAST(input);
    console.log(program);

    const result = evaluate(program);
    console.log(result);
  }
}

repl();
