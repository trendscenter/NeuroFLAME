import { useState } from 'react';
const { ipcRenderer } = window.electron;

export function useIpcCall(channel) {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = async (args) => {
        setLoading(true);
        setError(null);
        setResponse(null);
        try {
            const response = await ipcRenderer.invoke(channel, args);
            setResponse(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    return [loading, response, error, sendRequest];
}

export default useIpcCall