// Get element from button listener
const lineButton = document.getElementById('line');
const squareButton = document.getElementById('square');
const rectangleButton = document.getElementById('rectangle');
const polygonButton = document.getElementById('polygon');
const saveButton = document.getElementById('save');
const loadButton = document.getElementById('load');
const editButton = document.getElementById('editShape');
const clearButton = document.getElementById('clearShape');
const fillColor = document.getElementById('fill-color');
const shapeList = document.getElementById('shape-list');

var isDrawing = false;
var startX, startY, endX, endY;
var shapes = [];
let currentShapeType = null;

function handleMouseDown(event){
    isDrawing = true;
    startX = event.offsetX;
    startY = event.offsetY;
}

function handleMouseMove(event){
    if (!isDrawing) return;
    endX = event.offsetX;
    endY = event.offsetY;
}

function handleMouseUp(event, shapeType){
    if (!isDrawing) return;
    isDrawing = false;

    if (currentShapeType === "line") {
        drawShape(gl, startX, startY, endX, endY, "line");
    } else if (currentShapeType === "square") {
        drawShape(gl, startX, startY, 80, 80, "square");
    } else if (currentShapeType === "rectangle") {
        drawShape(gl, startX, startY, endX, endY, "rectangle");
    }
    return shapes;
}

// Draw Button Event Listener
lineButton.addEventListener('click', function() {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    currentShapeType = "line";
    isDrawing = false;
    alert("Memulai gambar garis");
    canvas.addEventListener('mousedown', (event) => handleMouseDown(event, "line"));
    canvas.addEventListener('mousemove', (event) => handleMouseMove(event));
    canvas.addEventListener('mouseup', (event) => handleMouseUp(event, "line"));
});

squareButton.addEventListener('click', function() {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    currentShapeType = "square";
    isDrawing = false;
    alert("Memulai gambar persegi");
    canvas.addEventListener('mousedown', (event) => handleMouseDown(event, "square"));
    canvas.addEventListener('mousemove', (event) => handleMouseMove(event));
    canvas.addEventListener('mouseup', (event) => handleMouseUp(event, "square"));
});

rectangleButton.addEventListener('click', function() {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    currentShapeType = "rectangle";
    isDrawing = false;
    alert("Memulai gambar persegi panjang");
    canvas.addEventListener('mousedown', (event) => handleMouseDown(event, "rectangle"));
    canvas.addEventListener('mousemove', (event) => handleMouseMove(event));
    canvas.addEventListener('mouseup', (event) => handleMouseUp(event, "rectangle"));
});

polygonButton.addEventListener('click', function() {
    isDrawing = true;
    alert("Memulai gambar poligon");
});

// Feature Button Event Listener
saveButton.addEventListener('click', function() {
    alert("Menyimpan gambar");
    var updatedShapes = shapes;
    saveToJsonFile(updatedShapes);
});

loadButton.addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            console.log("File loaded successfully.");
            var content = readerEvent.target.result;
            shapes = JSON.parse(content);
            shapes.forEach((shape, shapeIndex) => {
                redrawShape(shapeIndex);
            });
            displayShapeList(shapes);
        }
    }
    input.click();
});

editButton.addEventListener('click', function() {
    alert("Mengedit gambar");
});

clearButton.addEventListener('click', function() {
    alert("Menghapus gambar");
    gl.clear(gl.COLOR_BUFFER_BIT);
    shapes = [];
    displayShapeList(shapes);
});

// Fill Color Event Listener
fillColor.addEventListener('input', function() {
    const selectedColor = fillColor.value; 
    const rgbaColor = hexToRgb(selectedColor);
    console.log(rgbaColor);
    console.log(shapes);
    shapes.forEach(shape => {
        shape.fragColorList = Array.from({ length: shape.fragColorList.length }, () => [...rgbaColor]);
    });
    redrawAllShapes();
});

function redrawAllShapes() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    shapes.forEach((shape, index) => redrawShape(index));
}

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    return [
        parseInt(hex.substring(0, 2), 16) / 255,
        parseInt(hex.substring(2, 4), 16) / 255,
        parseInt(hex.substring(4, 6), 16) / 255,
        1.0
    ];
}

// Define the canvas and WebGL context variables in the global scope
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");

if (!gl) {
    console.error("Unable to initialize WebGL. Your browser may not support it.");
}

var shaderProgram;

function setupShapeDrawing(gl) {
    // Vertices shader code
    var vertCode =
        'attribute vec2 coordinates;' +
        'attribute vec4 vertexColor;' +
        'varying vec4 fragColor;' +
        'void main(void) {' +
        ' gl_Position = vec4(coordinates, 0.0, 1.0);' +
        ' fragColor = vertexColor;' +
        '}';

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    // Fragment shader code
    var fragCode =
        'precision mediump float;' +
        'varying vec4 fragColor;' +
        'void main(void) {' +
        ' gl_FragColor = fragColor;' +
        '}';

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
}

function redrawShape(shapeIndex, color) {
    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas

    shapes.forEach(function(shape, index) {
        var verticesList = shape.verticesList;
        var shapeType = shape.shapeType;
        var vertices = verticesList.flat();
        var fragColorList = shape.fragColorList;

        if (index === shapeIndex && color) {
            fragColorList = Array.from({ length: fragColorList.length }, () => [...color]);
        }

        var primitiveType;
        var primitiveType = shapeType === "line" ? gl.LINES : gl.TRIANGLE_STRIP;

        setupShapeDrawing(gl);

        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fragColorList.flat()), gl.STATIC_DRAW);

        var coord = gl.getAttribLocation(shaderProgram, "coordinates");
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coord);

        var vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexColor);

        gl.drawArrays(primitiveType, 0, vertices.length / 2);
    });
}

