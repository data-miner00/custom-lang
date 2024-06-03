// let x = 45 + ( foo * bar )
// [ LetToken, IdentifierTk, EqualToken, NumberToken ]

export interface Token {
  value: string;
  type: TokenType;
}

export enum TokenType {
  Number,
  Identifier,
  Equals,
  OpenParen,
  CloseParen,
  Semicolon,
  BinaryOperator,
  Let,
  Const,
  EOF,
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
};

function isalpha(src: string): boolean {
  return src.toLowerCase() !== src.toUpperCase();
}

function isint(src: string): boolean {
  const charCode = src.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return charCode >= bounds[0] && charCode < bounds[1];
}

function isskippable(str: string): boolean {
  return str == " " || str == "\n" || str == "\t";
}

export function tokenize(src: string): Token[] {
  const tokens = new Array<Token>();
  const sources = src.split("");

  while (sources.length > 0) {
    const current = sources[0];

    if (current === "(") {
      tokens.push({ type: TokenType.OpenParen, value: sources.shift()! });
    } else if (current == ")") {
      tokens.push({ type: TokenType.CloseParen, value: sources.shift()! });
    } else if (["+", "-", "*", "/", "%"].includes(current)) {
      tokens.push({ type: TokenType.BinaryOperator, value: sources.shift()! });
    } else if (current == "=") {
      tokens.push({ type: TokenType.Equals, value: sources.shift()! });
    } else if (current == ";") {
      tokens.push({ type: TokenType.Semicolon, value: sources.shift()! });
    } else {
      // handle multicharacter token
      if (isint(current)) {
        let num = "";
        while (sources.length > 0 && isint(sources[0])) {
          num += sources.shift();
        }

        tokens.push({ type: TokenType.Number, value: num });
      } else if (isalpha(current)) {
        let id = "";
        while (sources.length > 0 && isalpha(sources[0])) {
          id += sources.shift();
        }

        const reserved = KEYWORDS[id];

        if (typeof reserved !== "number") {
          tokens.push({ type: TokenType.Identifier, value: id });
        } else {
          tokens.push({ type: reserved, value: id });
        }
      } else if (isskippable(current)) {
        sources.shift();
      } else {
        throw new EvalError("Unrecognized character " + current);
      }
    }
  }
  tokens.push({ type: TokenType.EOF, value: "EOF" });

  return tokens;
}

// const source = "let x = 45 + ( foo * bar )";

// for (const token of tokenize(source)) {
//   console.log(token);
// }
