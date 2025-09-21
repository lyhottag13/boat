import elements from './src/utils/elements.js';
import dialogue from './src/utils/dialogue.js';

const isMobile = window.innerWidth < 728;

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
        const top = isMobile ?  '35vh' : '5vh';
        const swish = isMobile ? '30vh' : '10vh';
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
        this.choice = -1;
        this.isWriting = false;
        this.swapScene(scene);
    }
    swapScene(sceneNumber) {
        this.counter = -1;
        this.scene = sceneNumber;
        this.progress();
    }
    async progress() {
        if (!this.isWriting) {
            this.counter++;
            const currentDialogue = dialogue[this.scene][this.counter];
            const body = currentDialogue.split(':')[1];
            if (currentDialogue.startsWith('CHOICE')) {
                const choices = body.split(',');
                const choice = await this.showChoices(choices);
                this.swapScene(choice);
            }
            else if (currentDialogue.startsWith('GOTO')) {
                this.scene = Number(body);
                if (this.scene === 1) {
                    elements.canvas.boat.style.left = '150%';
                }
                this.swapScene(this.scene);
            }
            else {
                this.isWriting = true;
                await writeDialogue(currentDialogue);
                this.isWriting = false;
            }
        }
    }
    showChoices(choices) {
        return new Promise(resolve => {
            for (let i = 0; i < choices.length; i++) {
                const choice = choices[i].split('|');
                const choiceText = choice[0];
                const scenePointer = choice[1];
                const choiceButton = document.createElement('button');
                choiceButton.textContent = choiceText;
                choiceButton.addEventListener('click', () => {
                    elements.div.choices.innerHTML = '';
                    resolve(scenePointer);
                });
                elements.div.choices.append(choiceButton);
            }
        });
    }
}

/**
 * 
 * @param {string} dialogue 
 */
async function writeDialogue(dialogue) {
    const { textBox } = elements.div;
    textBox.textContent = '';
    return new Promise(async resolve => {
        for (let i = 0; i < dialogue.length; i++) {
            if (dialogue.at(i) === '[') {
                /*
                Sleeps depending on how long is indicated in the dialogue string,
                formatted as [NUMBER]This is the text. In that situation, it would
                sleep as long as NUMBER specifies, then displays "This is the text".
                */
                let sleepTime = '';
                i++; // Moves the pointer to the next character.
                while (dialogue.at(i) !== ']') {
                    sleepTime += dialogue.at(i);
                    i++;
                }
                await sleep(Number(sleepTime));
            } else {
                textBox.textContent += dialogue.at(i);
            }
            await sleep(20); // Sleeps between every character.
        }
        resolve();
    });
}

/**
 * Sleeps for a certain number of milliseconds to keep track
 * of time-counting better.
 * @param {number} ms The number of ms to sleep.
 * @returns {Promise<void>} When the sleep has finished.    
 */
async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

main();