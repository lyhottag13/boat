const elements = {
    canvas: {
        /** @type {HTMLCanvasElement} */
        boat: document.getElementById('boat')
    },
    div: {
        /** @type {HTMLDivElement} */
        textBox: document.getElementById('text-box'),
        /** @type {HTMLDivElement} */
        choices: document.getElementById('choices'),
    },
    span: {
        /** @type {HTMLSpanElement} */
        text: document.getElementById('text'),
    },
    img: {
        /** @type {HTMLImageElement} */
        downTriangle: document.getElementById('down-triangle'),
    },
    button: {
        /** @type {HTMLButtonElement} */
        save: document.getElementById('save'),
        /** @type {HTMLButtonElement} */
        load: document.getElementById('load'),
    }
}

export default elements;