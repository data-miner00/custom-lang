import { Program, VarDeclaration } from "../../core/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { RuntimeVal, MK_NUL } from "../values";

export function evaluateProgram(
  program: Program,
  env: Environment
): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NUL();

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }

  return lastEvaluated;
}

export function evalVarDeclaration(
  declaration: VarDeclaration,
  env: Environment
) {
  const value = declaration.value ? evaluate(declaration.value, env) : MK_NUL();
  return env.declareVariable(
    declaration.identifier,
    value,
    declaration.constant
  );
}
