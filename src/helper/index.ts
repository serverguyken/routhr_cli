const process = require('process');
import path from "path";
import { createFile, createPkg, createTsConfig, createGitIgnore, createReadMe, getDefaultConfig, getRouthrConfig, createFolderFromTemplate, getPackageManager } from "../utils";
import { createWatcher } from "./watcher";
import { Config } from "../interface/interface";
const { performance } = require('perf_hooks');
import color from "../utils/color";
import ip from 'ip';
const out = process.stdout;
const rdl = require("readline");
const exec = require('child_process').exec;
import { execa } from '../utils';
const getCompIp = () => {
    return ip.address();
}
class Spinner {
    private spinner_name: string;
    private spinners: any;
    private timer: any;
    constructor(spinner_name: string) {
        this.spinner_name = spinner_name;
        this.spinners = {
            "dots": {
                interval: 80,
                frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
            },
            "dots2": {
                interval: 80,
                frames: ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"]
            },
            "dots3": {
                interval: 80,
                frames: ["⠋", "⠙", "⠚", "⠒", "⠂", "⠂", "⠒", "⠲", "⠴", "⠦", "⠖", "⠒", "⠐", "⠐", "⠒", "⠓", "⠋"]
            },
            "line": {
                interval: 130,
                frames: ['-', '\\', '|', '/']
            },
            "arc": {
                interval: 100,
                frames: ['◜', '◠', '◝', '◞', '◡', '◟']
            },
        }
    }
    start(message: string) {
        const spin = this.spinners[this.spinner_name];
        const frames = spin.frames;
        const interval = spin.interval;
        let index = 0;
        this.timer = setInterval(() => {
            let now = frames[index];
            if (now === undefined) {
                index = 0;
                now = frames[index];
            }
            out.write("\r" + now + " " + message);
            rdl.cursorTo(out, 0);
            index = index >= frames.length ? 0 : index + 1;

        }, interval);
        return
    }
    stop() {
        clearInterval(this.timer);
        out.write("\r");
    }
}


export const doubleToSeconds = (double: number) => {
    const seconds = double / 1000;
    return seconds.toFixed(2);
}

let initGitDone = false;
let installDone = false;
let compileTsDone = false;

const initGitStep = async (dir: string) => {
    const cmd = `cd ${dir} && git init && git add . && git commit -m "first commit" && git branch -M main`;
    try {
        let stdOut = await execa(cmd, { cwd: dir });
        const spinner = new Spinner('dots');
        spinner.start('Initializing git repository');
        console.log(stdOut.stdout);
        setTimeout(() => {
            spinner.stop();
            initGitDone = true;
        }, 1000);
    } catch (error) {
        console.log(`${color.red('[routhr]')} Error initializing git`);
    }
}

const installStep = async (dir: string) => {
    // check if yarn or npm is installed and use the correct command to install dependencies and update
    const config = getDefaultConfig(dir);
    const packageManager = getPackageManager(config);
    const dependencies = config.dependencies || [];
    const devDependencies = config.devDependencies || [];
    for (let i = 0; i < dependencies.length; i++) {
        const dependency = dependencies[i];
        const cmd = `cd ${dir} && ${packageManager} install ${dependency}`;
        try {
            let stdOut = await execa(cmd, { cwd: dir });
            console.log(stdOut.stdout);
            const spinner = new Spinner('dots');
            spinner.start('Installing dev dependencies');
            setTimeout(() => {
                spinner.stop();
                installDone = true;
            }, 1000);
        } catch (error) {
            console.log(`${color.red('[routhr]')} Error installing ${dependency}`);
        }
    }
    for (let i = 0; i < devDependencies.length; i++) {
        const devDependency = devDependencies[i];
        const cmd = `cd ${dir} && ${packageManager} install ${devDependency}`;
        try {
            let stdOut = await execa(cmd, { cwd: dir });
            console.log(stdOut.stdout);
            const spinner = new Spinner('dots');
            spinner.start('Installing dev dependencies');
            setTimeout(() => {
                spinner.stop();
                installDone = true;
            }, 1000);
        } catch (error) {
            console.log(`${color.red('[routhr]')} Error installing ${devDependency}`);
        }
    }
}

const compileTsStep = async (dir: string) => {
    const cmd = `cd ${dir} && npm run build`;
    try {
        let stdOut = await execa(cmd);
        console.log(stdOut.stdout);
        const spinner = new Spinner('dots');
        spinner.start('Compiling typescript');
        setTimeout(() => {
            spinner.stop();
            compileTsDone = true;
        }, 1000);
    } catch (error) {
        console.log(`${color.red('[routhr]')} Error compiling typescript`);
    }
}



