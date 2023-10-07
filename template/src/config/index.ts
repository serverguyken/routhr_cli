import dontEnv from 'dotenv';
/**
 * Set environment variables
 * @returns 
 */
function setEnv() {
    if (process.env.NODE_ENV !== 'production') {
        const configFile = `.env.${process.env.NODE_ENV}`.toString();
        console.log(`Loading config file: ${configFile}`);
        return dontEnv.config({ path: configFile });
    } else {
        return dontEnv.config()
    }
}

export { setEnv };




export const PORT = Number(process.env.PORT) || 3006;