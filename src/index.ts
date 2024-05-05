import Parser from "./core/parser";
import Environment from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";
import { MK_BUL, MK_NUL, MK_NUM } from "./runtime/values";
import settings from "./settings.json";

async function repl() {
  const parser = new Parser();
  const env = new Environment();

  env.declareVariable("x", MK_NUM(100));
  env.declareVariable("true", MK_BUL(true));
  env.declareVariable("false", MK_BUL(false));
  env.declareVariable("null", MK_NUL());

  console.log("\nRepl v0.1");

  while (true) {
    const input = prompt("> ");
    if (!input || input.includes("-1")) {
      return;
    }

    const program = parser.produceAST(input);
    settings.debug && console.log(program);

    const result = evaluate(program, env);
    console.log(result);
  }
}

repl();
