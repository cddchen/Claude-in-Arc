# Claude in Arc

A deep patching toolkit designed to inject Anthropic's Official Claude Chrome Extension natively into Arc Browser's visual structure.

Because Arc doesn't officially support Chrome's `chrome.sidePanel` APIs natively yet, this project intercepts the extension's unpacked local files and re-wires them to run as an injected iFrame, matching Arc's aesthetic perfectly.

## What's New in v0.3

- Added **Custom API Settings** — configure API URL, API Key, Model, and Small Fast Model on the extension Options page; values apply live to the side panel without reloading
- Added **View Mode** selection — switch between two sidepanel injection modes: Squeeze (Default) and Overlay (iFrame)
- Established connection with Claude Desktop via Native Messaging
- Bug fixes

![View Mode setting location](view-mode.png)

### Custom API Settings

Open the extension **Options** page to set:

| Field | Description |
| --- | --- |
| API URL | Base URL of your API endpoint |
| API Key | Auth key for the endpoint |
| Model | Primary model name |
| Small Fast Model | Lightweight / fast model name |

Settings are stored in `chrome.storage.local` and synced into the side panel live.

## Installation

Download the ZIP from [Releases](https://github.com/cddchen/Claude-in-Arc/releases), or download the `1.0.66_0` folder directly from this repository and load it as an unpacked extension.

## Uninstallation

Go to `arc://extensions` and click **Remove Extension**.
