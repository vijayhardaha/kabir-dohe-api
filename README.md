# Kabir Ke Dohe API

A modern API built with Next.js, designed to fetch and filter Kabir's timeless couplets (dohe). This API empowers developers to seamlessly integrate Kabir's spiritual wisdom into their applications.

## Table of Contents

- [Introduction](#introduction)
- [API Documentation](#api-documentation)
- [Developer Setup](#developer-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Kabir Ke Dohe API provides programmatic access to over 2500 couplets by Saint Kabir, one of India's most influential spiritual poets. This API lets you integrate these profound teachings into your applications, websites, or research projects.

All endpoints are free to use and require no authentication. The API is designed to be simple to use while offering powerful search and filtering capabilities.

### Rate Limiting

To ensure fair usage and maintain service stability, the API implements rate limiting:

- Each IP address is limited to 60 requests per minute per endpoint
- Rate limits are tracked separately for each endpoint
- When you exceed the rate limit, the API will return a 429 Too Many Requests status code

To avoid hitting rate limits, we recommend creating a local copy of the data and serving it from your own server.

## API Documentation

Complete API documentation, including endpoints, parameters, examples, and response formats, is available at:

**[https://kabir-ke-dohe-api.vercel.app](https://kabir-ke-dohe-api.vercel.app)**

## Developer Setup

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vijayhardaha/kabir-ke-dohe-api.git
   cd kabir-ke-dohe-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment setup:**

   Create an `.env.local` file in the root directory with the following variables:

   ```
   # Google Sheets API Configuration
   SPREADSHEET_ID="your-spreadsheet-id"
   GOOGLE_SERVICE_ACCOUNT_BASE64="base64-encoded-service-account-json"

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

   # Security Configuration
   IP_HASH_SALT="random-string-for-ip-hashing"
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

## Usage

Once the server is running, you can access the API at `http://localhost:3000/api/couplets`.

### Local Development

- **Development mode:** Run `npm run dev` to start the Next.js development server
- **Build:** Run `npm run build` to create an optimized production build
- **Production mode:** Run `npm start` to start the production server
- **Linting:** Run `npm run lint` to check for code style issues

## Contributing

We need your help! This project grows through community contributions.

Whether you're a developer or non-developer, there are many ways to help improve this project:

- **Developers**: Fix bugs, improve code, add new features, or enhance API endpoints
- **Non-developers**: Help with translations, data verification, and documentation
- **Everyone**: We maintain our data in Excel sheets where you can help fix typos, improve translations, and contribute new dohe

Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
