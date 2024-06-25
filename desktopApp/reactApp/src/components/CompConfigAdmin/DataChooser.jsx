import React from 'react';
import { useState } from "react";
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// Define custom styles
const customStyles = {
    h3 : {
        margin: '0',
        padding: '0',
        lineHeight: '2',
    },
    container: {
        background: '#ffffff',
        borderRadius: '1rem',
        padding: '1rem',
        marginBottom: '1rem',
    },
    label: {
        whiteSpace: 'nowrap',
        display: 'flex',
        justifyContent: 'flex-start',
        alignConten: 'center',
        lineHeight: '2',
    },
    labelBetween: {
        whiteSpace: 'nowrap',
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
    },
    files: {
        height: '200px',
        overflow: 'scroll',
        marginBottom: '1rem'
    }
  };

export default function OpenDialog() {

    const [directory, setDirectory] = useState(null);
    const [files, setFiles] = useState(null);

    const handleClick = (path) => {
        window.electron.openFile().then((result) => {
            setDirectory(result.filepath);
            setFiles(result.filelist);
        });
    };

    function filePathTrail(path){
        var parts = path.split('/').slice(-3);
        return ( parts.length == 3 ? '/' : '' ) + parts.join('/');
      }

    return(
    <div>
        {!directory && <button onClick={handleClick} style={{width: '100%', borderRadius: '2rem'}}>
            Select Data Directory
        </button>}
        {directory && 
        <div style={customStyles.container}>
            <label style={customStyles.labelBetween}>
                <h3 style={customStyles.h3}>Files</h3>
                <IconButton aria-label="delete" size="medium" onClick={(event) => setDirectory(null)}>
                    <CancelIcon fontSize="inherit" />
                </IconButton>
            </label>
            <label style={customStyles.label}><FolderIcon sx={{fontSize: '18px', margin: '0.4rem'}} /> &nbsp;{'...'+filePathTrail(directory)}</label>
            <FileTree files={files} />
        </div>}
    </div>
    )
}

function FileTree(files){
    files = files.files;
    const structure = makeTree(files);
    console.log(structure);
    if(structure.length > 0){
        return(
            <SimpleTreeView
                style={customStyles.files}
                slots={{
                    expandIcon: FolderIcon,
                    collapseIcon: FolderOpenIcon,
                    endIcon: TextSnippetIcon,
                }}
                sx={{paddingLeft: '0.75rem', paddingRight: '0.75rem'}}
            >
                <BuildTree nodes={structure} />
            </SimpleTreeView>
        )
    }
}

function BuildTree(nodes){
    nodes = nodes.nodes;
    const list = [];
    nodes.map((node, index) => {
        console.log(node, index);
        node.children 
        ? list.push(<TreeItem itemId={index+'-'+node.name} label={node.name}><BuildTree nodes={node.children} /></TreeItem>)
        : list.push(<TreeItem itemId={index+'-'+node.name} label={node.name}></TreeItem>)
    });
    return list;
}

function makeTree(paths) {
    const tree = paths.reduce((parent, path) => {
        path.split('/').reduce((r, name, i, { length }) => {
            let temp = (r.children ??= []).find(q => q.name === name);
            if (!temp) r.children.push(temp = { name, ...(i + 1 === length && { isLeaf: true }) });
            return temp;
        }, parent);
        return parent;
    }, { children: [] }).children;
    return tree;
}