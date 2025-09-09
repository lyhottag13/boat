import elements from './src/utils/elements.js';

function main() {
    loadBoatImage();
    startBoatSway();
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

main();