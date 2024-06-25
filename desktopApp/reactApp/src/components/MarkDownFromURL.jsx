import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function MarkDownFromURL(props) {
    const { url } = props;
    const [text, setText] = useState('');

    useEffect(() => {
        fetch(url.replace('github.com','raw.githubusercontent.com')+'/main/README.md')
        .then((response) => response.text())
        .then((md) => {
            setText(md)
        })
        .catch(error => {
            setText('No Repo or Readme file present');
          });
    }, [url])

    return (
        <div className="markdown-wrapper">
            <ReactMarkdown children={text} />
        </div>
    )
}