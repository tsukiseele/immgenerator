import path from "node:path"
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

const configPath = path.join('config.json')

const initialize = async () => {
    const isConfigExists = existsSync(configPath)
    if (!isConfigExists) {
        await fs.writeFile(configPath, JSON.stringify(<Configuration>{
            AUTHOR: 'Nekoha Shizuku~',
            TITLE: 'しずくの日常🏠',
            SIZE_4X: 2048,
            SIZE_3X: 1024,
            BLOCK_PIXEL_SIZE: 64,
            RESOLUTION: 32,
            IMAGE_FIT: true,
            IMAGE_BORDER: {
                enable: false,
                borderSize: 10,
                borderColor: { r: 0, g: 0, b: 0, alpha: 0 },
            },
            IMAGE_MINILIZE: true,
            MCMETA: {
                pack: {
                    pack_format: 16,
                    supported_formats: {
                        min_inclusive: 16,
                        max_inclusive: 1048576
                    },
                    description: "Painting Pack made with IMMGenerator!"
                }
            }
        }))
    }
    global.Config = JSON.parse(await fs.readFile(configPath, { encoding: 'utf-8' }))

    console.log('===================== CONFIG =====================');
    console.log(global.Config);
    console.log('==================================================');
}

export { initialize }