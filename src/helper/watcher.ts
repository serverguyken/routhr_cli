import chokidar from 'chokidar';
import { fork } from 'child_process';
import fs from 'fs';
import path from 'path';
const setPath = (path: string) =>{
    // check if the file path exists
    if (!fs.existsSync(path)) {
        throw new Error(`${path} does not exist`);
    }
    return path;
} 
 
export const createWatcher = (path: string, callback: (path: string) => void) => {
    setPath(path);
    const watcher = chokidar.watch(path, {
        ignoreInitial: true,
    });
    let child = fork(path);

    const restartChildProcess = () => {
        child.kill();
        child = fork(path);
        return child;
    }

    watcher.on('all', (event, path) => {
        if (event === 'add' || event === 'change') {
            child = restartChildProcess();
            callback(path);
        }
    });
    return watcher;
}