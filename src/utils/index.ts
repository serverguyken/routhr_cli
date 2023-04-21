import fs from 'fs';
import path from 'path';
import spawn from 'cross-spawn';
import { exec } from "child_process";
import { promisify } from "util";
import { Answers, Config } from '../interface/interface';
import listr from 'listr';
export const execa = promisify(exec);



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

export const createPkg = (name: string, description: string) => {
    const pkg = {
        name,
        version: "1.0.0",
        description,
        main: "./.routhr/index.js",
        scripts: {
            "dev": "cross-env NODE_ENV=development nodemon --watch ./.routhr/",
            "dev:windows": "SET NODE_ENV=development&& nodemon --watch ./.routhr/",
            "dev:linux": "NODE_ENV=development&& nodemon --watch ./.routhr/index.js",
            "start": "node_modules/cross-env/src/bin/cross-env.js NODE_ENV=production node ./.routhr/index.js",
            "start:windows": "node_modules/cross-env/src/bin/cross-env.js SET NODE_ENV=production && node ./.routhr/index.js",
            "start:linux": "node_modules/cross-env/src/bin/cross-env.js NODE_ENV=production && node ./.routhr/index.js",
            "build": "tsc -p tsconfig.json",
            "watch": "tsc -p tsconfig.json --watch"
        },
        keywords: [],
        author: "",
        license: "ISC",
        dependencies: {
            routhr: "^1.6.11",
            typescript: "^4.6.3",
            cors: "^2.8.5",
            "@shopascart/collections": "^1.0.41",
            axios: "^1.3.4",
            dotenv: "^16.0.0",
            "cookie-parser": "^1.4.6"
        },
        devDependencies: {
            "nodemon": "^2.0.20",
            "@types/cors": "^2.8.12",
            "cross-env": "^7.0.3",
        }
    };
    return pkg;
};

export const createTsConfig = (contents?: string) => {
    const tsconfig = {
        "compilerOptions": {
            /* Language and Environment */
            "target": "es2016", /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
            /* Modules */

            "outDir": "./.routhr",
            "module": "commonjs", /* Specify what module code is generated. */
            "esModuleInterop": true,
            "forceConsistentCasingInFileNames": true, /* Ensure that casing is correct in imports. */
            /* Type Checking */
            "strict": true, /* Enable all strict type-checking options. */
            "skipLibCheck": true, /* Skip type checking all .d.ts files. */
            "declaration": true, /* Generates corresponding .d.ts files. */
        },
        "exclude": [
            "node_modules",
        ]
    }
    return tsconfig;
};

export const createGitIgnore = () => {
    const gitignore = `
    .env
    .env.development
    .env.production
node_modules
.routhr 
    `;
    return gitignore;
};

export const createReadMe = (name: string) => {
    const readme =
        `# ${name}
## Description
Generated by routhr CLI.
## Usage
\`\`\`bash
npm run dev
\`\`\`
## License
ISC
`;
    return readme;
};

export const createLicense = (name: string) => {
    const license =
        `ISC License (ISC)
Copyright (c) 2019 ${name}
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
`;
    return license;
};

export const installDependencies = (packageManager: 'npm' | 'yarn', dir: string) => {
    const child = spawn(packageManager, ['install'], {
        stdio: 'inherit',
        shell: true,
        cwd: dir
    });
    child.on('close', (code) => {
        if (code !== 0) {
            console.log(`${packageManager} install failed`);
            return;
        }
    });
};

export const gitInit = (dir: string) => {
    const child = spawn('git', ['init'], {
        stdio: 'inherit',
        shell: true,
        cwd: dir
    });
    child.on('close', (code) => {
        if (code !== 0) {
            console.log(`git init failed`);
            return;
        }
    });
};

export const tsBuild = (dir: string) => {
    const child = spawn('npm', ['run', 'build'], {
        stdio: 'inherit',
        shell: true,
        cwd: dir
    });
    child.on('close', (code) => {
        if (code !== 0) {
            console.log(`ts build failed`);
            return;
        }
    });
};

export const getDefaultConfig = (dir: string): Config => {
    if (!fs.existsSync(path.join(dir, 'routhr.config.json'))) {
        throw new Error('routhr.config.json not found');
    }
    const config = JSON.parse(fs.readFileSync(path.join(dir, 'routhr.config.json'), 'utf8'));
    return config;
};

export const getRouthrConfig = (path: string) => {
    if (!fs.existsSync(path)) {
        throw new Error(`no config file found at ${path}`);
    }
    const config = JSON.parse(fs.readFileSync(path, 'utf8'));
    return config;
};

export const getPackageManager = (config: Config) => {
    if (config.server.packageManager === 'npm') {
        return 'npm';
    } else if (config.server.packageManager === 'yarn') {
        return 'yarn';
    } else {
        throw new Error('no package manager found in config file');
    }
}

export const createTemplate = (name: string, dir: string, content: string) => {
    const filePath = path.join(dir, name);
    fs.writeFileSync(filePath, content);
    return filePath;
}

export const createProject = (answers: Answers) => {
    const { name, description, packageManager, git, install } = answers;
    const currdir = process.cwd();
    const projectDir = path.join(currdir, name);
    const start_time = Date.now();
    const tasks = new listr([
        {
            title: 'Creating project',
            task: () => createFolderFromTemplate(name, currdir, path.join(__dirname, '../../template'))
        },
        {
            title: 'Adding package.json',
            task: () => createFile('package.json', path.join(projectDir), JSON.stringify(createPkg(name, description), null, 2))
        },
        {
            title: 'Adding tsconfig.json',
            task: () => createFile('tsconfig.json', path.join(projectDir), JSON.stringify(createTsConfig(), null, 2))
        },
        {
            title: 'Adding .gitignore',
            task: () => createFile('.gitignore', path.join(projectDir), createGitIgnore())
        },
        {
            title: 'Adding README.md',
            task: () => createFile('README.md', path.join(projectDir), createReadMe(name))
        },
        {
            title: 'Adding LICENSE',
            task: () => createFile('LICENSE', path.join(projectDir), createLicense(name))
        },
        {
            title: install ? 'Installing dependencies (this may take a while)' : 'Skipping dependency installation',
            task: () => {
                if (install) {
                    if (packageManager === 'npm') {
                        return execa('npm install', { cwd: path.join(projectDir) });
                    } else if (packageManager === 'yarn') {
                        return execa('yarn install', { cwd: path.join(projectDir) });
                    } else {
                        throw new Error('no package manager found');
                    }
                }
            }
        },
        {
            title: git ? 'Initializing git' : 'Skipping git initialization',
            task: () => {
                if (git) {
                    return execa('git init', { cwd: path.join(projectDir) });
                }
            }
        },
        {
            title: install ? 'Building TypeScript' : 'Skipping TypeScript build',
            task: () => {
                if (install) {
                    return execa('npm run build', { cwd: path.join(projectDir) })
                }
            }
        },
    ]);
    tasks.run().then(() => {
        console.log("🚀 Your project is ready");
        if (packageManager === 'npm') {
            console.log(`
        To get started:
        cd ${name}
        npm run dev
        `);
        } else {
            console.log(`
        To get started:
        cd ${name}
        yarn dev
        `);
        }
        console.log(`Created project "${name}" in ${Date.now() - start_time}ms`);
    }).catch(err => {
        console.error(err);
    });
}