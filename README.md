# Transform Manifest Plugin

Webpack plugin for merge and transform json files.

## Install

```bash
npm install --save-dev transform-manifest-plugin
```

## Usage

In your `webpack.config.js`

```javascript
const TransformManifestPlugin = require('transform-manifest-plugin');

module.exports = {
    // ...
    plugins: [
        new TransformManifestPlugin({
            input: {
                withTransform: [{
                    file: './assets.json',
                    path: 'https://<path>/'
                }],
                withoutTransform: [
                    './manifest.json'
                ]
            },
            output: './manifest.json'
        })
    ]
};
```

```json
// assets.json
{
  "alpha.js": "alpha.0987654321.js",
  "alpha.css": "alpha.0987654321.css"
}

// manifest.json
{
  "beta.js": "https://<path>/beta.1234567890.js",
  "beta.css": "https://<path>/beta.1234567890.css"
}
```

Result

```json
// manifest.json
{
  "alpha.js": "https://<path>/alpha.1234567890.js",
  "alpha.css": "https://<path>/alpha.1234567890.css",
  "beta.js": "https://<path>/beta.0987654321.js",
  "beta.css": "https://<path>/beta.0987654321.js"
}
```
