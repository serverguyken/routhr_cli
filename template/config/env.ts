const ENVCONFIG = () => {
    return ENVVALUES
}

type TENV = {
    API_VERSION: string;
    GATEWAY_API_URL: string;
}
const ENVVALUES: TENV = {
    GATEWAY_API_URL: process.env.GATEWAY_API_URL || 'http://localhost:3000',
    API_VERSION: process.env.API_VERSION || 'v1',
}


declare global {
    namespace NodeJS {
        interface ProcessEnv extends TENV { }
    }
}

export default ENVCONFIG;