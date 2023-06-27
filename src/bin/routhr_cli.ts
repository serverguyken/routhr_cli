#!/usr/bin/env node
import yargs from 'yargs';
import inquirer from 'inquirer';
import { createProject } from "../utils";
import color from "../utils/color";
import { Answers, Commands } from '../interface/interface';
import { createLog } from '../helper';
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
    'new': argv._[0] === 'new',
}

const setCommandError = () => {
    console.log('Unknown command');
    console.log(`Please use ${color.yellow('routhr <command>')}`);
    //console.log(`Available command: ${color.yellow('new')}`);
    console.log(`Available commands: ${color.yellow('new')}`);
};
//console.log(argv);
const options_get = argv;
let options: {
    'default': {
        value: boolean;
        alias: string;
    },
    'name': {
        hasValue: boolean;
        value: string;
        alias: string;
    }
} = {
    'default': {
        value: options_get.default || false,
        alias: 'a'
    },
    'name': {
        hasValue: false,
        value: options_get.name || '',
        alias: 'n'
    }
};
for (let key in options_get) {
    if (key === 'default') {
        options.default.value = options_get.default;
    }
    if (key === 'n') {
        options.name.hasValue = true;
        options.name.value = options_get.n !== true ? options_get.n : '';
    }
}


const setUp = () => {
    console.log(color.green(`Routhr CLI version: ${routhr_cli_pkg.version}`));
    console.log('A CLI for creating a routhr application');
}

const question = [{
    type: 'input',
    name: 'name',
    message: 'What is the name of your project?',
    default: 'routhr-app'
},
{
    type: 'input',
    name: 'description',
    message: 'What is the description of your project?',
    default: 'A routhr application',
},
{
    type: 'list',
    name: 'packageManager',
    message: 'Which package manager do you want to use?',
    choices: ['npm', 'yarn'],
    default: 'npm'
},
{
    type: 'input',
    name: 'install',
    message: 'Do you want to install dependencies?',
    default: 'yes',
    validate: (value: string) => {
        if (value === 'yes' || value === 'no') {
            return true;
        }
        return 'Please enter yes or no';
    }
},
{
    type: 'input',
    name: 'registry',
    message: 'Do you want to use a custom registry?',
    default: 'https://registry.npmjs.org/',
},
{
    type: 'input',
    name: 'git',
    message: 'Do you want to initialize a git repository?',
    default: 'yes',
    validate: (value: string) => {
        if (value === 'yes' || value === 'no') {
            return true;
        }
        return 'Please enter yes or no';
    }
},
];

const question2 = [
    {
        type: 'input',
        name: 'description',
        message: 'What is the description of your project?',
        default: 'A routhr application',
    },
    {
        type: 'list',
        name: 'packageManager',
        message: 'Which package manager do you want to use?',
        choices: ['npm', 'yarn'],
        default: 'npm'
    },
    {
        type: 'input',
        name: 'install',
        message: 'Do you want to install dependencies?',
        default: 'yes',
        validate: (value: string) => {
            if (value === 'yes' || value === 'no') {
                return true;
            }
            return 'Please enter yes or no';
        }
    },
    {
        type: 'input',
        name: 'registry',
        message: 'Do you want to use a custom registry?',
        default: 'https://registry.npmjs.org/'
    },
    {
        type: 'input',
        name: 'git',
        message: 'Do you want to initialize a git repository?',
        default: 'yes',
        validate: (value: string) => {
            if (value === 'yes' || value === 'no') {
                return true;
            }
            return 'Please enter yes or no';
        }
    },
];
const init = async () => {
    if (commands['-v'] || commands['--version'] || commands['version']) {
        console.log(`Routhr CLI version: ${routhr_cli_pkg.version}`);
        process.exit(0);
    }
    else if (commands['new']) {
        setUp();
        if (options.name.hasValue && options.default.value) {
            const answers: Answers = {
                name: options.name.value,
                description: 'An API server created with routhr',
                packageManager: 'npm',
                git: true,
                registry: 'https://registry.npmjs.org/',
                install: true
            }
            createProject(answers);
        } else if (options.name.hasValue && !options.default.value && options.name.value === '') {
            console.log(color.red('Please enter a name for your project'));
            process.exit(1);
        } else if (options.name.hasValue && !options.default.value && options.name.value !== '') {
            console.log(`Creating a new project with name ${color.yellow(options.name.value)}`);
            const { name, description, packageManager, registry, git, install } = await inquirer.prompt(question2);
            createProject({
                name: options.name.value,
                description,
                packageManager,
                registry: registry || 'https://registry.npmjs.org/',
                git: git === 'yes',
                install: install === 'yes',
            });
        } else {
            const { name, description, packageManager, registry, git, install } = await inquirer.prompt(question);
            createProject({
                name,
                description,
                packageManager,
                registry: registry || 'https://registry.npmjs.org/',
                git: git === 'yes',
                install: install === 'yes',
            })
        }
    } else {
        setCommandError();
        createLog()
    }
};

init();
