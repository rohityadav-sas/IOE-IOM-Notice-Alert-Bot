## IOM Notice Alert Bot

**IOM Notice Alert Bot** is a Node.js Telegram bot that retrieves examination result notifications from the Institute of Medicine’s (IOM) website and delivers them directly to your Telegram account when new notices are available.

## Table of Contents

- [Preview](#preview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Dependencies](#dependencies)
- [License](#license)
- [Contributing](#contributing)

## Preview
<div style="display:flex; justify-content:space-between">
  <img src="./assets/preview.png?raw=true" height="100%" width="100%"/>
  <img src="./assets/preview2.png?raw=true" height="100%" width="100%"/>
</div>


## Features

- Fetches the latest exam result notices from the IOM website.
- Compares the fetched notices with previously saved notices to identify new ones.
- Sends the new notices directly to your Telegram account.
- Welcomes users and offers the option to view previous notices.

## Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)
- Telegram account and bot token

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/rohityadav-sas/IOM-Notice-Alert-Bot
    ```

2. Navigate to the project directory:
    ```bash
    cd IOM-Notice-Alert-Bot
    ```

3. Install the required dependencies:
    ```bash
    npm install
    ```

4. Create a ```.env``` file in the root directory and add your Telegram bot token:
    ```
    TOKEN=your-telegram-bot-token
    ```

## Usage

1. Start the bot:
    ```bash
    npm start
    ```

2. Interact with the bot via Telegram by sending the `/start` command.

3. The bot will automatically send you new IOM notices as they are published.

## How It Works

- **Fetch Current Notices**: The bot fetches the latest notices from the IOM website using Axios and Cheerio.
- **Fetch Saved Notices**: The bot reads previously saved notices from ```savedNotices.json```.
- **Check for New Notices**: The bot compares the current notices with the saved ones to identify any new notices.
- **Notify Users**: If there are any new notices, the bot sends them to all registered Telegram users.
- **Save Notices**: The bot updates ```savedNotices.json``` with any new notices.

## Dependencies

- **axios**: For making HTTP requests.
- **cheerio**: For parsing HTML and extracting data.
- **dotenv**: For loading environment variables.
- **node-telegram-bot-api**: For interacting with the Telegram Bot API.

## License

This project is licensed under the ISC License. See the [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
