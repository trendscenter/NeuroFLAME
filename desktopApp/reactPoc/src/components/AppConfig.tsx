import { useEffect, useState } from "react";

export function AppConfig() {
    const [persistentConfig, setPersistentConfig] = useState({});
    const [newConfig, setNewConfig] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
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

    const saveConfig = async () => {
        setIsSaving(true);
        try {
            const parsedConfig = JSON.parse(newConfig);
            await window.ElectronAPI.saveConfig(parsedConfig);
            fetchConfig();  // Refresh the config after saving
            setNewConfig("");  // Clear the input field
            setError("");  // Clear any previous errors
        } catch (err) {
            setError("Failed to save configuration");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div>
                <h2>Current Configuration</h2>
                <pre>
                    <code>{JSON.stringify(persistentConfig, null, 4)}</code>
                </pre>
            </div>
            <div>
                <h2>Update Configuration</h2>
                <textarea
                    rows={10}
                    cols={50}
                    onChange={(e) => setNewConfig(e.target.value)}
                    value={newConfig}
                    placeholder="Enter new JSON config here"
                ></textarea>
                <button onClick={saveConfig} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Config"}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    );
}
