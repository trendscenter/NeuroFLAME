import React from "react";
import { gql, useQuery } from '@apollo/client';
import { Link } from "react-router-dom";


const GET_RUNS_LIST = gql`
    query getRunsList {
        getRunsList {
            id
            consortiumId
            consortiumName
            administrator
        }
    }
`;

export default function ConsortiaList() {
    const { loading, error, data, refetch } = useQuery(GET_RUNS_LIST);

    return (
        <div>
            {/* <button onClick={() => { refetch() }}>Get Runs</button> */}
            <h1>Runs</h1>
            {data && data.getRunsList.map((run) => {
                return <RunsListItem key={run.id} run={run} />
            })}
            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
        </div>
    );
}

function RunsListItem({ run }) {
    const style = {
        border: '1px solid #ccc',
        padding: '15px',
        margin: '10px 0',
        borderRadius: '5px',
        boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)'
    };

    const idStyle = {
        fontSize: '0.8rem',
        color: '#888',
        marginTop: '10px'
    };

    return (
        <div style={style}>
            <h3>{run.consortiumName}</h3>
            <Link to={`/runs/${run.id}`}>View</Link>
            <p style={idStyle}>{run.id}</p> 
        </div>
    );
}