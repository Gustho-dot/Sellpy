
const BASE_URL = 'http://localhost:3001/api'

/**
 * @typedef {Options}
 * @property {string} path 
 * Can you force type-safety in jsdoc?
 * @property {string} method GET/PUT/PATCH/POST
 * @property {Object} queryParameters
 * @property {Object} body
 *  */ 
export async function makeTodoAPIRequest (options) {
    const {
        path,
        method = "GET",
        queryParameters = {},
        body,
    } = options;

    const url = new URL(`${BASE_URL}/${path}`);
    url.search = new URLSearchParams(queryParameters).toString();

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    })


    if (!response.ok) {
         // log, retry
        if (response instanceof Error) {
            throw new Error(`The API responded with: ${response.status}  ${response.message} `);
        }
        throw new Error('Could not connect to the API.')
    }

    return response.json();
}