function drawShape(gl, startX, startY, endX, endY, shapeType) {
    var vertices = [];
    var fragColorList = [ [0.0, 0.0, 0.0, 1.0], 
                          [0.0, 0.0, 0.0, 1.0], 
                          [0.0, 0.0, 0.0, 1.0], 
                          [0.0, 0.0, 0.0, 1.0] ];

    if (shapeType === "line"){
        var verticesList = [ [startX / canvas.width * 2 - 1, 1 - startY / canvas.height * 2],
                         [endX / canvas.width * 2 - 1, 1 - endY / canvas.height * 2] ];
        primitiveType = gl.LINES;
    } else if (shapeType === "square"){
        var verticesList = [ [startX / canvas.width * 2 - 1, 1 - startY / canvas.height * 2], 
                         [(startX + endX) / canvas.width * 2 - 1, 1 - startY / canvas.height * 2], 
                         [startX / canvas.width * 2 - 1, 1 - (startY + endY) / canvas.height * 2], 
                         [(startX + endX) / canvas.width * 2 - 1, 1 - (startY + endY) / canvas.height * 2] ];
        primitiveType = gl.TRIANGLE_STRIP;
    } else if (shapeType === "rectangle"){
        var verticesList = [[startX / canvas.width * 2 - 1, 1 - startY / canvas.height * 2],
                            [startX / canvas.width * 2 - 1, 1 - endY / canvas.height * 2],
                            [endX / canvas.width * 2 - 1, 1 - startY / canvas.height * 2],
                            [endX / canvas.width * 2 - 1, 1 - endY / canvas.height * 2] ];
        primitiveType = gl.TRIANGLE_STRIP;
    } else {
        console.error("Invalid shape type");
        return;
    }

    vertices = verticesList.flat();
    fragColor = fragColorList.flat();
    var shaderProgram = setupShapeDrawing(gl, vertices, fragColor);
    gl.drawArrays(primitiveType, 0, vertices.length / 2);
    storeShape(verticesList, shapeType, fragColorList);
    console.log(shapes);
    displayShapeList(shapes);
    redrawShape(shapes.length - 1);
}

function storeShape(verticesList, shapeType, fragColorList) {
    var shape = {
        verticesList: verticesList,
        shapeType: shapeType,
        fragColorList: fragColorList
    };
    shapes.push(shape);
    return shapes;
}

function displayShapeList(arrayShape) {
    shapeList.innerHTML = '';

    arrayShape.forEach((shape, shapeIndex) => {
        const shapeItem = document.createElement('ul');
        const shapeCheckbox = document.createElement('input');
        shapeCheckbox.type = 'checkbox';
        shapeCheckbox.id = `shape-${shapeIndex + 1}`;
        shapeItem.appendChild(shapeCheckbox);

        const shapeLabel = document.createElement('label');
        shapeLabel.textContent = `Shape ${shapeIndex + 1}:`;
        shapeLabel.htmlFor = `shape-${shapeIndex + 1}`;
        shapeItem.appendChild(shapeLabel);

        shape.verticesList.forEach((corner, cornerIndex) => {
            const cornerLi = document.createElement('li');
            const cornerCheckbox = document.createElement('input');
            cornerCheckbox.type = 'checkbox';
            cornerCheckbox.id = `corner-${shapeIndex + 1}-${cornerIndex + 1}`;
            cornerLi.appendChild(cornerCheckbox);

            const cornerLabel = document.createElement('label');
            cornerLabel.textContent = `Corner ${cornerIndex + 1}`;
            cornerLabel.htmlFor = `corner-${shapeIndex + 1}-${cornerIndex + 1}`;
            cornerLi.appendChild(cornerLabel);

            shapeItem.appendChild(cornerLi);

            cornerCheckbox.addEventListener('click', () => {
                console.log(`Shape ${shapeIndex + 1}-Corner ${cornerIndex + 1} clicked`);
                console.log(`Coordinate: (${corner[0]}, ${corner[1]})`);
                console.log(`Color: (${shape.fragColorList[cornerIndex][0]}, ${shape.fragColorList[cornerIndex][1]}, ${shape.fragColorList[cornerIndex][2]}, ${shape.fragColorList[cornerIndex][3]})`);
            });
        });
        shapeCheckbox.addEventListener('click', () => {
            console.log(`Shape ${shapeIndex + 1} clicked`);

            shape.verticesList.forEach((_, cornerIndex) => {
                const cornerCheckbox = document.getElementById(`corner-${shapeIndex + 1}-${cornerIndex + 1}`);
                cornerCheckbox.checked = shapeCheckbox.checked;
                console.log(`Shape ${shapeIndex + 1}-Corner ${cornerIndex + 1} clicked`);
                console.log(`Coordinate: (${shape.verticesList[cornerIndex][0]}, ${shape.verticesList[cornerIndex][1]})`);
            });
        });

        shapeList.appendChild(shapeItem);
    });
}

function saveToJsonFile(shapesArray) {
    const shapesJson = JSON.stringify(shapesArray);
    const blob = new Blob([shapesJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shapes.json';
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
}