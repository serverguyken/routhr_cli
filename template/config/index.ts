import Log from "./Log";

import dontEnv from 'dotenv';

function setEnv() {
    if (process.env.NODE_ENV !== 'production') {
        const configFile = `.env.${process.env.NODE_ENV}`.toString();
        Log(`Loading config file: ${configFile}`);
        return dontEnv.config({ path: configFile });
    } else {
        return dontEnv.config()
    }
}

export { setEnv };




export const PORT = Number(process.env.PORT) || 3006;