export type TokenType = string;

export interface Token {
  type: TokenType;
  literal: string;
}

export namespace TOKEN {
  export const ILLEGAL = "ILLEGAL";
  export const EOF = "EOF";

  export const IDENT = "IDENT";
  export const INT = "INT";

  export const ASSIGN = "=";
  export const PLUS = "+";
  export const MINUS = "-";
  export const ASTERISK = "*";
  export const SLASH = "/";

  export const BANG = "!";

  export const LT = "<";
  export const GT = ">";

  export const COMMA = ",";
  export const SEMICOLON = ";";

  export const LPAREN = "(";
  export const RPAREN = ")";
  export const LBRACE = "{";
  export const RBRACE = "}";

  export const EQ = "==";
  export const NOT_EQ = "!=";

  export const FUNCTION = "FUNCTION";
  export const LET = "LET";
  export const TRUE = "TRUE";
  export const FALSE = "FALSE";
  export const IF = "IF";
  export const ELSE = "ELSE";
  export const RETURN = "RETURN";
}

export const keywords = new Map([
  ["fn", TOKEN.FUNCTION],
  ["let", TOKEN.LET],
  ["true", TOKEN.TRUE],
  ["false", TOKEN.FALSE],
  ["if", TOKEN.IF],
  ["else", TOKEN.ELSE],
  ["return", TOKEN.RETURN],
]);

export const lookupIdent = (literal) => {
  if (keywords.has(literal)) {
    return keywords.get(literal);
  }
  return TOKEN.IDENT;
};
