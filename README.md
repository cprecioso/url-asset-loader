# url-asset-loader

> Webpack 5 (and other bundlers) do **NOT** need this plugin, as this
> functionality is already part of their features. This is meant as a stop-gap
> solution while you update to a modern bundler.

This Webpack loader allows you or your dependencies to use the de-facto standard
for bundler-agnostic
[Static URL Asset Imports](https://webpack.js.org/guides/asset-modules/#url-assets)
(`new URL("...", import.meta.url)`); loosely backporting its support from
Webpack 5, Parcel 2, Vite, etc to Webpack 4.

### What does it do?

This loader transforms code that uses the Static URL Asset construct, e.g.:

```js
const myImageUrl = new URL("./myImage.jpg", import.meta.url).href;

const el = document.createElement("img");
el.src = myImageUrl;
document.body.append(el);
```

into code that uses the older, bundler-specific construct:

```js
import myImageUrl from "./myImage.jpg";

const el = document.createElement("img");
el.src = myImageUrl;
document.body.append(el);
```

as such, these static assets will be processed by further loaders in your
configuration.

## Usage

1. **PREREQUISITE** Install and configure either
   [`file-loader`](https://github.com/webpack-contrib/file-loader),
   [`url-loader`](https://github.com/webpack-contrib/url-loader), or another
   loader with the same purpose.

2. Install the loader

   ```sh
   $ npm install --save-dev url-asset-loader # if you use npm
   $ yarn add --dev url-asset-loader         # if you use yarn
   ```

3. Add it to your webpack config as the first plugin in the rules:

   ```js
   module.exports = {
     module: {
       rules: [
         {
           use: "url-asset-loader",

           // We will process JavaScript files
           test: /\.[mc]?js$/i,

           // Webpack 4's parser panics if it finds `import.meta`,
           // so setting this loader as running in the `pre` phase
           // allows it to transform it into something that Webpack
           // will not freak out about.
           enforce: "pre",
         },
         // ...
         {
           // And now your existing `file-loader` or `url-loader` config

           // Remember to add in here the extensions of the files
           // you want handled
           test: /\.(svg|woff|jpe?g|png)$/i,

           use: {
             loader: "file-loader", // Either `file-loader` or `url-loader`
             // ...
           },
         },
         // ...
       ],
     },
     // ...
   };
   ```

4. Done!
