import React from "react";
import { Link } from "react-router-dom";

export default function ComputationsListItem({ computation }) {
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
            <h3>{computation.title}</h3>
            <p>{computation.description}</p>
            <Link to={`/computations/${computation.id}`}>View</Link>
            <p style={idStyle}>{computation.id}</p>
        </div>
    );
}
