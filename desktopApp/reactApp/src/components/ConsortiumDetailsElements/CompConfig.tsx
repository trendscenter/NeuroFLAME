import { useEffect, useState, useCallback } from "react";
import IconButton from '@mui/material/IconButton';
import SaveIcon from  '@mui/icons-material/Save';
import TerminalIcon from '@mui/icons-material/Terminal';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import WarningIcon from '@mui/icons-material/Warning';
import TextareaAutosize from 'react-textarea-autosize';
import JSONEditorPanel from './JSONEditorPanel';

// Define custom styles
const styles = {
    labelBetween: {
        whiteSpace: 'nowrap',
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
    }
  };

export default function CompConfig({ 
    configEditableParameters, 
    configSetEditableParams, 
    configHandleSetParameters, 
    configUserIsLeader
}) {

    const [editMode, configSetEditMode] = useState(false);
    const [valid, configSetValid] = useState(false);
    const [content, configSetContent] = useState({ json: null });
    const [ogParameters, configSetOGParameters] = useState(configEditableParameters);
    const [paramChange, configSetParamChange] = useState(false);

    const saveParameters = () => {
        configHandleSetParameters();
    }

    const validateParameters = (configEditableParameters) => {
        try {
            JSON.parse(configEditableParameters);
            configSetContent({json: JSON.parse(configEditableParameters)});
            configSetValid(true);
        } catch (e) {
            configSetValid(false);
        }
    }

    const handleParamChange = (configEditableParameters) => {
        configSetEditableParams(configEditableParameters);
        try {
            JSON.parse(configEditableParameters);
            configSetContent({ json: JSON.parse(configEditableParameters) });
        } catch (e) {
            configSetValid(false);
            configSetContent({ json: {} });
        }
    }

    const JSONHandler = useCallback(
        (content) => {
            configSetContent(content.json);
            configSetEditableParams(JSON.stringify(content.json));
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
        validateParameters(configEditableParameters);
        if(configEditableParameters === ogParameters){
            configSetParamChange(false);
        }else{
            configSetParamChange(true);
        }
    },[configEditableParameters]);

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
                {configUserIsLeader && <div>
                    {editMode ?
                    <IconButton style={{position: 'absolute', top: '-2.5rem', right: '0'}} onClick={() => configSetEditMode(!editMode)}>
                        <WysiwygIcon fontSize="inherit" />
                    </IconButton> :
                    <IconButton style={{position: 'absolute', top: '-2.5rem', right: '0'}} onClick={() => configSetEditMode(!editMode)}>
                        <TerminalIcon fontSize="inherit" />
                    </IconButton>}
                </div>}
                <div>
                    {configUserIsLeader && editMode && configEditableParameters ? 
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
                        value={isJSON(configEditableParameters) ? JSON.stringify(JSON.parse(configEditableParameters),null,2) : configEditableParameters} 
                        onChange={(e) => handleParamChange(e.target.value)} 
                        disabled={!configUserIsLeader}
                    />
                    <div style={{position: 'absolute', top: '1rem', right: '0.5rem' }}>
                        {valid ? 
                            <CheckCircleIcon style={{color: 'lightgreen'}} /> : 
                            <WarningIcon style={{color: 'pink'}} />
                        }
                    </div>
                    <div style={{position: 'absolute', bottom: '1.5rem', right: '0.5rem' }}>
                        {valid && paramChange && configUserIsLeader && <SaveIcon style={{color: 'lightgrey'}} onClick={saveParameters} />} 
                    </div>
                    </div>}
                </div>
            </div>
    )
}
