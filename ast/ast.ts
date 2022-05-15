import { Token, TOKEN } from "../token/token";

interface Node {
  tokenLiteral: string;
}

export type Statement = LetStatement | ReturnStatement | ExpressionStatement;

export type Expression = Identifier;

export class Program {
  statements: Statement[];
  constructor() {
    this.statements = [];
  }
}

export class LetStatement {
  token: Token;
  name: Identifier;
  value: Expression;
  constructor(token) {
    this.token = token;
  }
}

export class ReturnStatement {
  token: Token;
  returnValue: Expression;
  constructor(token: Token) {
    this.token = token;
  }
}

export class ExpressionStatement {
  token: Token;
  expression: Expression;
  constructor(token: Token) {
    this.token = token;
  }
}

export class Identifier {
  token: Token;
  value: string;
  constructor(token, value) {
    this.token = token;
    this.value = value;
  }
}
