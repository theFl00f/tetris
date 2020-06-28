const shapes = new Array();
let currentShape;
const height = 15;
const width = 10;
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const board = document.getElementById('game-board')
let direction = "";
let state = 1;      // 1 running - 0 paused - 2 game over
let move = 0;
let occupiedblocks = new Array();
// const points = 0;



const createBoard = () => {
    board.innerHTML = '';
    let counter = 0;
    for(let y = 0; y < height; y++) {
        const row = document.createElement('div');
        row.className = 'row';
        row.dataset.row = y;
        for (let x = 0; x < width; x++) {
            const block = document.createElement('div');
            block.className = 'block';
            block.dataset.x = x;
            block.dataset.y = y;
            block.dataset.index = counter;
            block.dataset.state = 0;
            block.innerHTML = `${counter} <br>
            ${x}, ${y}`
            row.appendChild(block);
            counter++;
        }
        board.appendChild(row);
    }
}

const createShapes = () => {
    const line = [[0,0],[0,1],[0,2],[0,3]];
    const square = [[0,0],[0,1],[1,0],[1,1]];
    const l = [[2,0],[0,1],[1,1],[2,1]];
    const t = [[1,0],[0,1],[1,1],[2,1]];
    const other = [[0,1],[1,1],[1,0],[2,0]]
    shapes.push(line);
    shapes.push(square)
    shapes.push(l)
    shapes.push(t)
    shapes.push(other)
}

const createShape = () => {
    const randomShape = Math.floor(Math.random() * shapes.length);
    const randomColor = Math.floor(Math.random() * colors.length);
    const center = Math.floor(width / 2);
    const shape = shapes[randomShape];
    const color = colors[randomColor];
    const location = [center, 0];

    currentShape = {
        shape: shape,
        color: color,
        location: location,
        indexes: getBlockNumbers(shape, location)
    }


}

const drawShape = () => {
    collided()
    let shape = currentShape.shape;
    let location = currentShape.location;

    clearCurrent()

    if (direction=='down') {
        currentShape.location[1]++;
    } 
    else if (direction=='left') {
        currentShape.location[0]--
    }
    else if (direction=='right') {
        currentShape.location[0]++
    }
    direction = '';
    for (let i = 0; i < shape.length; i++) {
        const x = shape[i][0] + location[0];
        const y = shape[i][1] + location[1];
        const block = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
        block.classList.add('filled');
        block.style.backgroundColor = currentShape.color;
    }
    currentShape.indexes = getBlockNumbers(currentShape.shape, currentShape.location)
}

const clearCurrent = () => {
    const shape = currentShape.shape;
    const location = currentShape.location;

    for(let i = 0; i < shape.length; i++) {
        const x = shape[i][0] + location[0];
        const y = shape[i][1] + location[1];
        const block = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
        block.classList.remove('filled');
        block.style.backgroundColor = '';
    }
}

const checkKey = (e) => {
    if (e.keyCode == '40' || e.keyCode == '37' || e.keyCode == '38' || e.keyCode == '39') {
        e.preventDefault();
    }
    if (e.keyCode === 40) {
        direction = 'down';
    } 
    else if (e.keyCode === 37) {
        direction = 'left';
    }
    else if (e.keyCode == '39') {
        direction = 'right'
    }
    if (isCollidingWall() === false) {
        drawShape()
    }
}


const getBlockNumbers = (shape, location) => {
    const numbers = new Array();
    for (let i = 0; i < shape.length; i++) {
        let x = shape[i][0] + location[0];
        let y = shape[i][1] + location[1];

        let block = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        numbers.push(block.dataset.index)
    }
    return numbers;
}

const isCollidingWall = () => {
    const blocks = currentShape.shape
    const offset = currentShape.location;
    let collision = false;
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        let x = block[0] + offset[0];
        let y = block[1] + offset[1];
        if (direction == 'left') {
            x--;
        } 
        else if (direction == 'right') {
            x++;
        }

        const blockDOM = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)

        if (occupiedblocks.indexOf(blockDOM.dataset.index) >= 0) {
            collision = true;
            break;
        } else if (x < 0 && direction == 'left' ) {
            collision = true;
            break;
        } else if (x == width && direction == 'right') {
            collision = true;
            break;
        }
    }
    return collision;
}

const collided = () => {
    const blocks = currentShape.shape
    const offset = currentShape.location;
    let collision = false;

    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        let x = block[0] + offset[0];
        let y = block[1] + offset[1];

        if (direction == 'down') {
            y++;
        }
        
        const blockDOM = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)

        if (y == height || occupiedblocks.indexOf(blockDOM.dataset.index) > -1) {
            collision = true;
            break;
        }

    }
    if (collision) {
        for (let i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            let x = block[0] + offset[0];
            let y = block[1] + offset[1];
            const blockDOM = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
            blockDOM.dataset.state = '1'

        }

        occupiedblocks = occupiedblocks.concat(currentShape.indexes);
        createShape();
        checkRows();
    }
}

const checkRows = () => {
    let counter = 0;
    let start = 0;
    
    for (let y = 0; y < height; y++) {
        let filled = true;
        for (let x = 0; x < width; x++) {
            const blockDOM =  document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            if (blockDOM.dataset.state == 0) {
                filled = false;
                break;
            }
        }

        if (filled) {
            if (start == 0) {
                start = y;
            }
            counter++;

            for (let i = 0; i < width; i++) {
                const blockDOM = document.querySelector(`[data-x="${i}"][data-y="${y}"]`);
                blockDOM.dataset.state = 0;
                blockDOM.style.backgroundColor = 'white';
                removeIndex(blockDOM.dataset.index)
            }
        }
    }

    if (counter > 0) {
        shiftDown(counter, start)
    }
}

const removeIndex = (index) => {
    const location = occupiedblocks.indexOf(index);
    occupiedblocks.splice(location, 1)
}

const shiftDown = (counter, start) => {
    for (let i = start - 1; i >= 0; i--) {
        for (let x = 0; x < width; x++) {
            let y = i + counter;
            const blockDOM = document.querySelector(`[data-x="${x}"][data-y="${i}"]`);
            const nextBlock = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    
            if (blockDOM.dataset.state == 1) {
                nextBlock.style.backgroundColor = blockDOM.style.backgroundColor;
                nextBlock.dataset.state = 1;
                blockDOM.style.backgroundColor = 'white';
                blockDOM.dataset.state = 0;
                removeIndex(blockDOM.dataset.index);
                occupiedblocks.push(nextBlock.dataset.index)
            }
        }

    }
}

const rotate = () => {
    let newShape = new Array();
    let shape = currentShape.shape;

    for (let i = 0; i < shape.length; i++) {
        let x = shape[i][0];
        let y = shape[i][1];
        let newX = (getWidth() - y)
        let newY = x;
        newShape.push([newX, newY])
    }

    clearCurrent();
    currentShape.shape = newShape;
    currentShape.indexes = getBlockNumbers(newShape, currentShape);
}

const getWidth = () => {
    let width = 0;

    for (let i = 0; i < currentShape.shape.length; i++) {
        let block = currentShape.shape[i];
        if (block[0] > width) {
            
        }
    }
}


const start = () => {
    createBoard();
    createShapes();
    createShape();
    drawShape();
    document.onkeydown = checkKey
}

window.addEventListener('load', () => {
    start();
})


