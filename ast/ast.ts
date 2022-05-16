import { Token, TOKEN } from "../token/token";

interface Node {
  tokenLiteral: () => string;
  string(): () => string;
}

export type Statement = LetStatement | ReturnStatement | ExpressionStatement;

export type Expression = Identifier | PrefixExpression;

export class Program {
  statements: Statement[];
  constructor() {
    this.statements = [];
  }

  string() {
    const buf = [];
    for (const stmt of this.statements) {
      buf.push(stmt.string());
    }
    return buf.join("");
  }
}

export class LetStatement {
  token: Token;
  name: Identifier;
  value: Expression;
  constructor(token) {
    this.token = token;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    const buf = [];
    buf.push(this.tokenLiteral() + " ");
    buf.push(this.name.string());
    buf.push(" = ");
    if (this.value !== null) {
      buf.push(this.value.string());
    }
    buf.push(";");
    return buf.join("");
  }
}

export class ReturnStatement {
  token: Token;
  returnValue: Expression;
  constructor(token: Token) {
    this.token = token;
  }

  tokenLiteral() {
    return this.token.literal;
  }
  string() {
    const buf = [];
    buf.push(this.tokenLiteral() + " ");
    if (this.returnValue !== null) {
      buf.push(this.returnValue.string());
    }
    buf.push(";");
    return buf.join("");
  }
}

export class ExpressionStatement {
  token: Token;
  expression: Expression;
  constructor(token: Token) {
    this.token = token;
  }

  string() {
    if (this.expression !== null) {
      return this.expression.string();
    }
    return "";
  }
}

export class Identifier {
  token: Token;
  value: string;
  constructor(token, value) {
    this.token = token;
    this.value = value;
  }
  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    return this.value;
  }
}

export class IntegerLiteral {
  token: Token;
  value: number;
  constructor(token, value) {
    this.token = token;
    this.value = value;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    return this.token.literal;
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

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    const buf = [];
    buf.push("(");
    buf.push(this.operator);
    buf.push(this.right.string());
    buf.push(")");
    return buf.join("");
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

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    let buf = [];
    buf.push("(");
    buf.push(this.left.string());
    buf.push(" " + this.operator + " ");
    buf.push(this.right.string());
    buf.push(")");
    return buf.join("");
  }
}

export class Boolean {
  token: Token;
  value: boolean;
  constructor(token, value) {
    this.token = token;
    this.value = value;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    return this.token.literal;
  }
}

export class IfExpression {
  token: Token;
  condition: Expression;
  consequence: BlockStatement;
  alternative: BlockStatement;

  constructor(token) {
    this.token = token;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    const buf = [];
    buf.push("if");
    buf.push(this.condition.string());
    buf.push(" ");
    buf.push(this.consequence.string());

    if (this.alternative) {
      buf.push("else ");
      buf.push(this.alternative.string());
    }

    return buf.join("");
  }
}

export class BlockStatement {
  token: Token;
  statements: Statement[];
  constructor(token) {
    this.token = token;
  }

  tokenLiteral() {
    this.token.literal;
  }

  string() {
    const buf = [];
    for (const stmt of this.statements) {
      buf.push(stmt.string());
    }
    return buf.join("");
  }
}
