import {
  AssignmentExpr,
  BinaryExpr,
  Identifier,
  VarDeclaration,
} from "../../core/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { RuntimeVal, NumberVal, MK_NUL, MK_NUM } from "../values";

export function evaluateBinaryExpr(
  binop: BinaryExpr,
  env: Environment
): RuntimeVal {
  const leftHandSide = evaluate(binop.left, env);
  const rightHandSide = evaluate(binop.right, env);

  if (leftHandSide.type == "number" && rightHandSide.type == "number") {
    return evalNumericBinaryExpr(
      leftHandSide as NumberVal,
      rightHandSide as NumberVal,
      binop.operator
    );
  }
  return MK_NUL();
}

export function evalNumericBinaryExpr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string
): NumberVal {
  let results = 0;

  if (operator === "+") {
    results = lhs.value + rhs.value;
  } else if (operator == "-") {
    results = lhs.value - rhs.value;
  } else if (operator == "*") {
    results = lhs.value * rhs.value;
  } else if (operator == "/") {
    results = lhs.value / rhs.value;
  } else {
    results = lhs.value % rhs.value;
  }

  return MK_NUM(results);
}

export function evalIdentifier(id: Identifier, env: Environment) {
  const val = env.lookupVar(id.symbol);
  return val;
}

export function evalAssignment(node: AssignmentExpr, env: Environment) {
  if (node.assignee.kind !== "Identifier") {
    throw new Error("Invalid LHS inside assignment expression");
  }

  const varname = (node.assignee as Identifier).symbol;
  return env.assignVar(varname, evaluate(node.value, env));
}
