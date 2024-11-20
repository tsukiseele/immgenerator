declare var Config: Configuration

interface Configuration {
    AUTHOR: string,
    TITLE: string,
    SIZE_4X: number,
    SIZE_3X: number,
    BLOCK_PIXEL_SIZE: number,
    RESOLUTION: number,
    IMAGE_FIT: boolean,
    IMAGE_MINILIZE: boolean,
    IMAGE_BORDER: {
        enable: boolean,
        borderSize: number,
        borderColor: { r: number, g: number, b: number, alpha: number },
    },
    MCMETA: {
        pack: {
            pack_format: number,
            supported_formats: {
                min_inclusive: number,
                max_inclusive: number
            },
            description: string
        }
    }
}

interface Painting {
    name: string,
    x: number,
    y: number
}

interface PPM {
    paintings: Painting[]
}
