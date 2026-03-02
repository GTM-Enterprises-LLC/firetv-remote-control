# FireTV Remote Control

A web-based remote control for Amazon FireTV devices over ADB (Android Debug Bridge). Control your FireTV from any browser on your local network — navigation, playback, volume, app launching, and live status updates.

## Features

- D-pad navigation, select, back, home, menu
- Playback controls (play/pause, rewind, fast forward)
- Volume controls with live volume bar
- App launchers (Netflix, Prime Video, Disney+, Hulu, Max, YouTube, and more)
- Live now-playing status: current app, playback state, media title/artist
- Screen on/off indicator
- IP address configuration from the UI
- Docker Compose deployment

## Prerequisites

- **FireTV**: Enable ADB debugging on your device
  Settings → My Fire TV → Developer Options → ADB Debugging: ON
- **ADB**: Available via system install or bundled in `platform-tools/`

## Setup

### Development

```bash
git clone https://github.com/GTM-Enterprises-LLC/firetv-remote-control.git
cd firetv-remote-control

cp .env.example .env
# Edit .env and set your FireTV's IP address
```

Install dependencies and start both servers:

```bash
npm install
npm run dev
```

- API server: http://localhost:3001
- UI: http://localhost:5173

### Docker

```bash
cp .env.example .env
# Set FIRETV_IP in .env

FIRETV_IP=192.168.1.x docker compose up --build
```

- UI: http://localhost:80

> **Note:** `network_mode: host` is required for ADB to reach your FireTV over the LAN.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `FIRETV_IP` | *(required)* | IP address of your FireTV |
| `PORT` | `3001` | API server port |
| `CORS_ORIGIN` | `*` | Allowed CORS origin |
| `NODE_ENV` | `development` | Node environment |

## Finding Your FireTV IP

From the FireTV: Settings → My Fire TV → About → Network

Or scan your network with `nmap` / your router's device list.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/status` | Connection status + device IP |
| GET | `/api/v1/now-playing` | Current app, playback state, volume |
| GET | `/api/v1/device-info` | Model, manufacturer, Android version |
| GET | `/api/v1/keys` | List of supported key names |
| GET | `/api/v1/apps` | List of supported app keys |
| POST | `/api/v1/keypress/:key` | Send a key event |
| POST | `/api/v1/launch/:app` | Launch an app |
| POST | `/api/v1/type` | Type text `{ text: string }` |
| GET | `/api/v1/config` | Current IP config |
| PUT | `/api/v1/config` | Update FireTV IP `{ deviceIp: string }` |

### Supported Keys

`up` `down` `left` `right` `select` `back` `home` `menu` `power` `sleep` `mic`
`volume_up` `volume_down` `volume_mute`
`play_pause` `rewind` `fast_forward` `media_next` `media_prev`

### Supported Apps

`netflix` `prime` `disney` `hulu` `youtube` `max` `peacock` `spotify` `plex` `tubi` `appletv`

## Tech Stack

- **Server**: Node.js, TypeScript, Express, ADB
- **UI**: React 18, Vite, Tailwind CSS, Zustand, Axios
- **Deployment**: Docker, nginx
