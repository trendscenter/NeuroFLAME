import { useEffect, useState } from "react";
import { Config, electronApi } from "../../apis/electronApi/electronApi";

export function AppConfig() {
    const { getConfig, getConfigPath, openConfig, applyDefaultConfig } = electronApi;
    const [config, setConfig] = useState<Config | undefined>();
    const [configPath, setConfigPath] = useState<string>("");

    const fetchAll = async () => {
        const [loadedConfig, loadedConfigPath] = await Promise.all([getConfig(), getConfigPath()]);
        setConfig(loadedConfig);
        setConfigPath(loadedConfigPath);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleOpenConfig = () => openConfig();

    const handleApplyDefaultConfig = async () => {
        await applyDefaultConfig();
        fetchAll();
    };

    return (
        <div>
            <h1>App Config</h1>
            <p><strong>Config Path:</strong> {configPath}</p>
            <pre><code>{JSON.stringify(config, null, 2)}</code></pre>
            <button onClick={handleOpenConfig}>Open Config</button>
            <button onClick={handleApplyDefaultConfig}>Apply Default Config</button>
            <button onClick={fetchAll}>Reload Config</button>
        </div>
    );
}
