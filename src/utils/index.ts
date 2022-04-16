import fs from 'fs';
import path from 'path';
export const createPkg = (name: string) => {
    const pkg = {
        name,
        version: "1.0.0",
        description: "",
        main: "./lib/index.js",
        scripts: {
            dev: "routhr --dev",
            start: "routhr --start",
            build: "tsc -p tsconfig.json",
            watch: "tsc -p tsconfig.json --watch"
        },
        keywords: [],
        "author": "",
        license: "ISC",
        dependencies: {
            nodemon: "^2.0.15",
            routhr: "^1.0.14",
            routhrCli: "^1.0.0",
            typescript: "^4.6.3"
        },
        directories: {
            lib: "lib"
        },
    };
    return pkg;
};

export const createTsConfig = (contents?: string) => {
    const tsconfig = {
        "compilerOptions": {
            /* Language and Environment */
            "target": "es2016", /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
            /* Modules */

            "outDir": "./lib",
            "module": "commonjs", /* Specify what module code is generated. */
            "esModuleInterop": true,
            "forceConsistentCasingInFileNames": true, /* Ensure that casing is correct in imports. */
            /* Type Checking */
            "strict": true, /* Enable all strict type-checking options. */
            "skipLibCheck": true /* Skip type checking all .d.ts files. */
        },
        "exclude": [
            "node_modules",
        ]
    }
    return tsconfig;
};

export const createFile = (name: string, dir: string, content: string) => {
    const filePath = path.join(dir, name);
    fs.writeFileSync(filePath, content);
    return filePath;
};

export const createFolderFromTemplate = (name: string, dir: string, templateDir: string) => {
    // check if the folder exists with the name
    const folderPath = path.join(dir, name);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        // copy all files and folders from template
        const files = fs.readdirSync(templateDir);
        files.forEach(file => {
            const filePath = path.join(templateDir, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                const content = fs.readFileSync(filePath, 'utf8');
                createFile(file, folderPath, content);
            } else if (stats.isDirectory()) {
                createFolderFromTemplate(file, folderPath, filePath);
            }
        });
    } else {
        throw new Error(`${name} folder already exists`);
    }
};


export const getDefaultConfig = (dir: string) => {
    if (!fs.existsSync(path.join(dir, 'routhr.config.json'))) {
        throw new Error('routhr.config.json not found');
    }
    const config = JSON.parse(fs.readFileSync(path.join(dir, 'routhr.config.json'), 'utf8'));
    return config;
};

export const getRouthrConfig = (path: string) => {
    if (!fs.existsSync(path)) {
        throw new Error('routhr.config.json not found');
    }
    const config = JSON.parse(fs.readFileSync(path, 'utf8'));
    return config;
};

export const createTemplate = (name: string, dir: string, content: string) => {
    const filePath = path.join(dir, name);
    fs.writeFileSync(filePath, content);
    return filePath;
} 