import React from 'react';

interface SimpleMarkdownProps {
    content: string;
}

export const SimpleMarkdown: React.FC<SimpleMarkdownProps> = ({ content }) => {
    if (!content) return null;

    // Pre-process content to fix missing newlines from API
    let normalizedContent = content;

    // Fix: "Header * Bullet" -> "Header\n* Bullet"
    // We look for " * " or " - " that is NOT at the start of a line
    normalizedContent = normalizedContent.replace(/([^\n])\s+([\*\-]\s)/g, '$1\n$2');

    // Fix: "Text **Step 1:**" -> "Text\n\n**Step 1:**"
    normalizedContent = normalizedContent.replace(/([^\n])\s+(\*\*?Step\s+\d+)/gi, '$1\n\n$2');

    // Fix: "Text Step 1:" (no bold)
    normalizedContent = normalizedContent.replace(/([^\n])\s+(Step\s+\d+[:.])/gi, '$1\n\n$2');

    // Fix: "Text ### Header" -> "Text\n\n### Header"
    normalizedContent = normalizedContent.replace(/([^\n])\s+(#{1,6}\s)/g, '$1\n\n$2');

    // Split by double newlines for paragraphs/blocks
    const blocks = normalizedContent.split(/\n\n+/);

    const formatText = (text: string) => {
        let content = text;
        // Inject emojis
        content = content.replace(/\b(Warning|Caution|Danger)\b/g, '⚠️ $1');
        content = content.replace(/\b(Note|Tip)\b/g, '💡 $1');
        content = content.replace(/\b(Tools? Required)\b/i, '🧰 $1');
        return parseInline(content);
    };

    return (
        <div className="space-y-4 text-slate-700 leading-relaxed">
            {blocks.map((block, index) => {
                // Headers (### or ## or #)
                if (/^#{1,6}\s/.test(block)) {
                    const level = block.match(/^#{1,6}/)?.[0].length || 0;
                    const text = block.replace(/^#{1,6}\s/, '');
                    const Component = `h${Math.min(level + 2, 6)}` as keyof JSX.IntrinsicElements;
                    return <Component key={index} className="font-bold text-slate-900 mt-6 mb-2">{formatText(text)}</Component>;
                }

                // Bold Headers (e.g. **Step 1**)
                if (/^\*\*.*?\*\*\s*$/.test(block)) {
                    const cleanText = block.replace(/^\*\*/, '').replace(/\*\*\s*$/, '');
                    return <h3 key={index} className="font-bold text-slate-900 mt-6 mb-3 text-lg">{formatText(cleanText)}</h3>;
                }

                // Explicit "Step X:" lines (even without bold)
                // If a block consists mainly of a Step instruction, format it nicely
                if (/^Step\s*\d+[:.]/i.test(block)) {
                    const cleanText = block.replace(/^Step\s*\d+[:.]\s*/i, '');
                    const stepNumMatch = block.match(/^Step\s*(\d+)/i);
                    const stepNum = stepNumMatch ? stepNumMatch[1] : '';

                    return (
                        <div key={index} className="flex gap-4 mt-4 mb-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-sm font-semibold text-green-700">{stepNum}</span>
                            </div>
                            <div className="pt-2">
                                <strong className="block text-slate-900 mb-1">Step {stepNum}</strong>
                                <p>{formatText(cleanText)}</p>
                            </div>
                        </div>
                    );
                }

                // List items (bullet points)
                if (block.split('\n').some(line => /^[\*\-]\s/.test(line))) {
                    const items = block.split('\n').filter(line => line.trim().length > 0);
                    return (
                        <ul key={index} className="list-disc pl-5 space-y-2 my-4">
                            {items.map((item, i) => {
                                const cleanItem = item.replace(/^[\*\-]\s/, '');
                                return <li key={i}>{formatText(cleanItem)}</li>;
                            })}
                        </ul>
                    );
                }

                // Numbered lists
                if (block.split('\n').some(line => /^\d+\.\s/.test(line))) {
                    const items = block.split('\n').filter(line => line.trim().length > 0);
                    return (
                        <ol key={index} className="list-decimal pl-5 space-y-2 my-4">
                            {items.map((item, i) => {
                                const cleanItem = item.replace(/^\d+\.\s/, '');
                                return <li key={i}>{formatText(cleanItem)}</li>;
                            })}
                        </ol>
                    );
                }

                // Regular paragraph with newline handling
                return (
                    <p key={index} className="mb-4">
                        {block.split('\n').map((line, i, arr) => (
                            <React.Fragment key={i}>
                                {formatText(line)}
                                {i < arr.length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </p>
                );
            })}
        </div>
    );
};

// Helper for inline styles like **bold**
const parseInline = (text: string): React.ReactNode => {
    // Match **bold** (allowing newlines inside)
    const parts = text.split(/(\*\*[\s\S]*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};
