import React from 'react';
import { useEffect, useState, useCallback } from "react";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from  '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import TerminalIcon from '@mui/icons-material/Terminal';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import WarningIcon from '@mui/icons-material/Warning';
import TextareaAutosize from 'react-textarea-autosize';
import { JSONEditorPanel } from './JSONEditorPanel.jsx';

// Define custom styles
const customStyles = {
    labelBetween: {
        whiteSpace: 'nowrap',
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
    }
  };

export function CompConfig({ parameters, setEditableParams, setParameters }) {

    const [editMode, setEditMode] = useState(false);
    const [valid, setValid] = useState(false);
    const [content, setContent] = useState({ json: JSON.parse(parameters) });

    const saveParameters = () => {
        setEditMode(!editMode);
        setParameters();
    }

    const validateParameters = (parameters) => {
        try {
            JSON.parse(parameters);
            setValid(true);
        } catch (e) {
            setValid(false);
        }
    }

    const handleParamChange = (parameters) => {
        setEditableParams(parameters);
        try {
            JSON.parse(parameters);
            setContent({ json: JSON.parse(parameters) });
        } catch (e) {
            setValid(false);
        }
    }

    const JSONHandler = useCallback(
        (content) => {
            setContent(content.json);
            setEditableParams(JSON.stringify(content.json));
        },
        [content]
    )

    useEffect(() => {
        validateParameters(parameters);
    });

    return (
            <div style={{position: 'relative'}}>
                {editMode ?
                <IconButton style={{position: 'absolute', top: '-2.5rem', right: '0'}} onClick={() => setEditMode(!editMode)}>
                    <WysiwygIcon fontSize="inherit" />
                </IconButton> :
                <IconButton style={{position: 'absolute', top: '-2.5rem', right: '0'}} onClick={() => setEditMode(!editMode)}>
                    <TerminalIcon fontSize="inherit" />
                </IconButton>}
                <div>
                    {editMode && parameters ? 
                    <div>
                        <JSONEditorPanel content={content} onChange={JSONHandler} />
                        <div style={{position: 'absolute', bottom: '0.5rem', right: '0.5rem' }}>
                            <SaveIcon style={{color: 'grey', marginRight: '0.24rem'}} onClick={saveParameters} /> 
                        </div>
                    </div> :
                    <div>
                    <TextareaAutosize minRows="5" className="pre" contenteditable='true' style={{width: '100%'}} onChange={(e) => handleParamChange(e.target.value)}>
                        {parameters}
                    </TextareaAutosize>
                    <div style={{position: 'absolute', top: '1rem', right: '0.5rem' }}>
                        {valid ? 
                            <CheckCircleIcon style={{color: 'lightgreen'}} /> : 
                            <WarningIcon style={{color: 'pink'}} />
                        }
                    </div>
                    <div style={{position: 'absolute', bottom: '1.5rem', right: '0.5rem' }}>
                        {valid && <SaveIcon style={{color: 'lightgrey'}} onClick={saveParameters} />} 
                    </div>
                    </div>}
                </div>
            </div>
    )
}
