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

function handleMouseDown(event, shapeType){
    isDrawing = true;
    startX = event.offsetX;
    startY = event.offsetY;
    if (shapeType == "square"){
        drawShape(gl, startX, startY, 50, 50, "square");
    }
}

function handleMouseMove(event, shapeType){
    if (!isDrawing) return;
    endX = event.offsetX;
    endY = event.offsetY;
    if (shapeType == "line"){
        drawShape(gl, startX, startY, endX, endY, "line");
    } else if (shapeType == "rectangle"){
        drawShape(gl, startX, startY, endX, endY, "rectangle");
    }
}

function handleMouseUp(event){
    isDrawing = false;
}

// Draw Button Event Listener
lineButton.addEventListener('click', function() {
    alert("Memulai gambar garis");
    canvas.addEventListener('mousedown', (event) => handleMouseDown(event, "line"));
    canvas.addEventListener('mousemove', (event) => handleMouseMove(event, "line"));
    canvas.addEventListener('mouseup', handleMouseUp);
});

squareButton.addEventListener('click', function() {
    alert("Memulai gambar persegi");
    canvas.addEventListener('mousedown', (event) => handleMouseDown(event, "square"));
    canvas.addEventListener('mousemove', (event) => handleMouseMove(event, "square"));
    canvas.addEventListener('mouseup', handleMouseUp);
});

rectangleButton.addEventListener('click', function() {
    alert("Memulai gambar persegi panjang");
    canvas.addEventListener('mousedown', (event) => handleMouseDown(event, "rectangle"));
    canvas.addEventListener('mousemove', (event) => handleMouseMove(event, "rectangle"));
    canvas.addEventListener('mouseup', handleMouseUp);
});

polygonButton.addEventListener('click', function() {
    isDrawing = true;
    alert("Memulai gambar poligon");
});

// Feature Button Event Listener
saveButton.addEventListener('click', function() {
    alert("Menyimpan gambar");
});

loadButton.addEventListener('click', function() {
    alert("Memuat gambar");
});

editButton.addEventListener('click', function() {
    alert("Mengedit gambar");
});

clearButton.addEventListener('click', function() {
    alert("Menghapus gambar");
    gl.clear(gl.COLOR_BUFFER_BIT);
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

function redrawSquare() {
    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas
    shapes.forEach(function(shape) {
        var verticesList = shape.verticesList;
        var shapeType = shape.shapeType;
        var vertices = verticesList.flat();
        var fragColor;

        if (shapeType === "line") {
            fragColor = 'gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);'; // Blue color for the line
        } else if (shapeType === "square") {
            fragColor = 'gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);'; // Green color for the square
        } else if (shapeType === "rectangle") {
            fragColor = 'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);'; // Red color for the rectangle
        } else {
            console.error("Invalid shape type");
            return;
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
        var fragColor = 'gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);'; // Blue color for the line
    } else if (shapeType === "square"){
        verticesList = [ [startX / canvas.width * 2 - 1, 1 - startY / canvas.height * 2], 
                         [(startX + endX) / canvas.width * 2 - 1, 1 - startY / canvas.height * 2], 
                         [startX / canvas.width * 2 - 1, 1 - (startY + endY) / canvas.height * 2], 
                         [(startX + endX) / canvas.width * 2 - 1, 1 - (startY + endY) / canvas.height * 2] ];
        primitiveType = gl.TRIANGLE_STRIP;
        var fragColor = 'gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);'; // Green color for the square
    } else if (shapeType === "rectangle"){
        verticesList = [ [startX / canvas.width * 2 - 1, 1 - startY / canvas.height * 2],
                            [startX / canvas.width * 2 - 1, 1 - endY / canvas.height * 2],
                            [endX / canvas.width * 2 - 1, 1 - startY / canvas.height * 2],
                            [endX / canvas.width * 2 - 1, 1 - endY / canvas.height * 2] ];
        primitiveType = gl.TRIANGLE_STRIP;
        var fragColor = 'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);'; // Red color for the rectangle
    } else {
        console.error("Invalid shape type");
        return;
    }

    vertices = verticesList.flat();
    var shaderProgram = setupShapeDrawing(gl, vertices, fragColor);
    gl.drawArrays(primitiveType, 0, vertices.length / 2);
    storeShape(verticesList, shapeType);

    redrawSquare();
}

// Store the shapes that i draw into the shapes array
function storeShape(verticesList, shapeType){
    var shape = {
        verticesList: verticesList,
        shapeType: shapeType
    };
    shapes.push(shape);
    console.log(shapes);
}

// Array dummy test for shape list
var arrayDummy = [ [[0.5, 0.5], [0.5, -0.5], [-0.5, 0.5], [-0.5, -0.5]], [[0.5, 0.5], [0.5, -0.5], [-0.5, 0.5], [-0.5, -0.5]], [[0.5, 0.5], [0.5, -0.5], [-0.5, 0.5], [-0.5, -0.5]] ];

const shapeList = document.getElementById('shape-list');
function displayShapeList(){
    shapeList.innerHTML = '';
    arrayDummy.forEach((shapeArray, shapeIndex) => {
        const shapeItem = document.createElement('ul');

        // Add checkbox to each shapeItem
        const shapeCheckbox = document.createElement('input');
        shapeCheckbox.type = 'checkbox';
        shapeItem.appendChild(shapeCheckbox);
        
        // Set text content for the shapeItem
        shapeItem.textContent = `Shape ${shapeIndex + 1}:`;

        shapeArray.forEach((corner, cornerIndex) => {
            const cornerLi = document.createElement('li');
            
            // Add checkbox to each cornerLi
            const cornerCheckbox = document.createElement('input');
            cornerCheckbox.type = 'checkbox';
            cornerLi.appendChild(cornerCheckbox);
            
            cornerLi.textContent = JSON.stringify(corner);
            shapeItem.appendChild(cornerLi);

            // Add event listener to each cornerLi (li)
            cornerLi.addEventListener('click', () => {
                cornerLi.innerHTML = ''; // Clear previous content
                const newCornerLi = document.createElement('li');
                newCornerLi.textContent = JSON.stringify(corner); // Repopulate with the same content
                cornerLi.appendChild(newCornerLi);
            });
        });

        shapeList.appendChild(shapeItem);
    });
}

displayShapeList();