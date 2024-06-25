import React from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

export default function ConsortiaListItem({ consortium }) {
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

    console.log(consortium);

    return (
        <div style={style}>
            <h3>{consortium.title}</h3>
            {/* <p>{consortium.id}</p> */}
            <p>{consortium.description}</p>
            <Button variant="contained" component={Link} to={`/consortia/${consortium.id}`} style={{backgroundColor: '#007BFF'}}>View</Button>
        </div>
    );
}