const serverDevStep = (dir: string, config: Config, port: number) => {
    console.log('Starting dev server');
    console.log(`${color.yellow('[routhr dev]')} Watching file(s): ${dir}`);
    // start dev server
    // run nodemon with the correct file path
    const cmd = `cd ${dir} && node ${config.server.path}`;
    exec(cmd, (err: any, stdout: any, stderr: any) => {
        if (err) {
            console.log(err);
            console.log(`${color.red('[routhr]')} Error starting dev server`);
        } else {
            const spinner = new Spinner('dots');
            spinner.start('Starting dev server');
            setTimeout(() => {
                spinner.stop();
            }, 1000);
        }

    })
    //  createWatcher(dir, (path: string) => {
    //      console.log(`${color.yellow(`[routhr dev] ${color.redBright('[event]')}`)} File changed: ${color.green(path)}`); 
    //      console.log(`${color.yellow(`[routhr dev] ${color.cyan('[wait]')}`)} Restarting server`);
    //      setTimeout(() => {
    //          console.log(`${color.yellow('[routhr dev]')} Server restarted`);
    //         }, 0);
    //  }); 
}

const serverProdStep = (dir: string, port: number) => {
    console.log('Starting production server');
    const cmd = 'node ./.routhr/index.js';
    exec(cmd, (err: any, stdout: any, stderr: any) => {
        if (err) {
            console.log(`${color.red('[routhr prod]')} Error starting server`);
        }
        else {
            return;
        }
    });
}



export const createProject = (name: string, options: {}) => {
    const projectName = name;
    const start_time = performance.now();
    const spinner = new Spinner("dots");
    spinner.start(`Creating project: ${projectName}`);
    setTimeout(() => {
        const projectDir = path.join(process.cwd(), projectName);
        createFolderFromTemplate(projectName, process.cwd(), path.join(__dirname, "../../template"));
        const pkg = JSON.stringify(createPkg(projectName), null, 2);
        const tsconfig = JSON.stringify(createTsConfig(), null, 2)
        createFile('package.json', `./${projectName}`, pkg);
        createFile('tsconfig.json', `./${projectName}`, tsconfig);
        createFile('.gitignore', `./${projectName}`, createGitIgnore());
        createFile('README.md', `./${projectName}`, createReadMe(projectName));
        // Init git
        initGitStep(projectDir);
        setTimeout(() => {
            // Install dependencies
            installStep(projectDir);
            // Compile typescript
            setTimeout(() => {
                compileTsStep(projectDir);
            }, 1000);
        }, 1000);
        const end_time = performance.now();
        const time_taken = doubleToSeconds(end_time - start_time);
        console.log(`Project created in ${time_taken} ms`);
        spinner.stop();
        return;
    }, 1000);
}


const createDevServer = (config: Config, options: {
    port?: number,
}) => {
    let port = 3000;
    if (config['server'] && config['server'].port) {
        port = config.server.port;
    }
    if (options.port) {
        port = options.port;
    }
    let path = './';
    if (config['server'] && config['server'].entryFile) {
        path = config.server.entryFile;
    } else {
        throw new Error('No entry file found in config');
    }
    serverDevStep(path, config, port);
}

const createServer = (config: Config, options: {
    port?: number,
}) => {
    let port = 3000;
    if (config['server'] && config['server'].port) {
        port = config.server.port;
    }
    if (options.port) {
        port = options.port;
    }
    let path = './.routhr/index.js';
    if (config['server'] && config['server'].entryFile) {
        path = config.server.entryFile;
    }
    serverProdStep(path, port);
}

export const devServer = (configPath: string | null, options: {
    port?: number,
}) => {
    if (configPath === null) {
        const defaultConfig = getDefaultConfig(process.cwd());
        createDevServer(defaultConfig, options);
    } else {
        const config = getRouthrConfig(configPath);
        createDevServer(config, options);
    }
}
export const startServer = (configPath: string | null, options: {
    port?: number,
}) => {
    if (configPath === null) {
        const defaultConfig = getDefaultConfig(process.cwd());
        createServer(defaultConfig, options);
    } else {
        const config = getRouthrConfig(configPath);
        createServer(config, options);
    }
}

export const createLog = () => {
    const command_usage = `routhr [command] [options]`;
    console.log(command_usage);
    console.log(`\n`);
    console.log(`Options:`);
    console.log(`  -v, --version    show version`);
    //console.log(`  -h, --help       show help`);
    console.log(`\n`);
    console.log(`Commands:`);
    console.log(`  create [options] <project-name>      create a new project`);
    // console.log(`  dev [options]                        start dev server`);
    // console.log(`  start [options]                      start server`);
    console.log(`\n`);
};


export const createCreateLog = () => {
    const command_usage = `Usage: create [options] <project-name>`;
    console.log(command_usage);
    console.log(`\n`);
    console.log(`Options:`);
    console.log(`  -h, --help       show help`);
};


export const createDevLog = () => {
    const command_usage = `Usage: dev [options]`;
    console.log(command_usage);
    console.log(`\n`);
    console.log(`Options:`);
    console.log(`  -h, --help       show help`);
    console.log(`  -c, --config     config file path`);
    console.log(` -p, --port        port number`);
};

export const createStartLog = () => {
    const command_usage = `Usage: start [options]`;
    console.log(command_usage);
    console.log(`\n`);
    console.log(`Options:`);
    console.log(`  -h, --help       show help`);
    console.log(`  -c, --config     config file path`);
    console.log(` -p, --port        port number`);
};