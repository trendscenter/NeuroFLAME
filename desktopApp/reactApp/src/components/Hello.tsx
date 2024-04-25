import React, { useEffect, useState } from 'react';

// Assuming the structure of your config data
interface Config {
    centralServerUrl?: string;
    federatedClientUrl?: string;
}

// Assuming window.electronAPI has been declared in your preload script and exposed via contextBridge
declare global {
    interface Window {
        electronAPI: {
            getConfig: () => Promise<Config>;
        }
    }
}

const fetchConfig = async (): Promise<Config | undefined> => {
    try {
        const configData = await window.electronAPI.getConfig();
        return configData;
    } catch (error) {
        console.error('Failed to load configuration', error);
        return undefined;
    }
}

const Hello: React.FC = () => {
    const [config, setConfig] = useState<Config | undefined>();

    useEffect(() => {
        const loadConfig = async () => {
            const config = await fetchConfig();
            setConfig(config);
        };

        loadConfig();
    }, []);

    return (
        <div>
            Hello World
            <div>
                {config ? JSON.stringify(config) : 'Loading configuration...'}
            </div>
        </div>
    )
}

export default Hello;
