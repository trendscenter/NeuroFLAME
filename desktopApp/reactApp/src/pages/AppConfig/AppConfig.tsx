import { useEffect, useState } from "react";
import { Box, Button, Paper} from '@mui/material';
import { Config, electronApi } from "../../apis/electronApi/electronApi";
import { useNavigate } from 'react-router-dom';

export function AppConfig() {
    const navigate = useNavigate();

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
        <Paper sx={{margin: '1rem', padding: '1rem'}}>
            <h1>App Config</h1>
            <p><strong>Config Path:</strong> {configPath}</p>
            <pre><code>{JSON.stringify(config, null, 2)}</code></pre>
            <Box display="flex" flexDirection="row" justifyContent="space-between">
                <Button variant="contained" onClick={handleOpenConfig}>Open Config</Button>
                <Button variant="contained" onClick={handleApplyDefaultConfig}>Apply Default Config</Button>
                <Button variant="contained" onClick={fetchAll}>Reload Config</Button>
                <Button variant="contained" onClick={() => navigate(`/login`)}>Back To Login</Button>
            </Box>
        </Paper>
    );
}
