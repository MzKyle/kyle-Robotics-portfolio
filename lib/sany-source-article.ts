import { Marked, type Token, type Tokens } from "marked";
import sourceMarkdown from "../add_res/系统设计_---_基于运动相位的时间域稳像设计.md?raw";
import englishMarkdown from "./content/sany-temporal-stabilization.en.md?raw";

export const sourceArticleMarkdown = sourceMarkdown;

export const articleMarkdown = new Marked({ gfm: true, breaks: true }, {
  extensions: [
    {
      name: "sourceMathBlock", level: "block",
      start(src) { return src.match(/^\$\$/m)?.index; },
      tokenizer(src) {
        const match = /^\$\$([\s\S]*?)\$\$(?:[^\S\n]*\n|$)/.exec(src);
        if (match) return { type: "sourceMathBlock", raw: match[0], text: match[1].trim() };
      },
    },
    {
      name: "sourceMathInline", level: "inline",
      start(src) { return src.indexOf("$"); },
      tokenizer(src) {
        const match = /^\$([^$\n]+?)\$/.exec(src);
        if (match) return { type: "sourceMathInline", raw: match[0], text: match[1] };
      },
    },
    {
      name: "sourceImage", level: "inline",
      start(src) { return src.indexOf("!["); },
      tokenizer(src) {
        const match = /^!\[([^\]]*)\]\((https:\/\/[^\s)]+)(?:\s+=\d+x)?\)/.exec(src);
        if (match) return { type: "sourceImage", raw: match[0], text: match[1], href: match[2] };
      },
    },
  ],
});

export type SourceSection = { title: string; tokens: Token[] };
export type SourceArticle = { abstract: Token[]; sections: SourceSection[] };

export function parseSourceArticle(markdown: string): SourceArticle {
  const article: SourceArticle = { abstract: [], sections: [] };
  for (const token of articleMarkdown.lexer(markdown)) {
    if (token.type === "heading" && (token as Tokens.Heading).depth === 2) {
      article.sections.push({ title: (token as Tokens.Heading).text, tokens: [] });
    } else {
      const section = article.sections[article.sections.length - 1];
      (section ? section.tokens : article.abstract).push(token);
    }
  }
  if (article.sections.length !== 9) throw new Error("The SANY article must retain eight chapters and its conclusion.");
  return article;
}

export const sourceArticle = {
  zh: parseSourceArticle(sourceMarkdown),
  en: parseSourceArticle(englishMarkdown),
};

export const sourceArticleImages = {
  "https://i-blog.csdnimg.cn/direct/db125dd58305489496e216f39efe5997.png": {
    src: "/images/sany-article/phase-selection.png", width: 1672, height: 941,
    caption: { zh: "原文示意图：从连续摆动图像流中抽取关键相位帧。", en: "Source illustration: extract key-phase frames from a continuously oscillating image stream." },
  },
  "https://i-blog.csdnimg.cn/direct/28b75a6d77fc4ee3b7c95c3483dd7d46.png": {
    src: "/images/sany-article/phase-consistent-sequence.png", width: 1672, height: 941,
    caption: { zh: "原文示意图：不同摆弧周期中保留同一相位的关键帧序列。", en: "Source illustration: retain a same-phase key-frame sequence across weave cycles." },
  },
} as const;
