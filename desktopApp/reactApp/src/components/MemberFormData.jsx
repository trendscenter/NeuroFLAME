import React, { useState } from 'react'
import useIpcCall from './UseIPC';

export default function MemberFormData() {
    const [loading, response, error, getMemberFormData] = useIpcCall('getMemberFormData');
    const [consortiumId, setConsortiumId] = useState("55");
    return (
        <div>
            <input type="text" value={consortiumId} onChange={(e) => setConsortiumId(e.target.value.toString())} />
            <button onClick={() => getMemberFormData({ consortiumId })}>Get Member Form Data</button>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {response && <pre>{JSON.stringify(response)}</pre>}
        </div>
    )
}