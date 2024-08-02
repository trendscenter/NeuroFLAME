import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import yaml from 'js-yaml';
import remarkGfm from 'remark-gfm';
import remarkFootnotes from 'remark-footnotes';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface ComputationNotesDisplayProps {
    computationNotes: string;
}

interface YamlContent {
    repositoryUrl?: string;
    [key: string]: any;
}

// Utility Functions

const YAML_REGEX = /^---\n([\s\S]*?)\n---/;

const extractYamlString = (markdown: string): string => {
    const match = markdown.match(YAML_REGEX);
    return match ? match[1] : '';
};

const parseYamlString = (yamlString: string): YamlContent => {
    try {
        return yaml.load(yamlString) as YamlContent;
    } catch (error) {
        console.error('Error parsing YAML string:', error);
        return {};
    }
};

const extractYamlAndMarkdownContent = (markdown: string): { yamlContent: YamlContent; completeMarkdown: string } => {
    const yamlString = extractYamlString(markdown);
    const parsedYaml = parseYamlString(yamlString);
    return { yamlContent: parsedYaml, completeMarkdown: markdown };
};

// YamlHeaderDisplay Component

const YamlHeaderDisplay: React.FC<{ yamlContent: YamlContent }> = ({ yamlContent }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
            {yamlContent.repositoryUrl && (
                <p>
                    <strong>Repository:</strong> <a href={yamlContent.repositoryUrl} target="_blank" rel="noopener noreferrer">
                        {yamlContent.repositoryUrl}
                    </a>
                </p>
            )}
            {/* Add more keys to display as needed */}
        </div>
    );
};

// ComputationNotesDisplay Component

const ComputationNotesDisplay: React.FC<ComputationNotesDisplayProps> = ({ computationNotes }) => {
    const { yamlContent, completeMarkdown } = useMemo(() => extractYamlAndMarkdownContent(computationNotes), [computationNotes]);

    return (
        <div>
            <YamlHeaderDisplay yamlContent={yamlContent} />
            <MarkdownContentDisplay completeMarkdown={completeMarkdown} />
        </div>
    );
};

// MarkdownContentDisplay Component

interface MarkdownContentDisplayProps {
    completeMarkdown: string;
}

const MarkdownContentDisplay: React.FC<MarkdownContentDisplayProps> = ({ completeMarkdown }) => (
    <div style={{ border: "1px solid black" }}>
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks, remarkEmoji, remarkMath]}
            rehypePlugins={[rehypeKatex]}
        >
            {completeMarkdown}
        </ReactMarkdown>
    </div>
);

export default ComputationNotesDisplay;
