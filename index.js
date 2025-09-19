import elements from './src/utils/elements.js';
import dialogue from './src/utils/dialogue.js';

function main() {
    loadBoatImage();
    startBoatSway();
    startDialogue();
}

function loadBoatImage() {
    const boatImage = new Image();
    boatImage.src = './src/assets/boat.png';
    boatImage.onload = () => {
        const ctx = elements.canvas.boat.getContext('2d');
        ctx.drawImage(boatImage, 0, 0);
    }
}

function startBoatSway() {
    setInterval(() => {
        const top = '20vh';
        const swish = '25vh';
        if (boat.style.top === top) {
            boat.style.top = swish;
        } else {
            boat.style.top = top;
        }
    }, 1000);
}

function startDialogue() {
    setTimeout(() => {
        const dialogueBox = new DialogueBox(0);
        document.addEventListener('click', () => {
            dialogueBox.progress();
        });
    }, 2000);
}

class DialogueBox {
    constructor(
        scene,
    ) {
        this.box = elements.div.textBox;
        this.isWriting = false;
        this.swapScene(scene)
    }
    async swapScene(sceneNumber) {
        this.counter = -1;
        this.scene = sceneNumber;
        this.progress();
    }
    async progress() {
        if (!this.isWriting) {
            this.counter++;
            if (dialogue[this.scene][this.counter] && !this.isWriting) {
                this.isWriting = true;
                await writeDialogue(dialogue[this.scene][this.counter]);
                this.isWriting = false;
            }
        }
    }
}

/**
 * 
 * @param {string} dialogue 
 */
async function writeDialogue(dialogue) {
    const { textBox } = elements.div;
    textBox.textContent = '';
    for (let i = 0; i < dialogue.length; i++) {
        textBox.textContent += dialogue.at(i);
        await sleep(20);
    }
    return;
}

async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

main();