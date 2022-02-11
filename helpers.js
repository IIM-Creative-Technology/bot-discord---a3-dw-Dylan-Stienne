module.exports.levelColor = (level) => {
    if (level < 30) {
        r = 0
        g = level * 8
        b = 255 - level * 8
    } else {
        r = 255
        g = 0
        b = 0
    }
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}