import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';

const GET_RUN_DETAILS = gql`
    query getRunDetails($runId: String!) {
        getRunDetails(runId: $runId) {
            id
            consortiumId
            consortiumName
            administrator
            computationConfiguration {
                adminFormData
                compSpec
            }
            members
            activeMembers
        }
    }
`;

const STOP_RUN = gql`
    mutation stopRun($runId: String!) {
        stopRun(runId: $runId)
    }
`;
export default function RunDetails() {
    const { runId } = useParams();
    const { loading, error, data } = useQuery(GET_RUN_DETAILS, { variables: { runId } });

    const [isRunAdminstrator, setIsRunAdminstrator] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (data && data.getRunDetails && data.getRunDetails.administrator === userId) {
            setIsRunAdminstrator(true);
        }
    }, [data]);

    return <div>
        <h1>Run Details</h1>
        {isRunAdminstrator && <RunControls runId={runId}></RunControls>}
        {data && <RunDetailsContent run={data.getRunDetails} />}
        {loading && <p>Loading...</p>}
        {error && <p>Error: Please try again</p>}
    </div>
}

function RunControls({ runId }) {
    const [stopRun, { stopRunData }] = useMutation(STOP_RUN);
    return (
        <div>
            <button onClick={() => { stopRun({ variables: { runId } }) }}>Stop Run</button>
        </div>
    )
}

function ComputationConfiguration({ compSpec, adminFormData }) {
    return (
        <div className="computation-configuration">
            <h3>Computation Configuration:</h3>
            <ConfigurationSection title="compSpec" content={compSpec} />
            <ConfigurationSection title="adminFormData" content={adminFormData} />
        </div>
    );
}

function ConfigurationSection({ title, content }) {
    return (
        <div className="configuration-section">
            <h4>{title}:</h4>
            <pre>
                <code>{JSON.stringify(content, null, 2)}</code>
            </pre>
        </div>
    );
}

function RunDetailsContent({ run }) {
    const {
        id,
        consortiumId,
        consortiumName,
        administrator,
        members,
        activeMembers,
        computationConfiguration: { compSpec: compSpecJson, adminFormData: adminFormDataJson },
    } = run;

    const compSpec = JSON.parse(compSpecJson);
    const adminFormData = JSON.parse(adminFormDataJson);

    return (
        <div className="run-details">
            <h3>Run ID: {id}</h3>
            <p>Consortium ID: {consortiumId}</p>
            <p>Consortium Name: {consortiumName}</p>
            <p>Administrator: {administrator}</p>
            <p>Members: {members.map(member => <span key={member}>{member}</span>)}</p>
            <p>Active Members: {activeMembers.map(activeMember => <span key={activeMember}>{activeMember}</span>)}</p>
            <ComputationConfiguration compSpec={compSpec} adminFormData={adminFormData} />
        </div>
    );
}

