import { expect, it, describe } from "vitest";
import { TOKEN } from "../token/token";
import { Lexer } from "./lexer";

describe("lexer", () => {
  describe("basic", () => {
    const input = "=+(){},;";
    const l = new Lexer(input);

    it.each([
      [TOKEN.ASSIGN, "="],
      [TOKEN.PLUS, "+"],
      [TOKEN.LPAREN, "("],
      [TOKEN.RPAREN, ")"],
      [TOKEN.LBRACE, "{"],
      [TOKEN.RBRACE, "}"],
      [TOKEN.COMMA, ","],
      [TOKEN.SEMICOLON, ";"],
      [TOKEN.EOF, ""],
    ])("expected Type: '%s' Literal: '%s'", (tokenType, tokenLiteral) => {
      const token = l.nextToken();
      expect(token.type).toBe(tokenType);
      expect(token.literal).toBe(tokenLiteral);
    });
  });

  describe("function", () => {
    const input = `let five = 5;
let ten = 10
let add = fn(x,y) {
    x + y
};
let result = add(five, ten)
      `;
    const l = new Lexer(input);
    it.each([
      [TOKEN.LET, "let"],
      [TOKEN.IDENT, "five"],
      [TOKEN.ASSIGN, "="],
      [TOKEN.INT, "5"],
      [TOKEN.SEMICOLON, ";"],
      [TOKEN.LET, "let"],
      [TOKEN.IDENT, "ten"],
      [TOKEN.ASSIGN, "="],
      [TOKEN.INT, "10"],
      [TOKEN.LET, "let"],
      [TOKEN.IDENT, "add"],
      [TOKEN.ASSIGN, "="],
      [TOKEN.FUNCTION, "fn"],
      [TOKEN.LPAREN, "("],
      [TOKEN.IDENT, "x"],
      [TOKEN.COMMA, ","],

      [TOKEN.IDENT, "y"],
      [TOKEN.RPAREN, ")"],
      [TOKEN.LBRACE, "{"],
      [TOKEN.IDENT, "x"],
      [TOKEN.PLUS, "+"],
      [TOKEN.IDENT, "y"],
      [TOKEN.RBRACE, "}"],

      [TOKEN.SEMICOLON, ";"],
      [TOKEN.LET, "let"],
      [TOKEN.IDENT, "result"],
      [TOKEN.ASSIGN, "="],
      [TOKEN.IDENT, "add"],
      [TOKEN.LPAREN, "("],
      [TOKEN.IDENT, "five"],
      [TOKEN.COMMA, ","],
      [TOKEN.IDENT, "ten"],
      [TOKEN.RPAREN, ")"],
      [TOKEN.EOF, ""],
    ])("expected Type: '%s' Literal: '%s'", (tokenType, tokenLiteral) => {
      const token = l.nextToken();
      expect(token.type).toBe(tokenType);
      expect(token.literal).toBe(tokenLiteral);
    });
  });
  describe("single line token", () => {
    const input = `!-/*5;
5 < 10 > 5;
if(5 < 10) {
    return true;
} else {
    return false
};
    `;
    const l = new Lexer(input);

    it.each([
      [TOKEN.BANG, "!"],
      [TOKEN.MINUS, "-"],
      [TOKEN.SLASH, "/"],
      [TOKEN.ASTERISK, "*"],
      [TOKEN.INT, "5"],
      [TOKEN.SEMICOLON, ";"],
      [TOKEN.INT, "5"],
      [TOKEN.LT, "<"],
      [TOKEN.INT, "10"],
      [TOKEN.GT, ">"],
      [TOKEN.INT, "5"],
      [TOKEN.SEMICOLON, ";"],
      [TOKEN.IF, "if"],
      [TOKEN.LPAREN, "("],
      [TOKEN.INT, "5"],
      [TOKEN.LT, "<"],
      [TOKEN.INT, "10"],
      [TOKEN.RPAREN, ")"],
      [TOKEN.LBRACE, "{"],
      [TOKEN.RETURN, "return"],
      [TOKEN.TRUE, "true"],
      [TOKEN.SEMICOLON, ";"],
      [TOKEN.RBRACE, "}"],
      [TOKEN.ELSE, "else"],
      [TOKEN.LBRACE, "{"],
      [TOKEN.RETURN, "return"],
      [TOKEN.FALSE, "false"],
      [TOKEN.RBRACE, "}"],
      [TOKEN.SEMICOLON, ";"],
      [TOKEN.EOF, ""],
    ])("expected Type: '%s' Literal: '%s'", (tokenType, tokenLiteral) => {
      const token = l.nextToken();
      expect(token.type).toBe(tokenType);
      expect(token.literal).toBe(tokenLiteral);
    });
  });
  describe("multi line token", () => {
    const input = `10 == 10;
      10 != 9;
      `;
    const l = new Lexer(input);

    it.each([
      [TOKEN.INT, "10"],
      [TOKEN.EQ, "=="],
      [TOKEN.INT, "10"],
      [TOKEN.SEMICOLON, ";"],
      [TOKEN.INT, "10"],
      [TOKEN.NOT_EQ, "!="],
      [TOKEN.INT, "9"],
      [TOKEN.SEMICOLON, ";"],
      [TOKEN.EOF, ""],
    ])("expected Type: '%s' Literal: '%s'", (tokenType, tokenLiteral) => {
      const token = l.nextToken();
      expect(token.type).toBe(tokenType);
      expect(token.literal).toBe(tokenLiteral);
    });
  });
});
