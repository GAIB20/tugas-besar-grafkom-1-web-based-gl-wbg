// Get element from button listener
const lineButton = document.getElementById('line');
const squareButton = document.getElementById('square');
const rectangleButton = document.getElementById('rectangle');
const polygonButton = document.getElementById('polygon');
const saveButton = document.getElementById('save');
const loadButton = document.getElementById('load');
const editButton = document.getElementById('editShape');
const clearButton = document.getElementById('clearShape');
const fillColor = document.getElementById('fill-Color');

var isDrawing = false;
var startX, startY, endX, endY;
var shapes = [];
let currentShapeType = null;

function handleMouseDown(event){
    isDrawing = true;
    startX = event.offsetX;
    startY = event.offsetY;
    if (currentShapeType == "square"){
        drawShape(gl, startX, startY, 80, 80, "square");
    }
    return shapes;
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
    alert("Memuat gambar");
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


// Define the canvas and WebGL context variables in the global scope
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");

if (!gl) {
    console.error("Unable to initialize WebGL. Your browser may not support it.");
}

function setupShapeDrawing(gl, vertices, fragColor) {
    // Create an empty buffer object to store the vertices
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vertCode =
        'attribute vec2 coordinates;' +
        'void main(void) {' +
        ' gl_Position = vec4(coordinates, 0.0, 1.0);' +
        '}';

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    var fragCode =
        'void main(void) {' +
        fragColor +
        '}';

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

    return shaderProgram;
}

function redrawShape(shapeIndex, color) {
    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas

    shapes.forEach(function(shape, index) {
        var verticesList = shape.verticesList;
        var shapeType = shape.shapeType;
        var vertices = verticesList.flat();
        let fragColor;

        if (index === shapeIndex && color) {
            fragColor = `gl_FragColor = vec4(${color});`;
        } else {
            // Set color based on shape type
            if (shapeType === "line") {
                fragColor = 'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);';
            } else if (shapeType === "square") {
                fragColor = 'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);';
            } else if (shapeType === "rectangle") {
                fragColor = 'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);';
            } else {
                console.error("Invalid shape type");
                return;
            }
        }

        var shaderProgram = setupShapeDrawing(gl, vertices, fragColor);
        var primitiveType;

        if (shapeType === "line") {
            primitiveType = gl.LINES;
        } else {
            primitiveType = gl.TRIANGLE_STRIP;
        }

        gl.drawArrays(primitiveType, 0, vertices.length / 2);
    });
}

function drawShape(gl, startX, startY, endX, endY, shapeType) {
    var vertices = [];

    if (shapeType === "line"){
        verticesList = [ [startX / canvas.width * 2 - 1, 1 - startY / canvas.height * 2],
                         [endX / canvas.width * 2 - 1, 1 - endY / canvas.height * 2] ];
        primitiveType = gl.LINES;
        var fragColor = 'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);';
    } else if (shapeType === "square"){
        verticesList = [ [startX / canvas.width * 2 - 1, 1 - startY / canvas.height * 2], 
                         [(startX + endX) / canvas.width * 2 - 1, 1 - startY / canvas.height * 2], 
                         [startX / canvas.width * 2 - 1, 1 - (startY + endY) / canvas.height * 2], 
                         [(startX + endX) / canvas.width * 2 - 1, 1 - (startY + endY) / canvas.height * 2] ];
        primitiveType = gl.TRIANGLE_STRIP;
        var fragColor = 'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);';
    } else if (shapeType === "rectangle"){
        verticesList = [ [startX / canvas.width * 2 - 1, 1 - startY / canvas.height * 2],
                            [startX / canvas.width * 2 - 1, 1 - endY / canvas.height * 2],
                            [endX / canvas.width * 2 - 1, 1 - startY / canvas.height * 2],
                            [endX / canvas.width * 2 - 1, 1 - endY / canvas.height * 2] ];
        primitiveType = gl.TRIANGLE_STRIP;
        var fragColor = 'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);';
    } else {
        console.error("Invalid shape type");
        return;
    }

    vertices = verticesList.flat();
    var shaderProgram = setupShapeDrawing(gl, vertices, fragColor);
    gl.drawArrays(primitiveType, 0, vertices.length / 2);
    storeShape(verticesList, shapeType);
    console.log(shapes);
    displayShapeList(shapes);
    redrawShape(shapes.length - 1);
}

// Store the shapes that i draw into the shapes array
function storeShape(verticesList, shapeType){
    var shape = {
        verticesList: verticesList,
        shapeType: shapeType
    };
    shapes.push(shape);
    return shapes;
}

const shapeList = document.getElementById('shape-list');

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
            });
        });
        shapeCheckbox.addEventListener('click', () => {
            console.log(`Shape ${shapeIndex + 1} clicked`);
            shape.verticesList.forEach((_, cornerIndex) => {
                const cornerCheckbox = document.getElementById(`corner-${shapeIndex + 1}-${cornerIndex + 1}`);
                cornerCheckbox.checked = shapeCheckbox.checked;
                console.log(`Shape ${shapeIndex + 1}-Corner ${cornerIndex + 1} clicked`);
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