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

  export const COMMA = ",";
  export const SEMICOLON = ";";

  export const LPAREN = "(";
  export const RPAREN = ")";
  export const LBRACE = "{";
  export const RBRACE = "}";

  export const FUNCTION = "FUNCTION";
  export const LET = "LET";
}

export const keywords = new Map([
  ["fn", TOKEN.FUNCTION],
  ["let", TOKEN.LET],
]);

export const lookupIdent = (literal) => {
  if (keywords.has(literal)) {
    return keywords.get(literal);
  }
  return TOKEN.IDENT;
};
