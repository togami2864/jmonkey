import { expect, it, describe } from "vitest";
import { TOKEN } from "../token/token";
import { Lexer } from "../lexer/lexer";
import { Parser } from "./parser";
import { ExpressionStatement, LetStatement, ReturnStatement } from "../ast/ast";

const testLetStatement = (s: LetStatement, expected) => {
  expect(
    s.token.literal,
    `s.token.literal not "let". got ${s.token.literal}`
  ).toBe("let");
  expect(
    s.name.value,
    `s.name.value not "${expected}". got ${s.name.value}`
  ).toBe(expected);
};

const testReturnStatement = (s: ReturnStatement, expected) => {
  expect(
    s.token.literal,
    `s.token.literal not "let". got ${s.token.literal}`
  ).toBe("return");
};

describe("parser", () => {
  describe("let", () => {
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
      //  @ts-ignore
      testLetStatement(stmt, expectedIdent);
    });
  });
  describe("return", () => {
    const input = `return 5;
      return 10;
      return 838383;
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
      //  @ts-ignore
      testReturnStatement(stmt, expectedIdent);
    });
  });
  describe("identifier expression", () => {
    const input = `foobar;`;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    if (program.statements.length !== 1) {
      throw new Error(
        `program should have one statement, but has ${program.statements.length}`
      );
    }
    it("", () => {
      const stmt = program.statements[0];
      // @ts-ignore
      expect(stmt.expression.value).toBe("foobar");
    });
  });
  describe("Integer literal expression", () => {
    const input = `5;`;
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    if (program.statements.length !== 1) {
      throw new Error(
        `program should have one statement, but has ${program.statements.length}`
      );
    }
    it("basic", () => {
      const stmt = program.statements[0];
      // @ts-ignore
      expect(stmt.expression.value).toBe(5);
    });
  });
  describe("Prefix expression", () => {
    it.each([["!5", "!", 5]])("", (input, ope, value) => {
      const l = new Lexer(input);
      const p = new Parser(l);
      const program = p.parseProgram();
      if (program.statements.length !== 1) {
        throw new Error(
          `program should have one statement, but has ${program.statements.length}`
        );
      }
      const stmt = program.statements[0];
      // @ts-ignore
      expect(stmt.expression.operator).toBe(ope);
      // @ts-ignore
      expect(stmt.expression.right.value).toBe(value);
    });
  });
  describe("Infix expression", () => {
    it.each([
      ["5 + 5;", 5, "+", 5],
      ["5 - 5;", 5, "-", 5],
      ["5 * 5;", 5, "*", 5],
      ["5 / 5;", 5, "/", 5],
      ["5 > 5;", 5, ">", 5],
      ["5 < 5;", 5, "<", 5],
      ["5 == 5;", 5, "==", 5],
      ["5 != 5;", 5, "!=", 5],
    ])("%s", (input, left, ope, right) => {
      const l = new Lexer(input);
      const p = new Parser(l);
      const program = p.parseProgram();
      if (program.statements.length !== 1) {
        throw new Error(
          `program should have one statement, but has ${program.statements.length}`
        );
      }
      const stmt = program.statements[0];
      // @ts-ignore
      expect(stmt.expression.operator).toBe(ope);
      // @ts-ignore
      expect(stmt.expression.right.value).toBe(right);
      // @ts-ignore
      expect(stmt.expression.left.value).toBe(right);
    });
  });
});
