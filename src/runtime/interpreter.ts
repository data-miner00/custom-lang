import { NullVal, RuntimeVal, ValueType, NumberVal } from "./values";
import {
  BinaryExpr,
  NodeType,
  NumericLiteral,
  Program,
  Stmt,
} from "../core/ast";

function evaluateBinaryExpr(binop: BinaryExpr): RuntimeVal {
  const leftHandSide = evaluate(binop.left);
  const rightHandSide = evaluate(binop.right);

  if (leftHandSide.type == "number" && rightHandSide.type == "number") {
    return evalNumericBinaryExpr(
      leftHandSide as NumberVal,
      rightHandSide as NumberVal,
      binop.operator
    );
  }
  return { type: "null", value: "null" } as NullVal;
}

function evalNumericBinaryExpr(
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

  return { value: results, type: "number" };
}

function evaluateProgram(program: Program): RuntimeVal {
  let lastEvaluated: RuntimeVal = {
    type: "null",
    value: "null",
  } as NullVal;

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
  }

  return lastEvaluated;
}

export function evaluate(astNode: Stmt): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: (astNode as NumericLiteral).value,
        type: "number",
      } as NumberVal;
    case "NullLiteral":
      return { value: "null", type: "null" } as NullVal;
    case "BinaryExpr":
      return evaluateBinaryExpr(astNode as BinaryExpr);
    case "Program":
      return evaluateProgram(astNode as Program);
    default:
      throw new Error("Notsetup yet");
  }
}
