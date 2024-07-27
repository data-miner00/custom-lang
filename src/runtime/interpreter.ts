import {
  NullVal,
  RuntimeVal,
  ValueType,
  NumberVal,
  MK_NUL,
  MK_NUM,
} from "./values";
import {
  AssignmentExpr,
  BinaryExpr,
  Identifier,
  NodeType,
  NumericLiteral,
  Program,
  Stmt,
  VarDeclaration,
} from "../core/ast";
import Environment from "./environment";
import {
  evalAssignment,
  evalIdentifier,
  evaluateBinaryExpr,
} from "./eval/expressions";
import { evaluateProgram, evalVarDeclaration } from "./eval/statements";

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return MK_NUM((astNode as NumericLiteral).value);
    case "Identifier":
      return evalIdentifier(astNode as Identifier, env);
    case "AssignmentExpr":
      return evalAssignment(astNode as AssignmentExpr, env);
    case "BinaryExpr":
      return evaluateBinaryExpr(astNode as BinaryExpr, env);
    case "Program":
      return evaluateProgram(astNode as Program, env);
    case "VarDeclaration":
      return evalVarDeclaration(astNode as VarDeclaration, env);
    default:
      throw new Error("Notsetup yet");
  }
}
