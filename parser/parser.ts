import {
  LetStatement,
  Identifier,
  Program,
  ReturnStatement,
  ExpressionStatement,
  IntegerLiteral,
  PrefixExpression,
} from "../ast/ast";
import { Lexer } from "../lexer/lexer";
import { TOKEN, Token, TokenType } from "../token/token";

namespace PRECEDENCE {
  export const LOWEST = 1;
  const EQUALS = 2;
  const LESSGREATER = 3;
  const SUM = 4;
  const PRODUCT = 5;
  export const PREFIX = 6;
  const CALL = 7;
}

export class Parser {
  l: Lexer;
  curToken: Token;
  peekToken: Token;
  prefixParseFns: Map<string, any> = new Map();
  constructor(lexer: Lexer) {
    this.l = lexer;
    this.nextToken();
    this.nextToken();

    this.registerPrefix(TOKEN.IDENT, this.parseIdentifier);
    this.registerPrefix(TOKEN.INT, this.parseIntegerLiteral);
    this.registerPrefix(TOKEN.BANG, this.parsePrefixExpression);
    this.registerPrefix(TOKEN.MINUS, this.parsePrefixExpression);
  }

  registerPrefix(token, fn) {
    this.prefixParseFns.set(token, fn);
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  parseProgram() {
    const program = new Program();
    while (this.curToken.type !== TOKEN.EOF) {
      const stmt = this.parseStatement();
      if (stmt !== null) {
        program.statements.push(stmt);
      }
      this.nextToken();
    }
    return program;
  }

  parseStatement() {
    switch (this.curToken.type) {
      case TOKEN.LET:
        return this.parseLetStatement();
      case TOKEN.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  parseLetStatement() {
    const stmt = new LetStatement(this.curToken);
    if (!this.expectPeek(TOKEN.IDENT)) {
      return null;
    }
    stmt.name = new Identifier(this.curToken, this.curToken.literal);
    if (!this.expectPeek(TOKEN.ASSIGN)) {
      return null;
    }

    while (!this.curTokenIs(TOKEN.SEMICOLON)) {
      this.nextToken();
    }
    return stmt;
  }

  parseReturnStatement() {
    const stmt = new ReturnStatement(this.curToken);
    this.nextToken();
    while (!this.curTokenIs(TOKEN.SEMICOLON)) {
      this.nextToken();
    }
    return stmt;
  }

  parseExpressionStatement() {
    const stmt = new ExpressionStatement(this.curToken);
    stmt.expression = this.parseExpression(PRECEDENCE.LOWEST);
    if (this.peekTokenIs(TOKEN.SEMICOLON)) {
      this.nextToken();
    }
    return stmt;
  }

  parseExpression(precedence) {
    const prefix = this.prefixParseFns.get(this.curToken.type).bind(this);
    if (prefix === null) {
      return null;
    }
    const leftExp = prefix();
    return leftExp;
  }

  parseIdentifier() {
    return new Identifier(this.curToken, this.curToken.literal);
  }

  parseIntegerLiteral() {
    return new IntegerLiteral(this.curToken, Number(this.curToken.literal));
  }

  parsePrefixExpression() {
    const exp = new PrefixExpression(this.curToken, this.curToken.literal);
    this.nextToken();
    exp.right = this.parseExpression(PRECEDENCE.PREFIX);
    return exp;
  }

  curTokenIs(t: TokenType) {
    return this.curToken.type === t;
  }

  peekTokenIs(t: TokenType) {
    return this.peekToken.type === t;
  }

  expectPeek(t: TokenType) {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    }
    return false;
  }
}
