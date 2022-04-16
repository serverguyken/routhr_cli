import path from "path";
import { createFile, createPkg, createTsConfig, getDefaultConfig, getRouthrConfig, createFolderFromTemplate } from "../utils";
import { Config } from "../interface/interface";
export const createProject = (name: string, options: []) => {
    const projectName = name;
    console.log(`Creating project ${projectName}`);
    const projectDir = path.join(process.cwd(), projectName);
    createFolderFromTemplate(projectName, process.cwd(), path.join(__dirname, "../../template"));
    const pkg = JSON.stringify(createPkg(projectName), null, 2);
    const tsconfig = JSON.stringify(createTsConfig(), null, 2)
    createFile('package.json', `./${projectName}`, pkg);
    createFile('tsconfig.json', `./${projectName}`, tsconfig);
    return;
}

const createDevServer = (config: Config) => {
    const port = config.port;
    console.log(`Starting dev server on port ${port}`);
}

const createServer = (config: Config) => {
    const port = config.port;
    console.log(`Starting server on port ${port}`);
}

export const devServer = (configPath?: string) => {
    if (configPath === undefined) {
        const defaultConfig = getDefaultConfig(process.cwd());
        createDevServer(defaultConfig);
    } else {
        const config = getRouthrConfig(configPath);
        createDevServer(config);
    }
}
export const startServer = (configPath?: string) => {
    if (configPath === undefined) {
        const defaultConfig = getDefaultConfig(process.cwd());
        createServer(defaultConfig);
    } else {
        const config = getRouthrConfig(configPath);
        createServer(config);
    }
}
