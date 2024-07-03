import React from 'react';
import { useEffect, useState, useCallback } from "react";
import { ConfigurationForm } from './ConfigurationForm.jsx'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TerminalIcon from '@mui/icons-material/Terminal';
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

export function CompConfigAdmin({ consortiumId, parameters, setEditableParams, setParameters }) {

    const [editMode, setEditMode] = useState(false);
    const [valid, setValid] = useState(false);

    const [content, setContent] = useState({
        json: null,
        text: null
      });

    const handler = useCallback(
        (content) => {
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
        setEditMode(!editMode);
        setParameters();
    }

    const validateParameters = (str) => {
        try {
            JSON.parse(str);
            setValid(true);
        } catch (e) {
            setValid(false);
        }
    }

    const getPrettyParameters = (parameters) => {
        let newParameters = "";
        if(parameters && typeof parameters === 'string'){
            newParameters = JSON.stringify(JSON.parse(parameters), null, 2)
        }else{
            newParameters = JSON.stringify(parameters, null, 2)
        }
        if(newParameters){
            return newParameters;
        }
    }

    const handleParamChange = (parameters) => {
        validateParameters(parameters);
    }

    // useEffect(() => {
    //     setTimeout(() => {
    //         validateParameters(parameters);
    //     }, 1000);
    // });

    return (
            <div style={{position: 'relative'}}>
                {!editMode && <IconButton style={{position: 'absolute', top: '-2.5rem', right: '0'}} onClick={enableEditor}><TerminalIcon fontSize="inherit" /></IconButton>}
                <div>
                    {editMode && parameters ? 
                    <JSONEditorPanel content={content} onChange={handler} /> :
                    <TextareaAutosize className="pre" contenteditable='true' style={{width: '100%'}} onChange={(e) => handleParamChange(e.target.value)}>{getPrettyParameters(parameters)}</TextareaAutosize>}
                    <div style={{position: 'absolute', bottom: '1.5rem', right: '0.5rem' }}>{valid ? <CheckCircleIcon style={{color: 'lightgreen'}} /> : <WarningIcon style={{color: 'pink'}} />}</div>
                </div>
                <div>
                    {editMode && <Button variant="contained" color="warning" style={{margin: '0.5rem', marginLeft: '0', marginTop: '1rem'}} onClick={() => { setEditMode(!editMode) }}>Cancel</Button>}
                    {editMode && <Button variant="contained" style={{margin: '0.5rem', marginLeft: '0', marginTop: '1rem'}} onClick={saveParameters}>Save</Button>}
                </div>
            </div>
    )
}
