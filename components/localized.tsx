import type { LocalizedText } from "../lib/portfolio";

export function Localized({ text }: { text: LocalizedText }) {
  return (
    <>
      <span className="lang-zh">{text.zh}</span>
      <span className="lang-en">{text.en}</span>
    </>
  );
}

export function T({ zh, en }: LocalizedText) {
  return <Localized text={{ zh, en }} />;
}
