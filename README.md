# fusion-react-esbuild
Using esbuild with a fusion application

# Usage
Install dependencies with
```
yarn install
```
at the root.

Build the `fusion-build` project
From the `/packages/fusion-build/` folder, run
```
yarn build
```
If you are making multiple changes, you can run
```
yarn watch
```
to rebuild on changes.

Run the sample project

From the `/packages/sample-project/` folder:
Generate local ssl certificates with
```
yarn generate-certs
```
This generates `snowpack.key` and `snowpack.crt` that is used to sign requests.

Spin up the project by running:
```
yarn dev
```
This will spin up the project on port `https://localhost:4001`

You should then be able to make a change to the sample project and have React FastRefresh take care of updating the UI.  If the backend is changed, then the server will be restarted with the new changes.

# Links
esbuild:     https://github.com/evanw/esbuild
pnp support: https://www.npmjs.com/package/esbuild-plugin-pnp

Snowpack React Fast Refresh
https://github.com/snowpackjs/snowpack/tree/main/plugins/plugin-react-refresh#readme


# Notes
Need to keep snowpack server running.
Start backend server in new process + restart it on file change.