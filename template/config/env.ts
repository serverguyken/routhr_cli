const ENVCONFIG = () => {
    return ENVVALUES
}

type TENV = {
    API_VERSION: string;
}
const ENVVALUES: TENV = {
    API_VERSION: process.env.API_VERSION || 'v1',
}


declare global {
    namespace NodeJS {
        interface ProcessEnv extends TENV { }
    }
}

export default ENVCONFIG;