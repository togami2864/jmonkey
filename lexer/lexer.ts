import { lookupIdent, Token, TokenType } from "../token/token";
import { TOKEN } from "../token/token";

export class Lexer {
  input: string;
  position: number = 0;
  readPosition: number = 0;
  ch: string = "";
  constructor(input) {
    this.input = input;
    this.readChar();
  }

  readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = "0";
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  readIdentifier() {
    const start = this.position;
    while (isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.slice(start, this.position);
  }

  readNumber() {
    const start = this.position;
    while (isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.slice(start, this.position);
  }

  skipWhitespace() {
    while (
      this.ch === " " ||
      this.ch === "\t" ||
      this.ch === "\n" ||
      this.ch === "\r"
    ) {
      this.readChar();
    }
  }

  nextToken() {
    let token: Token;
    this.skipWhitespace();
    switch (this.ch) {
      case "=":
        token = newToken(TOKEN.ASSIGN, this.ch);
        break;
      case ";":
        token = newToken(TOKEN.SEMICOLON, this.ch);
        break;
      case "(":
        token = newToken(TOKEN.LPAREN, this.ch);
        break;
      case ")":
        token = newToken(TOKEN.RPAREN, this.ch);
        break;
      case "{":
        token = newToken(TOKEN.LBRACE, this.ch);
        break;
      case "}":
        token = newToken(TOKEN.RBRACE, this.ch);
        break;
      case ",":
        token = newToken(TOKEN.COMMA, this.ch);
        break;
      case "+":
        token = newToken(TOKEN.PLUS, this.ch);
        break;
      case "0":
        token = newToken(TOKEN.EOF, "");
        break;
      default:
        if (isLetter(this.ch)) {
          const literal = this.readIdentifier();
          return newToken(lookupIdent(literal), literal);
        } else if (isDigit(this.ch)) {
          const literal = this.readNumber();
          return newToken(TOKEN.INT, literal);
        } else {
          token = newToken(TOKEN.ILLEGAL, this.ch);
        }
    }
    this.readChar();
    return token;
  }
}

const newToken = (type: TokenType, literal: string): Token => {
  return {
    type,
    literal,
  };
};

const isLetter = (ch: string): boolean => {
  return ("a" <= ch && ch <= "z") || ("A" <= ch && ch <= "Z") || ch === "_";
};

const isDigit = (ch: string) => {
  return "0" <= ch && ch <= "9";
};
