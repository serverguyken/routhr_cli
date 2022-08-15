import { blue, blueBright, green, greenBright, red, redBright, yellow, yellowBright, cyan, cyanBright } from "colorette"
const color = {
    blue: (str: string) => blue(str),
    blueBright: (str: string) => blueBright(str),
    cyan: (str: string) => cyan(str),
    cyanBright: (str: string) => cyanBright(str),
    green: (str: string) => green(str),
    greenBright: (str: string) => greenBright(str),
    red: (str: string) => red(str),
    redBright: (str: string) => redBright(str),
    yellow: (str: string) => yellow(str),
    yellowBright: (str: string) => yellowBright(str),
}
export default color 