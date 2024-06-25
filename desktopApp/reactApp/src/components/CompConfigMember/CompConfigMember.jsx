import React from 'react';
import { useMemberComputationConfiguration } from './useMemberConfiguration';
import { ConfigurationForm } from './ConfigurationForm'


export default function CompConfigMember({ consortiumId }) {
    const {
        startEditing,
        cancelEditing,
        saveEdits,
        editMode,
        setField,
        compSpec,
        adminFormData,
        formSpec,
        memberFormData
    } = useMemberComputationConfiguration({ consortiumId });
    return (<div>
        {memberFormData && <ConfigurationForm
            compSpec={compSpec}
            setField={setField}
            formSpec={formSpec}
            memberFormData={memberFormData}
            editing={editMode}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            saveEdits={saveEdits}
        />}
    </div>)
}