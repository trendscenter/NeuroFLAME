import React from 'react';
import { useEffect, useState, useCallback } from "react";
import { ConfigurationForm } from './ConfigurationForm'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { JSONEditorPanel } from './JSONEditorPanel.jsx'

// Define custom styles
const customStyles = {
    labelBetween: {
        whiteSpace: 'nowrap',
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
    }
  };


export function CompConfigAdmin({ consortiumId, parameters, setEditableParams, setParameters }) {

    const [editMode, setEditMode] = useState(false);

    const [content, setContent] = useState({
        json: null,
        text: null
      });

    const handler = useCallback(
        (content) => {
            console.log(content);
            setContent(content);
            setEditableParams(JSON.stringify(content.json));
        },
        [content]
    )

    const enableEditor = () => {
        setEditMode(!editMode);
        setContent({
            json: JSON.parse(parameters),
            text: null  
        });
    }

    const saveParameters = () => {
        setParameters();
        setEditMode(!editMode);
    }

    return (
            <div style={{position: 'relative'}}>
                {!editMode && <IconButton style={{position: 'absolute', top: '-2.5rem', right: '0'}} onClick={enableEditor}><EditIcon fontSize="inherit" /></IconButton>}
                <div>
                    {editMode ? 
                    <JSONEditorPanel content={content} onChange={handler} /> :
                    <pre>
                        {typeof parameters === 'string' ? parameters : JSON.stringify(parameters)}
                    </pre>}
                </div>
                <div>
                    {editMode && <Button variant="contained" color="warning" style={{margin: '0.5rem', marginLeft: '0', marginTop: '1rem'}} onClick={() => { setEditMode(!editMode) }}>Cancel</Button>}
                    {editMode && <Button variant="contained" style={{margin: '0.5rem', marginLeft: '0', marginTop: '1rem'}} onClick={saveParameters}>Save</Button>}
                </div>
            </div>
    )
}
