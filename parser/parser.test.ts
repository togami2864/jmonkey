import { expect, it, describe } from "vitest";
import { TOKEN } from "../token/token";
import { Lexer } from "../lexer/lexer";
import { Parser } from "./parser";
import { Statement } from "../ast/ast";

const testLetStatement = (s: Statement, expected) => {
  expect(
    s.token.literal,
    `s.token.literal not "let". got ${s.token.literal}`
  ).toBe("let");
  expect(
    s.name.value,
    `s.name.value not "${expected}". got ${s.name.value}`
  ).toBe(expected);
};

describe("lexer", () => {
  describe("basic", () => {
    const input = `let x = 5;
    let y = 10;
    let foobar = 838383;
    `;
    const l = new Lexer(input);
    const p = new Parser(l);

    const program = p.parseProgram();
    if (program === null) {
      throw new Error("parseProgram returned null");
    }

    if (program.statements.length !== 3) {
      throw new Error(
        `program.statements does not contain 3 statements. got=${program.statements.length}`
      );
    }

    it.each([
      [0, "x"],
      [1, "y"],
      [2, "foobar"],
    ])("expected Type: '%s' Literal: '%s'", (index, expectedIdent) => {
      const stmt = program.statements[index];
      testLetStatement(stmt, expectedIdent);
    });
  });
});
