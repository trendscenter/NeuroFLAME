import React, { useEffect, useState } from 'react';
import { fetchConfig, Config } from '../fetchConfig';

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
