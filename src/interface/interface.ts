export interface Config {
    server: {
        /**
         * The port to start the server on.
         */
        port: number;
        entryFile: string;
        /**
         * The path to the server entry file
         */
        path: string;
        /**
         * The package manager to use.
         */
        packageManager: 'npm' | 'yarn';
    },
    dependencies: string[];
    devDependencies: string[];
}

export interface Commands {
    '-v': boolean;
    '--version': boolean;
    'version': boolean;
    'create': boolean;
}

export interface Answers {
    name: string;
    description: string;
    packageManager: 'npm' | 'yarn';
    git: boolean;
    install: boolean;
}