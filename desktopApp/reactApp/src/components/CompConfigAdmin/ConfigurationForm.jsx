import React, { useState } from 'react'
import { JSONEditorPanel } from './JSONEditorPanel.jsx'

export function ConfigurationForm({ setField, formSpec, formData, compSpec, editing }) {

    const [content, setContent] = useState({
        json: formData,
        text: undefined
      });

    return (
        <div>
            {editing ? 
            <JSONEditorPanel content={content} onChange={setField} /> :
            <pre>
                {JSON.stringify(formData, null, 2)}
            </pre>}
        </div>
    )
}