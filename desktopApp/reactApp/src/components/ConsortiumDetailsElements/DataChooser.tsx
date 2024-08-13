import { useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import SaveIcon from  '@mui/icons-material/Save';
import TextareaAutosize from 'react-textarea-autosize';
import styles from '../styles';

export default function OpenDialog(props: any) {

    const [directory, setDirectory] = useState(null);
    const [files, setFiles] = useState(null);
    const [editDirManually, setEditDirManually] = useState(false);

    const handleUseDirectoryDialog = async () => {
        const { directoryPath, error, canceled } = await window.ElectronAPI.useDirectoryDialog(props.mountDir)
        if (directoryPath) {
            props.setMount(directoryPath)
        }
        if (error) {
            console.error(error)
        }
    }

    const handleSetMount = () => {
        if(directory){
            setDirectory(null);
            setFiles(null);
            setEditDirManually(false)
            props.setMount(directory);
            props.handleSetMount();
        }
    }

    const unsetMount = () => {
        setDirectory(null);
        setFiles(null);
        props.setMount('');
        props.handleSetMount();
    }

    const filePathTrail = (path) => {
        var parts = path.split('/').slice(-3);
        var newPath = ( parts.length == 3 ? '/' : '' ) + parts.join('/');
        return '...'+newPath;
    }


    return(
    <div>
        {!directory && !props.mountDir && !editDirManually && 
        <div>
            <button onClick={handleUseDirectoryDialog} style={{width: '100%', borderRadius: '2rem'}}>
                Select Data Directory
            </button>
            <div style={{margin: '0.5rem 0 1rem', textAlign: 'center'}}>
                <a style={{fontSize: '0.8rem', cursor: 'pointer'}} onClick={() => setEditDirManually(!editDirManually)}>Enter Data Directory Manually</a>
            </div>
        </div>}
        {editDirManually && 
        <div style={styles.container}>
            <div>
                <label style={styles.labelBetween}>
                    <h3 style={styles.h3}>Edit Data Directory</h3>
                    <div>
                        {directory && props.mountDir !== directory && <SaveIcon style={{ color: 'rgba(0, 0, 0, 0.54)', marginRight: '0.25rem' }} onClick={handleSetMount} />}
                        <CancelIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => {setEditDirManually(!editDirManually)}} />
                    </div>
                </label>
            </div>
            <TextareaAutosize style={{position: 'relative', width: '100%'}} id="standard-basic" defaultValue={props.mountDir} onChange={(e) => setDirectory(e.target.value)} />
        </div>
        }
        {!editDirManually && props.mountDir && <div style={styles.container}>
            <label style={styles.labelBetween}>
                <h3 style={styles.h3}>Data Directory</h3>
                <div>
                    <FolderIcon style={{ color: 'rgba(0, 0, 0, 0.54)', marginRight: '0.25rem' }} fontSize="medium" onClick={handleUseDirectoryDialog} />
                    <EditIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} fontSize="medium" onClick={(event) => setEditDirManually(!editDirManually)} />
                </div> 
            </label>
            <div style={styles.labelBetween}>
                <span>
                    {filePathTrail(props.mountDir)}
                </span>
                <DeleteIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} fontSize="small" onClick={(event) => unsetMount()} />  
            </div>        
        </div>}
    </div>
    )
}