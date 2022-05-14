import { Lexer } from "../lexer/lexer";
import { TOKEN } from "../token/token";
export const run = (src: string) => {
  const l = new Lexer(src);
  let token = l.nextToken();
  while (token.type !== TOKEN.EOF) {
    console.log(token);
    token = l.nextToken();
  }
  return;
};
