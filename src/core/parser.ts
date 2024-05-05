import {
  Stmt,
  Program,
  Expr,
  BinaryExpr,
  NumericLiteral,
  Identifier,
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
    return this.parseExpr();
  }

  private parseExpr(): Expr {
    return this.parseAdditiveExpr();
  }

  private advance() {
    return this.tokens.shift() as Token;
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
        console.error("Unexpected token found");
        return {} as Stmt;
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
