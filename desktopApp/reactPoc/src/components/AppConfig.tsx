import { useEffect, useState } from "react";

export function AppConfig() {
    const [configPath, setConfigPath] = useState("");
    const [persistentConfig, setPersistentConfig] = useState({});
    const [newConfig, setNewConfig] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
        getConfigPath();
    }, []);

    const fetchConfig = async () => {
        try {
            const loadedConfig = await window.ElectronAPI.getConfig();
            setPersistentConfig(loadedConfig);
            setError("");  // Clear error on successful fetch
        } catch (err) {
            setError("Failed to load configuration");
            console.error(err);
        }
    };

    const handleOpenConfig = () => {
        window.ElectronAPI.openConfig()
    }

    const handleApplyDefaultConfig = async () => {
        await window.ElectronAPI.applyDefaultConfig()
        fetchConfig()
    }

    const getConfigPath = async () => {
        const configPathResult = await window.ElectronAPI.getConfigPath()
        setConfigPath(configPathResult)
    }
    return (
        <div>
            <div>
                <h2>Current Configuration</h2>
                <div>
                    Config Path: {configPath}
                </div>
                <pre>
                    <code>{JSON.stringify(persistentConfig, null, 4)}</code>
                </pre>
            </div>
            <div>
                <button onClick={handleOpenConfig}>open config</button>
            </div>
            <div>
                <button onClick={handleApplyDefaultConfig}>apply default config</button>
            </div>
        </div>
    );
}

