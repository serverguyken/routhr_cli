#!/usr/bin/env node
import { program } from "commander";
import { createFile, createPkg, createTsConfig, getRouthrConfig, createFolderFromTemplate } from "../utils";
import { createProject, devServer, startServer } from "../helper";
import color from "../utils/color";
const routhr_cli_pkg = require("../../package.json");
program
    .version(routhr_cli_pkg.version)
    .description("Routhr CLI")
    .usage(`${color.green("routhr-cli <command> [options]")}`)
    .option("-c, --create <projectName>", "Create a new project")
    // option to start the dev server and optional config fil
    .option("-d, --dev", "start the dev server")
    .option("-s, --start", "start server")
    .option("-config, --config <configPath>", "config file path")
    .action((cmd, options) => {
        const create = cmd.create;
        const dev = cmd.dev;
        const start = cmd.start;
        const config = cmd.config;
        if (create) {
            createProject(create, options);
        }
        else if (dev) {
            const devOptions = program.opts();
            if (devOptions.config) {
                const configPath = devOptions.config;
                devServer(configPath);
            } else {
                devServer();
            }
        }
        else if (start) {
            const startOptions = program.opts();
            if (startOptions.config) {
                const configPath = startOptions.config;
                startServer(configPath);
            } else {
                startServer();
            }
        }
        else {
            program.help();
        }
    })
    .on("--help", () => {
        console.log(`
Examples:  
    ${color.green("routhr -n my-project")}
    `);
    })
    .parse();
const options = program.opts();
