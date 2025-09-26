import elements from './src/utils/elements.js';
import script from './src/utils/script.js';

const isMobile = window.innerWidth < 728;

function main() {
    loadBoatImage();
    startBoatSway();
    startDialogue();
    toggleDownTriangle();
}

let triangleInterval; // Stores the interval ID for the triangle.

function toggleDownTriangle(enabled) {
    const { downTriangle } = elements.img;
    if (enabled) {
        downTriangle.style.visibility = 'visible';
        downTriangle.style.opacity = '1';
        const cool = window.innerWidth;
        downTriangle.style.transition = 'opacity 1.5s ease';
        triangleInterval = setInterval(() => {
            if (downTriangle.style.opacity === '1') {
                downTriangle.style.opacity = '0';
            } else {
                downTriangle.style.opacity = '1';
            }
        }, 1000);
    } else {
        clearInterval(triangleInterval);
        downTriangle.style.transition = 'none';
        downTriangle.style.opacity = '0';
    }
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
    const { boat } = elements.canvas;
    const bottom = isMobile ? '35vh' : '15vh';
    const swish = isMobile ? '30vh' : '20vh';
    boat.style.bottom = bottom;
    setInterval(() => {
        if (boat.style.bottom === bottom) {
            boat.style.bottom = swish;
        } else {
            boat.style.bottom = bottom;
        }
    }, 1000);
}

function startDialogue() {
    setTimeout(() => {
        const dialogueBox = new DialogueBox(0);
        document.addEventListener('click', e => {
            if (e.target.tagName != 'BUTTON') {
                dialogueBox.progress();
            }
        });
        elements.button.save.addEventListener('click', () => {
            save(dialogueBox);
        });
        elements.button.load.addEventListener('click', () => {
            load(dialogueBox);
        });
    }, 2000);
}

class DialogueBox {
    constructor(
        /** @type {Number} */
        scene,
    ) {
        this.counter;
        this.scene;
        this.choice = -1;
        this.isWriting = false;
        this.swapScene(scene);
    }
    /**
     * Swaps the scene to the desired scene, resetting the dialogue counter in the process.
     * @param {Number} sceneNumber The number of the scene to transition to, 0-indexed.
     */
    swapScene(sceneNumber) {
        if (sceneNumber != null) {
            this.counter = -1;
            this.scene = sceneNumber;
            this.progress();
        }
    }
    async progress() {
        if (!this.isWriting) {
            this.counter++;
            const currentDialogue = script[this.scene][this.counter];
            const body = currentDialogue.split(':')[1];
            if (currentDialogue.startsWith('CHOICE')) {
                toggleDownTriangle(false);
                const text = body.split('#')[0];
                const choices = body.split('#')[1].split(',');
                await this.writeDialogue(text);
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
                await this.writeDialogue(currentDialogue);
            }
        }
    }
    /**
 * 
 * @param {string} dialogue 
 */
    async writeDialogue(dialogue) {
        const { text } = elements.span;
        this.isWriting = true;
        toggleDownTriangle(false);
        text.textContent = '';
        let skip = false;
        return new Promise(async resolve => {
            const handleLoad = (resolve) => {
                
            }
            // Prevents a click on a choice from triggering the skip on the following line of text.
            setTimeout(() => {
                document.addEventListener('click', handleSkip);
            }, 50);
            elements.button.load.addEventListener('click', handleLoad);

            // Iterates over every line in the script for special behaviors.
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
                    text.textContent += dialogue.at(i);
                    if (dialogue.at(i) === '.' && dialogue.at(i + 1) && !skip) {
                        await sleep(1000);
                    }
                }
                if (!skip) {
                    await sleep(20); // Sleeps between every character.
                }
            }
            resolve();
            toggleDownTriangle(true);
            document.removeEventListener('click', handleSkip);
            this.isWriting = false;
        });
        function handleSkip(e) {
            if (e.target.tagName != 'BUTTON') {
                document.removeEventListener('click', handleSkip);
                skip = true;
            }
        }
    }
    showChoices(choices) {
        return new Promise(resolve => {
            const handleLoadClick = (choice, resolve) => {
                this.clearChoices(choice, resolve, handleLoadClick);
            }
            for (let i = 0; i < choices.length; i++) {
                const choice = choices[i].split('|');
                const choiceText = choice[0];
                const scenePointer = choice[1];
                const choiceButton = document.createElement('button');
                choiceButton.textContent = choiceText;
                choiceButton.addEventListener('click', () => {
                    this.clearChoices(scenePointer, resolve)
                });
                elements.div.choices.append(choiceButton);
                elements.button.load.addEventListener('click', handleLoadClick);
            }
        });
    }

    /**
     * Clears the choices and resolves the promise to prevent memory leakage.
     * @param {(value) => void} resolve The resolve function for the choices promise.
     */
    clearChoices(choice, resolve, handleLoadClick) {
        elements.div.choices.innerHTML = '';
        resolve(choice);
        elements.button.load.removeEventListener('click', handleLoadClick);
    }
    setSceneAndCounter(scene, counter) {
        this.scene = scene;
        this.counter = counter - 1;
        this.progress();
    }
}

function save(dialogueBox) {
    localStorage.clear();
    localStorage.setItem('save', `${dialogueBox.scene},${dialogueBox.counter}`);
}

function load(dialoguebox) {
    const save = localStorage.getItem('save').split(',');
    dialoguebox.setSceneAndCounter(save[0], save[1]);
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