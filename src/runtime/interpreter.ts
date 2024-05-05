import {
  NullVal,
  RuntimeVal,
  ValueType,
  NumberVal,
  MK_NUL,
  MK_NUM,
} from "./values";
import {
  BinaryExpr,
  Identifier,
  NodeType,
  NumericLiteral,
  Program,
  Stmt,
} from "../core/ast";
import Environment from "./environment";

function evaluateBinaryExpr(binop: BinaryExpr, env: Environment): RuntimeVal {
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

  return MK_NUM(results);
}

function evaluateProgram(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NUL();

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }

  return lastEvaluated;
}

function evalIdentifier(id: Identifier, env: Environment) {
  const val = env.lookupVar(id.symbol);
  return val;
}

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return MK_NUM((astNode as NumericLiteral).value);
    case "NullLiteral":
      return MK_NUL();
    case "Identifier":
      return evalIdentifier(astNode as Identifier, env);
    case "BinaryExpr":
      return evaluateBinaryExpr(astNode as BinaryExpr, env);
    case "Program":
      return evaluateProgram(astNode as Program, env);
    default:
      throw new Error("Notsetup yet");
  }
}
