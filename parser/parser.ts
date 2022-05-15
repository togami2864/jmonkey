import { LetStatement, Identifier, Program } from "../ast/ast";
import { Lexer } from "../lexer/lexer";
import { TOKEN, Token, TokenType } from "../token/token";

export class Parser {
  l: Lexer;
  curToken: Token;
  peekToken: Token;
  constructor(lexer: Lexer) {
    this.l = lexer;
    this.nextToken();
    this.nextToken();
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
      default:
        return null;
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
