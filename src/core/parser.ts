import {
  Stmt,
  Program,
  Expr,
  BinaryExpr,
  NumericLiteral,
  Identifier,
  VarDeclaration,
  AssignmentExpr,
} from "./ast";
import { tokenize, Token, TokenType } from "./lexer";

export default class Parser {
  private tokens: Token[] = [];

  private notEof(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  private expect(type: TokenType, err: any): Token {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type !== type) {
      console.error("Parser Error: ", err);
      // EXIT program
    }
    return prev;
  }

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (this.notEof()) {
      program.body.push(this.parseStmt());
    }

    return program;
  }

  private parseStmt(): Stmt {
    switch (this.at().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parseVarDeclaration();
      default:
        return this.parseExpr();
    }
  }

  private parseVarDeclaration(): Stmt {
    const isConstant = this.advance().type == TokenType.Const;
    const identifier = this.expect(
      TokenType.Identifier,
      "Expected identifier name following let | const keywords."
    ).value;

    if (this.at().type == TokenType.Semicolon) {
      this.advance();

      if (isConstant) {
        throw "Must assign value to constant expression. No value provided.";
      }

      return {
        kind: "VarDeclaration",
        identifier,
        constant: false,
      } as VarDeclaration;
    }

    this.expect(
      TokenType.Equals,
      "Expected equals token following identifier in var declaration."
    );

    const declaration = {
      kind: "VarDeclaration",
      value: this.parseExpr(),
      identifier,
      constant: isConstant,
    } as VarDeclaration;

    this.expect(
      TokenType.Semicolon,
      "Variable declaration statement must end with semicolon."
    );

    return declaration;
  }

  private parseExpr(): Expr {
    return this.parseAssignmentExpr();
  }

  private parseAssignmentExpr(): Expr {
    const left = this.parseAdditiveExpr();
    if (this.at().type == TokenType.Equals) {
      this.advance(); // x = foo = bar chaining
      const value = this.parseAssignmentExpr();

      return {
        value,
        assignee: left,
        kind: "AssignmentExpr",
      } as AssignmentExpr;
    }

    return left;
  }

  private advance() {
    return this.tokens.shift() as Token;
  }

  private at() {
    return this.tokens[0] as Token;
  }

  // Order of precedence
  // FunctionCall > LogicalExpr > ComparisonExpr > AdditiveExpr > MultiplicativeExpr > UnaryExpr > PrimaryExpr

  private parsePrimaryExpr(): Expr {
    const token = this.tokens[0];

    switch (token.type) {
      case TokenType.Identifier:
        return {
          kind: "Identifier",
          symbol: this.advance().value,
        } as Identifier;

      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.advance().value),
        } as NumericLiteral;

      case TokenType.OpenParen:
        this.advance();
        const value = this.parseExpr();
        this.expect(TokenType.CloseParen, "Expect closing parentheses");
        return value;

      default:
        throw new Error("Unexpected token found");
    }
  }

  private parseAdditiveExpr(): Expr {
    let left = this.parseMultiplicativeExpr();

    while (this.tokens[0].value == "+" || this.tokens[0].value == "-") {
      const operator = this.advance().value;
      const right = this.parseMultiplicativeExpr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parseMultiplicativeExpr(): Expr {
    let left = this.parsePrimaryExpr();

    while (
      this.tokens[0].value == "/" ||
      this.tokens[0].value == "*" ||
      this.tokens[0].value == "%"
    ) {
      const operator = this.advance().value;
      const right = this.parsePrimaryExpr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }
}
