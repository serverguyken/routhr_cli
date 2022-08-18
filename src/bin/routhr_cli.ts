#!/usr/bin/env node
import yargs from 'yargs';
import inquirer from 'inquirer';
import { createFile, createPkg, createTsConfig, getRouthrConfig, createFolderFromTemplate } from "../utils";
import { createProject, devServer, startServer, createLog, createCreateLog, createDevLog, createStartLog } from "../helper";
import color from "../utils/color";
import { Commands } from '../interface/interface';
const routhr_cli_pkg = require("../../package.json");

interface Argv {
    argv: {
        [key: string]: any;
    }
}
interface Options {
    argv: {
        [key: string]: any;
    }
}


const args: Argv = yargs
yargs.version(routhr_cli_pkg.version);
const argv = args.argv;
const commands: Commands = {
    '-v': argv?.v === true,
    '--version': argv?.version === true,
    'version': argv._[0] === 'version',
    'create': argv._[0] === 'create',
    'dev': argv._[0] === 'dev',
    'start': argv._[0] === 'start'
}
const command2 = argv._[1];
const setCommandError = () => {
    console.log('Unknown command');
    console.log(`Please use ${color.yellow('routhr <command>')}`);
    //console.log(`Available command: ${color.yellow('create')}`);
    console.log(`Available commands: ${color.yellow('create, dev, start')}`);
    process.exit(1);
};
//console.log(argv);
const options_get = argv;
let options: {
    [key: string]: any;
} = {}
for (let key in options_get) {
    if (key !== '_' && key !== '$0') {
        options[key] = options_get[key];
    }
}
const createOptions = {
    name: {
        alias: 'n',
        describe: 'Create a new project',
        type: 'string',
        value: options.name
    }
}
const devOptions = {
    // config: {
    //     alias: 'c',
    //     describe: 'Path to config file',
    //     type: 'string',
    //     value: options.config
    // },
    // port: {
    //     alias: 'p',
    //     describe: 'Port to start dev server',
    //     type: 'number',
    //     value: options.port
    // }
}
const startOptions = {
    // config: {
    //     alias: 'c',
    //     describe: 'Path to config file',
    //     type: 'string',
    //     value: options.config
    // },
    // port: {
    //     alias: 'p',
    //     describe: 'Port to start server',
    //     type: 'number',
    //     value: options.port
    // }
}

const setUp = () => {
    console.log(color.green(`Routhr CLI version: ${routhr_cli_pkg.version}`));
    console.log('A CLI for creating a routhr application');
}

const no_options = Object.keys(options).length === 0;
const options_length = Object.keys(options).length;

if (commands.create) {
    setUp();
    if (argv._.length === 1) {
        if (options_length > 1) {
            createCreateLog();
            console.log(color.red(`\nUnknown option: ${color.yellow(`${Object.keys(options)[1]}`)}`));
        } else {
            if (options.name || options[createOptions.name.alias]) {
                if (typeof options.name === createOptions.name.type || typeof options[createOptions.name.alias] === createOptions.name.type) {
                    const project_name = options.name || options[createOptions.name.alias];
                    createProject(project_name, {})
                } else {
                    createCreateLog();
                    console.log(color.yellow(`\nInfo: no project name provided`));
                }
            } else if (options.help || options.h) {
                createCreateLog();
            }
            else {
                createCreateLog();
                console.log(color.yellow(`\nInfo: no project name provided`));
            }
        }
    } else if (argv._.length === 2) {
        if (no_options) {
            const project_name = command2;
            createProject(project_name, {})
        } else {
            createCreateLog();
            console.log(color.red(`\nUnknown option: ${color.yellow(`${Object.keys(options)[0]}`)}`));
        }
    } else {
        console.log(color.yellow(`\nInfo: you provided more than one argument. The first argument will be used as the project's name.`));
        const options_ = {}
        const project_name = command2;
        createProject(project_name, options_)
    }
} 
else if (commands.dev) {
    setUp();
    if (argv._.length === 1) {
        if (options_length > 1) {
            createDevLog();
            console.log(color.red(`\nUnknown option: ${color.yellow(`${Object.keys(options)[1]}`)}`));
        } else {
            // if (options.config || options[devOptions.config.alias]) {
            //     if (typeof options.config === devOptions.config.type || typeof options[devOptions.config.alias] === devOptions.config.type) {
            //         const config_path = options.config || options[devOptions.config.alias];
            //         devServer(config_path, {})
            //     } else {
            //         devServer(null, {})
            //     }
            // } else if (options.port || options[devOptions.port.alias]) {
            //     if (typeof options.port === devOptions.port.type || typeof options[devOptions.port.alias] === devOptions.port.type) {
            //         const port = options.port || options[devOptions.port.alias];
            //         devServer(null, { port })
            //     } else {
            //         devServer(null, {})
            //     }
            if (options.help || options.h) {
                createDevLog();
            }
            else {
                if (options_length === 0) {
                    devServer(null, {})
                } else {
                    createDevLog();
                    console.log(color.yellow(`\nUnknown option: ${color.yellow(`${Object.keys(options)[0]}`)}`));
                }
            }
        }
    } else if (argv._.length === 2) {
        if (no_options) {
            createDevLog();
            console.log(color.red(`\nInfo: no config file provided`));
        } else {
            createDevLog();
            console.log(color.red(`\nUnknown command: ${color.yellow(`${command2}`)}`));
        }
    } else {
        createDevLog();
        console.log(color.yellow(`\nInfo: you provided more than one argument. Use ${color.yellow('routhr dev <config_file>')}`));
    }
} else if (commands.start) {
    setUp();
    if (argv._.length === 1) {
        if (options_length > 1) {
            createStartLog();
            console.log(color.red(`\nUnknown option: ${color.yellow(`${Object.keys(options)[1]}`)}`));
        } else {
            // if (options.config || options[startOptions.config.alias]) {
            //     if (typeof options.config === startOptions.config.type || typeof options[startOptions.config.alias] === startOptions.config.type) {
            //         const config_path = options.config || options[startOptions.config.alias];
            //         startServer(config_path, {})
            //     } else {
            //         startServer(null, {})
            //     }
            // } else if (options.port || options[startOptions.port.alias]) {
            //     if (typeof options.port === startOptions.port.type || typeof options[startOptions.port.alias] === startOptions.port.type) {
            //         const port = options.port || options[startOptions.port.alias];
            //         startServer(null, { port })
            //     } else {
            //         startServer(null, {})
            //     }
            if (options.help || options.h) {
                createStartLog();
            }
            else {
                if (options_length === 0) {
                    startServer(null, {})
                } else {
                    createStartLog();
                    console.log(color.yellow(`\nUnknown option: ${color.yellow(`${Object.keys(options)[0]}`)}`));
                }
            }
        }
    } else if (argv._.length === 2) {
        if (no_options) {
            createStartLog();
            console.log(color.red(`\nInfo: no config file provided`));
        } else {
            createStartLog();
            console.log(color.red(`\nUnknown command: ${color.yellow(`${command2}`)}`));
        }
    } else {
        createStartLog();
        console.log(color.yellow(`\nInfo: you provided more than one argument. Use ${color.yellow('routhr start <config_file>')}`));
    }
} 
else if (commands['-v'] || commands['--version'] || commands.version) {
    console.log(`You are using ${color.yellow('routhr')} version ${color.yellow(routhr_cli_pkg.version)}`);
} else {
    createLog();
    setCommandError();
}