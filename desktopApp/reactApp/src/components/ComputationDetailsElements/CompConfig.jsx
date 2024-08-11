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

export function CompConfig({ parameters, setEditableParams, setParameters, isLeader }) {

    const [editMode, setEditMode] = useState(false);
    const [valid, setValid] = useState(false);
    const [content, setContent] = useState({ json: null });
    const [ogParameters, setOGParameters] = useState(parameters);
    const [paramChange, setParamChange] = useState(false);

    const saveParameters = () => {
        setParameters();
    }

    const validateParameters = (parameters) => {
        try {
            JSON.parse(parameters);
            setContent({json: JSON.parse(parameters)});
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
            setContent({ json: {} });
        }
    }

    const JSONHandler = useCallback(
        (content) => {
            setContent(content.json);
            setEditableParams(JSON.stringify(content.json));
        },
        [content]
    )

    const handleRenderMenu = ((items) => {
        //Remove all other JSON ui handling. Using only 'Tree' mode.
        console.log(items);
        items.splice(0, 4);
        return [
          ...items
        ]
    });

    useEffect(() => {
        validateParameters(parameters);
        if(parameters === ogParameters){
            setParamChange(false);
        }else{
            setParamChange(true);
        }
    },[parameters]);

    const isJSON = (string) => {
        try {
          JSON.parse(string);
          return true
        } catch (e) {
          return false;
        }
      }

    return (
            <div style={{position: 'relative'}}>
                {isLeader && <div>
                    {editMode ?
                    <IconButton style={{position: 'absolute', top: '-2.5rem', right: '0'}} onClick={() => setEditMode(!editMode)}>
                        <WysiwygIcon fontSize="inherit" />
                    </IconButton> :
                    <IconButton style={{position: 'absolute', top: '-2.5rem', right: '0'}} onClick={() => setEditMode(!editMode)}>
                        <TerminalIcon fontSize="inherit" />
                    </IconButton>}
                </div>}
                <div>
                    {isLeader && editMode && parameters ? 
                    <div>
                        <JSONEditorPanel mode={'tree'} content={content} onChange={JSONHandler} onRenderMenu={handleRenderMenu} />
                        <div style={{position: 'absolute', bottom: '0.5rem', right: '0.5rem' }}>
                            {paramChange && <SaveIcon style={{color: 'grey', marginRight: '0.24rem'}} onClick={saveParameters} />} 
                        </div>
                    </div> :
                    <div>
                    <TextareaAutosize 
                        minRows="3" 
                        className="pre" 
                        style={{width: '100%'}} 
                        value={isJSON(parameters) ? JSON.stringify(JSON.parse(parameters),null,2) : parameters} 
                        onChange={(e) => handleParamChange(e.target.value)} 
                        disabled={!isLeader}
                    />
                    <div style={{position: 'absolute', top: '1rem', right: '0.5rem' }}>
                        {valid ? 
                            <CheckCircleIcon style={{color: 'lightgreen'}} /> : 
                            <WarningIcon style={{color: 'pink'}} />
                        }
                    </div>
                    <div style={{position: 'absolute', bottom: '1.5rem', right: '0.5rem' }}>
                        {valid && paramChange && isLeader && <SaveIcon style={{color: 'lightgrey'}} onClick={saveParameters} />} 
                    </div>
                    </div>}
                </div>
            </div>
    )
}
