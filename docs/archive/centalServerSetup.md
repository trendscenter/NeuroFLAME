Got it! Here’s the guide exactly as requested, starting at Step 1 and containing only the specified content.

---

### Step 1: Create Systemd Service Files

To run multiple servers in sequence, create a `systemd` service file for each server. Each file specifies a `WorkingDirectory` and `ExecStart` command, along with dependencies to control startup order.

#### Example Setup: Three Server Services

##### 1. `centralApi.service`
```ini
[Unit]
Description=Central API Server
After=network.target

[Service]
WorkingDirectory=/home/ec2-user/coinstac-mint/centralApi
ExecStart=/usr/bin/npm run start-configured
Restart=always
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

##### 2. `centralFederatedClient.service`
This service waits 10 seconds after `centralApi` starts before running.

```ini
[Unit]
Description=Central Federated Client
After=centralApi.service
Requires=centralApi.service

[Service]
WorkingDirectory=/home/ec2-user/coinstac-mint/centralFederatedClient
ExecStart=/usr/bin/bash -c 'sleep 10; npm run start-configured'
Restart=always
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

##### 3. `fileServer.service`
```ini
[Unit]
Description=File Server
After=centralFederatedClient.service
Requires=centralFederatedClient.service

[Service]
WorkingDirectory=/home/ec2-user/coinstac-mint/fileServer
ExecStart=/usr/bin/npm run start-configured
Restart=always
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

### Step 2: Enable and Start the Services

1. **Enable the services** to start automatically on boot:
   ```bash
   sudo systemctl enable centralApi.service
   sudo systemctl enable centralFederatedClient.service
   sudo systemctl enable fileServer.service
   ```

2. **Start the primary service** (the others will start in sequence):
   ```bash
   sudo systemctl start centralApi.service
   ```

### Step 3: Check the Status and Logs

1. **Check the status** of each service:
   ```bash
   sudo systemctl status centralApi.service
   sudo systemctl status centralFederatedClient.service
   sudo systemctl status fileServer.service
   ```

2. **View logs** for a specific service:
   ```bash
   sudo journalctl -u centralApi.service -f
   sudo journalctl -u centralFederatedClient.service -f
   sudo journalctl -u fileServer.service -f
   ```

### Step 4: Troubleshooting and Adjustments

- To **restart a service** if needed:
  ```bash
  sudo systemctl restart centralApi.service
  ```

- To **stop a service**:
  ```bash
  sudo systemctl stop centralApi.service
  ```

- To **disable a service** from starting on boot:
  ```bash
  sudo systemctl disable centralApi.service
  ```

### Summary

With these `systemd` service configurations, your servers will start in sequence, run in the background, and automatically restart on failure or machine reboot. Logs are accessible for monitoring, and you can adjust the configuration by editing service files in `/etc/systemd/system/`.