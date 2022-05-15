import { Token, TOKEN } from "../token/token";

interface Node {
  tokenLiteral: string;
}

export type Statement = LetStatement | ReturnStatement | ExpressionStatement;

export type Expression = Identifier | PrefixExpression;

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

export class IntegerLiteral {
  token: Token;
  value: number;
  constructor(token, value) {
    this.token = token;
    this.value = value;
  }
}

export class PrefixExpression {
  token: Token;
  operator: string;
  right: Expression;
  constructor(token, op) {
    this.token = token;
    this.operator = op;
  }
}

export class InfixExpression {
  token: Token;
  operator: string;
  left: Expression;
  right: Expression;
  constructor(token: Token, operator: string, left: Expression) {
    this.token = token;
    this.operator = operator;
    this.left = left;
  }
}
