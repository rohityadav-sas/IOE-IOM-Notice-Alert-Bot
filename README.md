## IOE-IOM Notice Alert Bot

**IOE-IOM Notice Alert Bot** is a Node.js Telegram bot that scrapes and retrieves examination and official notices from the Institute of Engineering's (IOE) and Institute of Medicine’s (IOM) websites, and delivers them directly to your Telegram account when new notices are available.

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
  <img src="./assets/preview1.png?raw=true" height="100%" width="45%"/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp
  <img src="./assets/preview2.png?raw=true" height="100%" width="45%"/>
</div>
<br>

***

<br>
<div style="display:flex; justify-content:space-between">
  <img src="./assets/preview3.png?raw=true" height="100%" width="45%"/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp
  <img src="./assets/preview4.png?raw=true" height="100%" width="45%"/>
</div>

## Features

- Fetches the latest exam, entrance, official, and admission notices from the IOE and IOM websites.
- Compares the fetched notices with previously saved notices to identify new ones.
- Sends the new notices directly to registered Telegram users.
- Welcomes users and offers the option to view previously saved notices.
- Stops polling after a specific duration to adhere to GitHub Actions' free tier limitations.
- Provides a web interface to view and download logs.

## Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)
- Telegram account and bot token

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/rohityadav-sas/IOE-IOM-Notice-Alert-Bot.git
    ```

2. Navigate to the project directory:
    ```sh
    cd IOE-IOM-Notice-Alert-Bot
    ```

3. Install the required dependencies:
    ```sh
    npm install
    ```

4. Create a ```.env``` file in the root directory and add your Telegram bot tokens and authentication credentials:
    ```env
    TELEGRAM_BOT_TOKEN_IOE=your-ioe-telegram-bot-token

    TELEGRAM_BOT_TOKEN_IOM=your-iom-telegram-bot-token

    USER=your-username

    PASSWORD=your-password
    ```

## Usage

1. Start the bot:
    ```bash
    npm start
    ```

2. Interact with the bot via Telegram by sending the `/start` command.

3. The bot will automatically send you new IOE and IOM notices as they are published.

## How It Works

- **Bot Initialization**: The bot initializes using the provided Telegram bot tokens for both IOE and IOM. The bots poll for updates and respond to user commands.

- **Fetch Current Notices**: The bot fetches the latest notices (exam, entrance, official, and admission notices) from IOE and IOM websites using Axios and Cheerio.

- **Fetch Saved Notices**: The bot loads previously saved notices from JSON files.

- **Check for New Notices**: The bot compares the fetched notices with the saved ones to identify new notices.

- **Send Notices**: New notices are sent to all registered Telegram users. The messages are formatted using HTML for better readability.

- **Web Interface for Logs**: The bot provides a web interface to view and download logs. The logs can be accessed at `/logs`.

## Dependencies

- **express**: For handling HTTP requests and routing.

- **jsonwebtoken**: For generating and verifying JSON Web Tokens (JWT) for authentication.

- **axios**: For making HTTP requests.

- **cheerio**: For parsing HTML and extracting data.

- **dotenv**: For loading environment variables.

- **node-telegram-bot-api**: For interacting with the Telegram Bot API.

## License

This project is licensed under the ISC License. See the [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
