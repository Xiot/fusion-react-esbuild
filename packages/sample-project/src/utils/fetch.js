import nodeFetch from 'node-fetch';
const fetch = __NODE__ ? nodeFetch : window.fetch;
export default fetch;
