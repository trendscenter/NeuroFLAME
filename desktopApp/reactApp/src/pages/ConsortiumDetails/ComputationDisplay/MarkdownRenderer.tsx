import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
    children: ReactNode;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children }) => {
    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const url = event.currentTarget.href;
        console.log("Link clicked:", url);

        // Open the link in a new, smaller, and positioned window to avoid overlapping
        window.open(
            url,
            '_blank',
            'noopener,noreferrer,width=800,height=600,left=100,top=100'
        );
    };

    return (
        <ReactMarkdown
            components={{
                a: ({ node, ...props }) => (
                    <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                    >
                        {props.children}
                    </a>
                ),
            }}
        >
            {children as string}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
