const process = require('process');
import path from "path";
import { createFile, createPkg, createTsConfig, createGitIgnore, createReadMe, getDefaultConfig, getRouthrConfig, createFolderFromTemplate } from "../utils";
import { Config } from "../interface/interface";
const { performance } = require('perf_hooks');
const out = process.stdout;
const rdl = require("readline");

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

const initGitStep = (dir: string) => {
    const exec = require('child_process').exec;
    const cmd = `cd ${dir} && git init && git add . && git commit -m "first commit" && git branch -M main`;
    exec(cmd, (err: any, stdout: any, stderr: any) => {
        if (err) {
            return;
        }
        console.log(stdout);
    });
}

const installStep = (dir: string) => {
    const exec = require('child_process').exec;
    // check if yarn or npm is installed
    const cmd = `cd ${dir} && yarn --version`;
    exec(cmd, (err: any, stdout: any, stderr: any) => {
       
        if (stdout) {
            // yarn is installed
            const cmd = `cd ${dir} && yarn install`;
            exec(cmd, (err: any, stdout: any, stderr: any) => {
                if (err) {
                    return;
                }
                console.log(stdout);
            });
        } else {
            // npm is installed
            const cmd = `cd ${dir} && npm install`;
            exec(cmd, (err: any, stdout: any, stderr: any) => {
                if (err) {
                    return;
                }
                console.log(stdout);
            });
        }
    });
}

const compileTsStep = (dir: string) => {
    const exec = require('child_process').exec;
    const cmd = `cd ${dir} && npm run build`;
    exec(cmd, (err: any, stdout: any, stderr: any) => {
        if (err) {
            return;
        }
        console.log(stdout);
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
        spinner.stop();
        spinner.start(`Initializing git repository`);
        initGitStep(projectDir);
        setTimeout(() => {
            // Install dependencies
            spinner.stop();
            spinner.start(`Installing dependencies`);
            installStep(projectDir);
        }, 1000);
        // Compile typescript
        setTimeout(() => {
            spinner.stop();
            spinner.start(`Compiling typescript`);
            compileTsStep(projectDir);
            spinner.stop();
        }, 1000);
        const end_time = performance.now();
        const time_taken = doubleToSeconds(end_time - start_time);
        console.log(`Project created in ${time_taken} ms`);
        return;
    }, 4000);
}



const createDevServer = (config: Config, options: {
    port?: number,
}) => {
    let port = config.port;
    if (options.port) {
        port = options.port;
    }
    console.log(`Starting dev server on port ${port}`);
}

const createServer = (config: Config, options: {
    port?: number,
}) => {
    let port = config.port;
    if (options.port) {
        port = options.port;
    }
    console.log(`Starting server on port ${port}`);
    const app = require('./app');
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
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
export const startServer = (configPath: string| null, options: {
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
    console.log(`  -h, --help       show help`);
    console.log(`\n`);
    console.log(`Commands:`);
    console.log(`  create [options] <project-name>      create a new project`);
    //console.log(`  dev [options]                        start dev server`);
    //console.log(`  start [options]                      start server`);
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