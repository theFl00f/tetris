const shapes = new Array();
let currentShape;
const height = 15;
const width = 10;
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const board = document.getElementById('game-board')



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
            block.innerHTML = `0: ${counter}`
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
    const shape = currentShape.shape
}