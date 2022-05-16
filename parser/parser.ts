import {
  LetStatement,
  Identifier,
  Program,
  ReturnStatement,
  ExpressionStatement,
  IntegerLiteral,
  PrefixExpression,
  InfixExpression,
  Expression,
  Boolean,
} from "../ast/ast";
import { Lexer } from "../lexer/lexer";
import { TOKEN, Token, TokenType } from "../token/token";

namespace PRECEDENCE {
  export const LOWEST = 1;
  export const EQUALS = 2;
  export const LESSGREATER = 3;
  export const SUM = 4;
  export const PRODUCT = 5;
  export const PREFIX = 6;
  export const CALL = 7;
}

const precedences = new Map([
  [TOKEN.EQ, PRECEDENCE.EQUALS],
  [TOKEN.NOT_EQ, PRECEDENCE.EQUALS],
  [TOKEN.LT, PRECEDENCE.LESSGREATER],
  [TOKEN.GT, PRECEDENCE.LESSGREATER],
  [TOKEN.PLUS, PRECEDENCE.SUM],
  [TOKEN.MINUS, PRECEDENCE.SUM],
  [TOKEN.SLASH, PRECEDENCE.PRODUCT],
  [TOKEN.ASTERISK, PRECEDENCE.PRODUCT],
]);

export class Parser {
  l: Lexer;
  curToken: Token;
  peekToken: Token;
  prefixParseFns: Map<string, any> = new Map();
  infixParseFns: Map<string, any> = new Map();
  constructor(lexer: Lexer) {
    this.l = lexer;
    this.nextToken();
    this.nextToken();

    this.registerPrefix(TOKEN.IDENT, this.parseIdentifier);
    this.registerPrefix(TOKEN.INT, this.parseIntegerLiteral);
    this.registerPrefix(TOKEN.BANG, this.parsePrefixExpression);
    this.registerPrefix(TOKEN.MINUS, this.parsePrefixExpression);
    this.registerInfix(TOKEN.PLUS, this.parseInfixExpression);
    this.registerInfix(TOKEN.MINUS, this.parseInfixExpression);
    this.registerInfix(TOKEN.SLASH, this.parseInfixExpression);
    this.registerInfix(TOKEN.ASTERISK, this.parseInfixExpression);
    this.registerInfix(TOKEN.EQ, this.parseInfixExpression);
    this.registerInfix(TOKEN.NOT_EQ, this.parseInfixExpression);
    this.registerInfix(TOKEN.LT, this.parseInfixExpression);
    this.registerInfix(TOKEN.GT, this.parseInfixExpression);
    this.registerPrefix(TOKEN.TRUE, this.parseBool);
    this.registerPrefix(TOKEN.FALSE, this.parseBool);
  }

  registerPrefix(token, fn) {
    this.prefixParseFns.set(token, fn);
  }

  registerInfix(token, fn) {
    this.infixParseFns.set(token, fn);
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
    const prefix = this.prefixParseFns.get(this.curToken.type)?.bind(this);
    if (!prefix) {
      return null;
    }
    let leftExp = prefix();
    while (
      !this.peekTokenIs(TOKEN.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infix = this.infixParseFns.get(this.peekToken.type)?.bind(this);
      if (!infix) {
        return leftExp;
      }
      this.nextToken();
      leftExp = infix(leftExp);
    }
    return leftExp;
  }

  parseIdentifier() {
    return new Identifier(this.curToken, this.curToken.literal);
  }

  parseIntegerLiteral() {
    return new IntegerLiteral(this.curToken, Number(this.curToken.literal));
  }

  parseBool() {
    return new Boolean(this.curToken, this.curTokenIs(TOKEN.TRUE));
  }

  parsePrefixExpression() {
    const exp = new PrefixExpression(this.curToken, this.curToken.literal);
    this.nextToken();
    exp.right = this.parseExpression(PRECEDENCE.PREFIX);
    return exp;
  }

  parseInfixExpression(left: Expression) {
    const exp = new InfixExpression(this.curToken, this.curToken.literal, left);
    const precedence = this.curPrecedence();
    this.nextToken();
    exp.right = this.parseExpression(precedence);
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

  peekPrecedence() {
    if (precedences.has(this.peekToken.type)) {
      return precedences.get(this.peekToken.type);
    }
    return PRECEDENCE.LOWEST;
  }

  curPrecedence() {
    if (precedences.has(this.curToken.type)) {
      return precedences.get(this.curToken.type);
    }
    return PRECEDENCE.LOWEST;
  }
}
