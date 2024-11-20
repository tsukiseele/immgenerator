import path from "node:path";
import { createWriteStream } from "node:fs";
import fs from 'node:fs/promises'
// import sizeOf from "image-size";
import calcBlockSize from "./calc.ts";
import { readPathInput, deepLoopTraversal } from "./utils.ts";
import archiver from 'archiver'
import { initialize } from "./app.ts";
import sharp from "sharp";
// import 
// require("@img/sharp-win32-x64");
// initialize
await initialize()
do {
    // generate pack config
    const inputDir = await readPathInput()
    const outputPath = path.join(inputDir, '../', path.basename(inputDir) + '.zip')
    console.log('INPUT <<< ', inputDir);
    console.log('Processing...');
    const timestamp = Date.now()

    const filePathArr = [];
    await deepLoopTraversal(inputDir, filePathArr, [".png", ".jpg"]);

    const packageName = "nyarray_packs_" + Date.now().toString(36);
    const paintings: Painting[] = [];
    const imageDataSet: Promise<Buffer>[] = []

    const generateConfiguration = async (files: string[]) => {
        let index = 0
        for (const file of files) {
            let image = sharp((await fs.readFile(file)).buffer);
            const metadata = await image.metadata()
            let size = { width: metadata.width!, height: metadata.height! }
            const { width: x, height: y } = calcBlockSize(size.width, size.height);

            if (Config.IMAGE_MINILIZE) {
                size = { width: Math.floor(size.width / 2), height: Math.floor(size.height / 2) }
                image = image.resize(size.width, size.height)
            }
            if (Config.IMAGE_BORDER.enable) {
                image = image.extend({
                    top: Config.IMAGE_BORDER.borderSize,
                    bottom: Config.IMAGE_BORDER.borderSize,
                    left: Config.IMAGE_BORDER.borderSize,
                    right: Config.IMAGE_BORDER.borderSize,
                    background: Config.IMAGE_BORDER.borderColor
                })
            }
            if (Config.IMAGE_FIT) {
                image = image.resize(
                    Math.floor(x > y ? size.width : size.height * x / y),
                    Math.floor(x > y ? size.width * y / x : size.height),
                    { fit: 'cover' })
            }
            imageDataSet.push(image.toBuffer())
            paintings.push({ name: `${(index++).toString().padStart(3, '0')}`, x, y });
        }
        return JSON.stringify(paintings)
    }
    await generateConfiguration(filePathArr)
    // create resource pack
    const output = createWriteStream(outputPath)
    const archive = archiver("zip", { zlib: { level: 9 } })
    archive.pipe(output)
    // archive.append(await generateConfiguration(filePathArr) || '', { name: 'paintings++.json' })
    archive.append(JSON.stringify(Config.MCMETA), { name: 'pack.mcmeta' })

    for (let i = 0; i < paintings.length; i++) {
        const painting = paintings[i]
        const image = await imageDataSet[i]
        const entryName = Config.TITLE + ' No.' + painting.name
        const entryPath = `data/${packageName}/paintings/${painting.name}`
        const { width, height } = { width: painting.x / 16, height: painting.y / 16 }
        archive.append(image, {
            name: `${entryPath}.png`
        })
        archive.append(JSON.stringify({
            name: entryName,
            author: Config.AUTHOR,
            resolution: Config.RESOLUTION,
            width,
            height
        }), {
            name: `${entryPath}.json`
        })
    }
    // ppm.paintings.forEach(async (painting, index) => {
    //     const image = await imageDataSet[index]

    //     archive.append(image, {
    //         name: `assets/${packageName}/textures/painting/${painting.name.split(':')[1]}.png`
    //     })
    //     // archive.file(filePathArr[index], {
    //     //     name: `assets/${packageName}/textures/painting/${painting.name.split(':')[1]}.png`
    //     // })
    // })
    await archive.finalize();

    console.log('Completed!', `(${Date.now() - timestamp}ms)`);
    console.log('OUTPUT >>> ', outputPath);
    console.log('\r\n\r\n');
    
} while (true)