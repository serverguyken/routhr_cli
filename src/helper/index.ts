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
import { spawn } from "child_process";
const getCompIp = () => {
    return ip.address();
}
const devServer = () => {
    console.log('Starting dev server');
    const child = spawn('nodemon', ['--watch', './.routhr'], {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd()
    });
    child.on('close', (code) => {
        if (code !== 0) {
            console.log(`${color.red('[routhr]')} Error starting dev server`);
            return;
        } else {
            console.log(`${color.green('[routhr]')} Dev server started`);
        }
    });
}

const prodServer = () => {
    console.log('Starting production server');
    const child = spawn('node', ['./.routhr/server.js'], {
        stdio: 'inherit',
        shell: true,
    });
    child.on('close', (code) => {
        if (code !== 0) {
            console.log(`${color.red('[routhr]')} Error starting prod server`);
            return;
        }
    });
}


export const createDevServer = () => {
    devServer();
}

export const createServer = () => {
    prodServer();
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
    console.log(`  version                              show version`);
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