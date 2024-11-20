const calcAbsRatio = (width: number, height: number): number => {
    const whRatio = width > height ? height / width : width / height
    if (whRatio > 0.75) return 0.75
    if (whRatio > 2 / 3) return 2 / 3
    if (whRatio > 0.5) return 0.5
    return 1
}

const calcMaxBlockSize = (width: number, height: number, absRatio: number): {width: number, height: number} => {
    const maxPixelSize = width > height ? width : height
    let blockSize = 1
    if (maxPixelSize > Config.SIZE_4X) {
        blockSize = 4
    } else if (maxPixelSize > Config.SIZE_3X) {
        blockSize = 3
    } else {
        blockSize = 2
    }
    const maxSize = blockSize * Config.BLOCK_PIXEL_SIZE
    let minSize = maxSize * absRatio
    const offset = minSize % Config.BLOCK_PIXEL_SIZE
    if (offset != 0) {
        if (offset > Config.BLOCK_PIXEL_SIZE / 2) {
            minSize = minSize - offset + Config.BLOCK_PIXEL_SIZE
        } else {
            minSize = minSize - offset;
        }
    }
    if (width > height) {
        return { width: maxSize, height: minSize}
    } else {
        return { width: minSize, height: maxSize}
    }
}

const calcBlockSize = (width: number, height: number): {width: number, height: number} => {
    const ratio = calcAbsRatio(width, height)
    return calcMaxBlockSize(width, height, ratio)
}

export default calcBlockSize