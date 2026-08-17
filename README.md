# secure-password-manager

secure-password-manager is a cross-platform desktop application built with Tauri, React, and Rust for securely storing sensitive information locally. The application is designed with a local-first approach, ensuring that user data never leaves the device.

## Features

- Local encrypted storage
- Website credentials
- Server credentials
- Database credentials
- Email accounts
- API keys
- Software licenses
- Secure notes
- Entry-specific notes
- Global search
- Cross-platform support

## Technology Stack

- Tauri
- Rust
- React
- Vite

## Requirements

Before running the application, make sure the following software is installed:

- Node.js 20 or later
- Rust
- Cargo
- Tauri CLI

## Installation

Clone the repository:

```bash
git clone https://github.com/samuelhuicab/secure-password-manager.git
cd secure-password-manager
```

Install dependencies:

```bash
npm install
```

Start the development environment:

```bash
npm run tauri dev
```

## Building

To generate a production build:

```bash
npm run tauri build
```

The compiled binaries will be available in:

```
src-tauri/target/release
```

## Project Structure

```
src/
├── components/
├── hooks/
├── pages/
├── services/
├── stores/
├── types/
└── utils/

src-tauri/
├── src/
├── Cargo.toml
└── tauri.conf.json
```

## Security

Secure Vault follows a local-first architecture. User information is stored exclusively on the local device and is never transmitted to external servers.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

Please ensure that new code follows the project's coding conventions and includes appropriate documentation.

## License

This project is licensed under the MIT License.
