import { useEffect, useState } from "react"
import { Box, Button, Paper, TextField, Typography, IconButton, Alert, Menu, MenuItem, Snackbar } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { electronApi } from "../../apis/electronApi/electronApi"
import { useNavigate } from 'react-router-dom'

export function AppConfig() {
    const navigate = useNavigate()
    const { getConfig, getConfigPath, openConfig, applyDefaultConfig, saveConfig, restartApp } = electronApi

    // State management
    const [config, setConfig] = useState<string>("")
    const [initialConfig, setInitialConfig] = useState<string>("")
    const [configPath, setConfigPath] = useState<string>("")
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [restartNotification, setRestartNotification] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>(null)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    // Fetch configuration data
    const fetchAll = async () => {
        const [loadedConfig, loadedConfigPath] = await Promise.all([getConfig(), getConfigPath()])
        const loadedConfigStr = JSON.stringify(loadedConfig, null, 2)
        setConfig(loadedConfigStr)
        setInitialConfig(loadedConfigStr)  // Set baseline for change detection
        setConfigPath(loadedConfigPath)
        setIsEditing(false)
        setRestartNotification(false)
        setMessage(null)
    }

    useEffect(() => {
        fetchAll()
    }, [])

    // Handlers for actions
    const handleOpenConfig = () => openConfig()

    const handleApplyDefaultConfig = async () => {
        await applyDefaultConfig()
        fetchAll()
    }

    const handleSaveConfig = async () => {
        try {
            const parsedConfig = JSON.parse(config)
            await saveConfig(JSON.stringify(parsedConfig))
            setInitialConfig(config)  // Update the initial config baseline
            setMessage("Configuration saved successfully.")
            setRestartNotification(true)  // Enable restart option
            setIsEditing(false)
            
            // Auto-dismiss success message after 3 seconds
            setTimeout(() => setMessage(null), 3000)
        } catch (error) {
            setMessage("Failed to save configuration. Invalid JSON format.")
        }
    }

    const handleConfigChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfig(event.target.value)
    }

    const enterEditMode = () => setIsEditing(true)
    const cancelEditMode = () => {
        setConfig(initialConfig)  // Revert to the original config
        setIsEditing(false)
        setRestartNotification(false)
        setMessage(null)
    }

    // Handlers for menu
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
    const handleMenuClose = () => setAnchorEl(null)

    return (
        <Paper sx={{ margin: '1rem', padding: '1rem' }}>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                    <Typography variant="h6">Configuration</Typography>
                    <Typography variant="body2" color="textSecondary"><strong>Config Path:</strong> {configPath}</Typography>
                </Box>
                <Box>
                    <Button
                        startIcon={<EditIcon />}
                        onClick={enterEditMode}
                        color="primary"
                        disabled={isEditing}
                    >
                        Edit Config
                    </Button>
                    <IconButton onClick={handleMenuOpen}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleOpenConfig}>Open Config File</MenuItem>
                        <MenuItem onClick={fetchAll}>Re-fetch Config</MenuItem>
                        <MenuItem onClick={handleApplyDefaultConfig}>Apply Default Config</MenuItem>
                    </Menu>
                </Box>
            </Box>

            {/* Config Editor Section */}
            {restartNotification && (
                <Alert
                    severity="info"
                    action={
                        <Button
                            color="primary"
                            size="small"
                            startIcon={<RestartAltIcon />}
                            onClick={restartApp}
                            sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                        >
                            Restart App
                        </Button>
                    }
                    sx={{ my: 2 }}
                >
                    Changes saved. Restart the app to apply.
                </Alert>
            )}

            {message && (
                <Snackbar
                    open={Boolean(message)}
                    autoHideDuration={3000}
                    onClose={() => setMessage(null)}
                    message={message}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                />
            )}

            <TextField
                fullWidth
                multiline
                minRows={20}
                maxRows={20}
                value={config}
                onChange={handleConfigChange}
                disabled={!isEditing}
                variant="outlined"
                margin="normal"
            />

            {/* Action Buttons */}
            <Box display="flex" flexDirection="row" justifyContent="flex-start" mt={2} gap={1}>
                {isEditing && (
                    <>
                        <Button variant="contained" color="primary" onClick={handleSaveConfig}>Save</Button>
                        <Button variant="outlined" color="secondary" onClick={cancelEditMode}>Cancel</Button>
                    </>
                )}
                {/* Persistent Restart App button, enabled only after a successful save */}
                {restartNotification && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<RestartAltIcon />}
                        onClick={restartApp}
                    >
                        Restart App
                    </Button>
                )}
            </Box>

            {/* Navigation */}
            <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="text" onClick={() => navigate(`/login`)}>Back to Login</Button>
            </Box>
        </Paper>
    )
}
