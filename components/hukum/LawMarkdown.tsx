import Link from "next/link";
import type { ReactNode } from "react";

type Token =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string }
  | { type: "bold"; value: string }
  | { type: "code"; value: string };

function parseInline(value: string): Token[] {
  const tokens: Token[] = [];
  let buffer = "";
  let cursor = 0;

  const flushBuffer = () => {
    if (!buffer) return;
    tokens.push({ type: "text", value: buffer });
    buffer = "";
  };

  while (cursor < value.length) {
    const char = value[cursor];

    if (char === "`") {
      const end = value.indexOf("`", cursor + 1);
      if (end > cursor + 1) {
        flushBuffer();
        tokens.push({ type: "code", value: value.slice(cursor + 1, end) });
        cursor = end + 1;
        continue;
      }
    }

    if (char === "*" && value[cursor + 1] === "*") {
      const end = value.indexOf("**", cursor + 2);
      if (end > cursor + 2) {
        flushBuffer();
        tokens.push({ type: "bold", value: value.slice(cursor + 2, end) });
        cursor = end + 2;
        continue;
      }
    }

    if (char === "[") {
      const labelEnd = value.indexOf("]", cursor + 1);
      const hasParen = value[labelEnd + 1] === "(";
      if (labelEnd > cursor + 1 && hasParen) {
        const hrefEnd = value.indexOf(")", labelEnd + 2);
        if (hrefEnd > labelEnd + 2) {
          const label = value.slice(cursor + 1, labelEnd);
          const href = value.slice(labelEnd + 2, hrefEnd);
          flushBuffer();
          tokens.push({ type: "link", label, href });
          cursor = hrefEnd + 1;
          continue;
        }
      }
    }

    buffer += char;
    cursor += 1;
  }

  flushBuffer();
  return tokens;
}

function renderInline(value: string): ReactNode[] {
  return parseInline(value).map((token, index) => {
    if (token.type === "text") return <span key={index}>{token.value}</span>;
    if (token.type === "bold") return <strong key={index}>{token.value}</strong>;
    if (token.type === "code") {
      return (
        <code
          key={index}
          className="rounded bg-slate-200/80 px-1 py-0.5 text-[13px] dark:bg-slate-700/70"
        >
          {token.value}
        </code>
      );
    }

    const safeHref =
      token.href.startsWith("http://") || token.href.startsWith("https://");
    if (!safeHref) return <span key={index}>{token.label}</span>;

    return (
      <Link
        key={index}
        href={token.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-700 underline underline-offset-2 dark:text-cyan-300"
      >
        {token.label}
      </Link>
    );
  });
}

export function LawMarkdown({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);
  const elements: ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`list-${elements.length}`} className="list-disc space-y-1 pl-5">
        {listBuffer.map((item, index) => (
          <li key={index}>{renderInline(item)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flushList();
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuffer.push(line.slice(2).trim());
      continue;
    }

    flushList();

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${elements.length}`} className="text-base font-semibold">
          {renderInline(line.slice(4))}
        </h3>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${elements.length}`} className="text-lg font-semibold">
          {renderInline(line.slice(3))}
        </h2>
      );
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${elements.length}`} className="text-xl font-bold">
          {renderInline(line.slice(2))}
        </h1>
      );
      continue;
    }

    elements.push(
      <p key={`p-${elements.length}`} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
  }

  flushList();

  return <div className="law-md space-y-2">{elements}</div>;
}

