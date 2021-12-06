# bl-chrome-extension
Broker Labz Chrome Extension

> Chrome extension that provides business analytics to Mortgage Brokers.

Broker Labz works by communicating directly with the mortgage aggregator CRM backend. It pulls data for analysis and presents results in a sidebar that can be easily opened and closed in the browser.

Currently, the only working feature is a commission tracker for the Connective Nexus CRM.
- Pull all commission data from the CRM.
- Identify potential errors such as trail drop off without discharge or negative amounts.
- Present this information to the user in a user-friendly way.
- Downloadable pdf and csv reports.

Technology used:
- Typescript
- React
- tailwindcss

## [In the web store](https://www.example.com)

## Getting Started

### Installing

```bash
npm install
```

### Local development

To package the chrome extension for testing:
```bash
npm run dev-export
```
In your chrome browser (or any browser that supports chrome extensions), you can load the extension
as an unpacked extension in developer mode.

To build the package:
```bash
npm run build
```

## Deployment

To package the extension for uploading
```bash
npm run export
```
You can then upload the zip file to chrome developer web store.

## Running the tests

```bash
npm run test
```
