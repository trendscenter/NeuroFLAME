import React from 'react';
import { useEffect, useState } from "react";
import { ConfigurationForm } from './ConfigurationForm'
import { useAdminComputationConfiguration } from './useAdminConfiguration';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

// Define custom styles
const customStyles = {
    labelBetween: {
        whiteSpace: 'nowrap',
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
    }
  };


export function CompConfigAdmin({ consortiumId, onChangeCompConfigAdmin }) {
    const {
        startEditing,
        cancelEditing,
        saveEdits,
        computationsList,
        selectComputation,
        setField,
        compSpec,
        formData,
        formSpec,
        editMode
    } = useAdminComputationConfiguration({ consortiumId });
    

    const handleSave = (event) => {
        console.log(event);
        saveEdits(); 
        onChangeCompConfigAdmin(event);
      }

    return (
            <div style={{position: 'relative'}}>
                {/*<div>
                    {editMode &&
                        <ComputationSelect computationsList={computationsList} selectComputation={selectComputation} />
                    }
                </div>*/}
                {!editMode && <IconButton style={{position: 'absolute', top: '-2.5rem', right: '0'}} onClick={() => { startEditing() }}><EditIcon fontSize="inherit" /></IconButton>}
                {compSpec && formData && <ConfigurationForm compSpec={compSpec} setField={setField} formSpec={formSpec} formData={formData} editing={editMode} />}
                <div>
                    {editMode && <Button variant="contained" color="warning" style={{margin: '0.5rem', marginLeft: '0', marginTop: '1rem'}} onClick={() => { cancelEditing() }}>Cancel</Button>}
                    {editMode && <Button variant="contained" style={{margin: '0.5rem', marginLeft: '0', marginTop: '1rem'}} onClick={handleSave}>Save</Button>}
                </div>
            </div>
    )
}

function ComputationSelect({ computationsList, selectComputation }) {
    
    return (
        <select onChange={e => {
            selectComputation(e.target.value)
        }}>
            <option>Select Computation</option>
            {computationsList.map((computation) => {
                return <option key={computation.id} value={computation.id}>{computation.title}</option>
            })}
        </select>
    )
}
