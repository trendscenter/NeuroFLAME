import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import yaml from 'js-yaml';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface ComputationNotesDisplayProps {
    computationNotes: string;
}

interface YamlContent {
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

const extractYamlAndMarkdownContent = (markdown: string): { yamlContent: YamlContent; markdownContent: string } => {
    const yamlString = extractYamlString(markdown);
    const parsedYaml = parseYamlString(yamlString);
    const markdownContent = markdown.replace(YAML_REGEX, '').trim(); // Remove YAML front matter
    return { yamlContent: parsedYaml, markdownContent };
};

// YamlHeaderDisplay Component

const YamlHeaderDisplay: React.FC<{ yamlContent: YamlContent }> = ({ yamlContent }) => {
    if (!yamlContent || Object.keys(yamlContent).length === 0) {
        return null;
    }

    const renderers: { [key: string]: (value: any) => JSX.Element } = {
        repositoryUrl: (value) => (
            <p key="repositoryUrl">
                <strong>Repository:</strong> <a href={value} target="_blank" rel="noopener noreferrer">
                    {value}
                </a>
            </p>
        ),
        imageBuildSource: (value) => (
            <p key="imageBuildSource">
                <strong>Image Build Source:</strong> <a href={value} target="_blank" rel="noopener noreferrer">
                    {value}
                </a>
            </p>
        ),
        specialKey: (value) => (
            <div key="specialKey" style={{
                color: 'white',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                padding: '10px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                animation: 'glow 1.5s infinite alternate'
            }}>
                <strong>Special Key:</strong> {value}
            </div>
        ),
        // Add more special renderers here
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
            {Object.keys(yamlContent).map(key => (
                renderers[key] ? renderers[key](yamlContent[key]) : (
                    <p key={key}>
                        <strong>{key}:</strong> {yamlContent[key]}
                    </p>
                )
            ))}
        </div>
    );
};

// ComputationNotesDisplay Component

const ComputationNotesDisplay: React.FC<ComputationNotesDisplayProps> = ({ computationNotes }) => {
    const { yamlContent, markdownContent } = useMemo(() => extractYamlAndMarkdownContent(computationNotes), [computationNotes]);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', margin: '20px' }}>
            <YamlHeaderDisplay yamlContent={yamlContent} />
            <MarkdownContentDisplay markdownContent={markdownContent} />
        </div>
    );
};

// MarkdownContentDisplay Component

interface MarkdownContentDisplayProps {
    markdownContent: string;
}

const MarkdownContentDisplay: React.FC<MarkdownContentDisplayProps> = ({ markdownContent }) => (
    <div style={{ border: '1px solid black', padding: '10px', borderRadius: '5px', backgroundColor: '#fff' }}>
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks, remarkEmoji, remarkMath]}
            rehypePlugins={[rehypeKatex]}
        >
            {markdownContent}
        </ReactMarkdown>
    </div>
);

export default ComputationNotesDisplay;
