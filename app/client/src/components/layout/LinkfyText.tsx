// LinkifyText.tsx
import React from "react";
import LinkifyIt from "linkify-it";
import tlds from "tlds";

const linkify = new LinkifyIt();
linkify.tlds(tlds);

interface LinkifyTextProps {
  text: string;
  style?: React.CSSProperties;
  linkStyle?: React.CSSProperties;
}

const LinkifyText: React.FC<LinkifyTextProps> = ({ text, style, linkStyle }) => {
  const matches = linkify.match(text);

  if (!matches) {
    return <span style={style}>{text}</span>;
  }

  const elements = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const startIndex = match.index;
    const endIndex = match.lastIndex;

    if (startIndex > lastIndex) {
      elements.push(<span key={lastIndex} style={style}>{text.substring(lastIndex, startIndex)}</span>);
    }

    elements.push(
      <a
        key={startIndex}
        href={match.url}
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
      >
        {match.text}
      </a>
    );

    lastIndex = endIndex;
  });

  if (lastIndex < text.length) {
    elements.push(<span key={lastIndex} style={style}>{text.substring(lastIndex)}</span>);
  }

  return <>{elements}</>;
};

export default LinkifyText;
