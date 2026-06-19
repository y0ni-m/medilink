import type { Block } from '@/lib/resources';

export default function PostBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="post-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return <h2 key={i}>{block.text}</h2>;
          case 'p':
            return <p key={i}>{block.text}</p>;
          case 'ul':
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case 'quote':
            return <blockquote key={i}>{block.text}</blockquote>;
          default:
            return null;
        }
      })}
    </div>
  );
}
