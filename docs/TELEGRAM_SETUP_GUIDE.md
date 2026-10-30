# TelAI — Official Telegram TDLib Integration Guide

## 1. Obtaining Telegram API Credentials
To allow TelAI to communicate with Telegram via TDLib, you must register a personal client application:
1. Log into your Telegram account at [https://my.telegram.org](https://my.telegram.org).
2. Select **API development tools**.
3. Create a new application (e.g. App title: `TelAI Personal Agent`, Short name: `telai`).
4. Copy the generated **App api_id** (integer) and **App api_hash** (32-character hex string).

---

## 2. TDLib Native Architecture
TDLib (Telegram Database Library) is the official Telegram client library written in C++14. It handles all encryption, network protocol (MTProto), message delivery, and local SQLite cache synchronization.

### Directory Layout on Android
```
/data/user/0/org.telegram.ai.agent/files/
└── tdlib_data/
    ├── td.binlog (encrypted write-ahead transaction log)
    ├── database.sqlite (cached chat index)
    └── files/ (downloaded media and avatars)
```

### Authentication Flow (State Machine)
1. `TdAuthState.WaitPhoneNumber`: User enters international phone number (e.g. `+1 555 0192`).
2. `TdAuthState.WaitCode`: Telegram sends an in-app verification code or SMS.
3. `TdAuthState.WaitPassword`: If Two-Step Verification is active on the account, the user is prompted for their Telegram Cloud Password.
4. `TdAuthState.Ready`: Client is fully authenticated; MTProto session is maintained locally.
