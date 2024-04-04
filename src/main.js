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
const unchecked = document.getElementById('uncheck');

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
    alert("Memulai gambar garis");
    fillColor.value = "#000000";
    canvas.addEventListener('mousedown', (event) => handleMouseDown(event, "line"));
    canvas.addEventListener('mousemove', (event) => handleMouseMove(event));
    canvas.addEventListener('mouseup', (event) => handleMouseUp(event, "line"));
});

squareButton.addEventListener('click', function() {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    currentShapeType = "square";
    alert("Memulai gambar persegi");
    fillColor.value = "#000000";
    canvas.addEventListener('mousedown', (event) => handleMouseDown(event, "square"));
    canvas.addEventListener('mousemove', (event) => handleMouseMove(event));
    canvas.addEventListener('mouseup', (event) => handleMouseUp(event, "square"));
});

rectangleButton.addEventListener('click', function() {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    currentShapeType = "rectangle";
    alert("Memulai gambar persegi panjang");
    fillColor.value = "#000000";
    canvas.addEventListener('mousedown', (event) => handleMouseDown(event, "rectangle"));
    canvas.addEventListener('mousemove', (event) => handleMouseMove(event));
    canvas.addEventListener('mouseup', (event) => handleMouseUp(event, "rectangle"));
});

var polygonVertices = [];
var polygonFragColor = [];

function addVertexToPolygon(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / canvas.width * 2 - 1;
    const y = -((event.clientY - rect.top) / canvas.height * 2 - 1);

    polygonVertices.push([x, y]);
    polygonFragColor.push(hexToRgb(fillColor.value));
}

polygonButton.addEventListener('click', function() {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    currentShapeType = "polygon";
    alert("Memulai gambar poligon");
    fillColor.value = "#000000";
    polygonVertices.length = 0;
    canvas.addEventListener('mousedown', addVertexToPolygon);
    drawPolygon(gl, polygonVertices, polygonFragColor);
});

// Feature Button Event Listener
saveButton.addEventListener('click', function() {
    alert("Menyimpan gambar");
    var updatedShapes = shapes;
    const shapesJson = JSON.stringify(updatedShapes);
    const blob = new Blob([shapesJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shapes.json';
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
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
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    isDrawing = false;
    currentShapeType = null;
    alert("Mengedit gambar");
});

clearButton.addEventListener('click', function() {
    alert("Menghapus gambar");
    gl.clear(gl.COLOR_BUFFER_BIT);
    shapes = [];
    displayShapeList(shapes);
});

unchecked.addEventListener('click', function() {
    const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
});

// Fill Color Event Listener
fillColor.addEventListener('input', function() {
    const selectedColor = fillColor.value; 
    const rgbaColor = hexToRgb(selectedColor);
    
    // Iterate through each shape
    shapes.forEach(shape => {
        const shapeCheckbox = document.getElementById(`shape-${shapes.indexOf(shape) + 1}`);
        const cornerCheckboxes = Array.from({ length: shape.verticesList.length }, (_, index) => document.getElementById(`corner-${shapes.indexOf(shape) + 1}-${index + 1}`));
        if (shapeCheckbox.checked) {
            shape.fragColorList = Array.from({ length: shape.fragColorList.length }, () => [...rgbaColor]);
        }
        cornerCheckboxes.forEach((cornerCheckbox, cornerIndex) => {
            if (cornerCheckbox.checked) {
                shape.fragColorList[cornerIndex] = [...rgbaColor];
            }
        });
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

// Transformations Listener
const translationX = document.getElementById('translation-x');
const translationY = document.getElementById('translation-y');
const dilatationValue = document.getElementById('dilatationValue');
const dilatationButton = document.getElementById('dilatationButton');
const rotateValue = document.getElementById('rotateValue');
const rotateButton = document.getElementById('rotateButton');
const shearXValue = document.getElementById('shear-x');
const shearXButton = document.getElementById('shearXButton');
const shearYValue = document.getElementById('shear-y');
const shearYButton = document.getElementById('shearYButton');

translationX.addEventListener('input', function() {
    const translationValue = parseFloat(translationX.value); 

    shapes.forEach((selectedShape, index) => { 
        const shapeCheckbox = document.getElementById(`shape-${index + 1}`);
        const cornerCheckboxes = Array.from({ length: selectedShape.verticesList.length }, (_, cornerIndex) => document.getElementById(`corner-${index + 1}-${cornerIndex + 1}`));
        if (shapeCheckbox.checked) {
            const [minX, maxX] = getMinMaxX(selectedShape.verticesList); 
            const centerX = (minX + maxX) / 2; 
            const translationDistance = translationValue - centerX; 

            selectedShape.verticesList.forEach(corner => {
                corner[0] += translationDistance; 
            });
        } else if (cornerCheckboxes.some(cornerCheckbox => cornerCheckbox.checked)) {
            // Calculate the center translation distance
            const [minX, maxX] = getMinMaxX(selectedShape.verticesList); 
            const centerX = (minX + maxX) / 2; 
            const translationDistance = translationValue - centerX; 
            
            cornerCheckboxes.forEach((cornerCheckbox, cornerIndex) => {
                if (cornerCheckbox.checked) {
                    selectedShape.verticesList[cornerIndex][0] += translationDistance; 
                }
            });
        }
    });
    redrawAllShapes(); 
});

translationY.addEventListener('input', function() {
    const translationValue = parseFloat(translationY.value); 
    shapes.forEach((selectedShape, index) => {
        const shapeCheckbox = document.getElementById(`shape-${index + 1}`);
        const cornerCheckboxes = Array.from({ length: selectedShape.verticesList.length }, (_, cornerIndex) => document.getElementById(`corner-${index + 1}-${cornerIndex + 1}`));
        if (shapeCheckbox.checked) {
            const [minY, maxY] = getMinMaxY(selectedShape.verticesList);
            const centerY = (minY + maxY) / 2;
            const translationDistance = translationValue - centerY; 
            selectedShape.verticesList.forEach(corner => {
                corner[1] += translationDistance;
            });
        } else if (cornerCheckboxes.some(cornerCheckbox => cornerCheckbox.checked)) {
            const [minY, maxY] = getMinMaxY(selectedShape.verticesList);
            const centerY = (minY + maxY) / 2;
            const translationDistance = translationValue - centerY; 

            cornerCheckboxes.forEach((cornerCheckbox, cornerIndex) => {
                if (cornerCheckbox.checked) {
                    console.log(`Shape ${index + 1}-Corner ${cornerIndex + 1} clicked`);
                    selectedShape.verticesList[cornerIndex][1] += translationDistance; 
                }
            });
        }
    }); 
    redrawAllShapes();
});

// Function to get the minimum and maximum X coordinates of the shape
function getMinMaxX(verticesList) {
    let minX = verticesList[0][0];
    let maxX = verticesList[0][0];
    verticesList.forEach(corner => {
        minX = Math.min(minX, corner[0]);
        maxX = Math.max(maxX, corner[0]);
    });
    return [minX, maxX];
}

function getMinMaxY(verticesList) {
    let minY = verticesList[0][1];
    let maxY = verticesList[0][1];
    verticesList.forEach(corner => {
        minY = Math.min(minY, corner[1]);
        maxY = Math.max(maxY, corner[1]);
    });
    return [minY, maxY];
}

rotateButton.addEventListener('click', function() {
    const degreeAngle = parseFloat(rotateValue.value);
    var radianAngle = degreeAngle * Math.PI / 180;
    var cosAngle = Math.cos(radianAngle);
    var sinAngle = Math.sin(radianAngle);

    shapes.forEach((selectedShape, index) => {
        const shapeCheckbox = document.getElementById(`shape-${index + 1}`);
        if (shapeCheckbox.checked) {
            const [minY, maxY] = getMinMaxY(selectedShape.verticesList);
            const [minX, maxX] = getMinMaxX(selectedShape.verticesList); 
            const centerY = (minY + maxY) / 2;
            const centerX = (minX + maxX) / 2;
            selectedShape.verticesList.forEach(corner => {
                var tempX = corner[0] - centerX;
                var tempY = corner[1] - centerY;
                corner[0] = tempX * cosAngle - tempY * sinAngle + centerX;
                corner[1] = tempX * sinAngle + tempY * cosAngle + centerY;
            });
        }
    });

    redrawAllShapes();
})

dilatationButton.addEventListener('click', function() {
    const dilatationFactor = parseFloat(dilatationValue.value);
    shapes.forEach((selectedShape, index) => {
        const shapeCheckbox = document.getElementById(`shape-${index + 1}`);
        if (shapeCheckbox.checked) {
            const [minY, maxY] = getMinMaxY(selectedShape.verticesList);
            const [minX, maxX] = getMinMaxX(selectedShape.verticesList); 
            const centerY = (minY + maxY) / 2;
            const centerX = (minX + maxX) / 2;
            selectedShape.verticesList.forEach(corner => {
                var tempX = corner[0] - centerX;
                var tempY = corner[1] - centerY;
                corner[0] = tempX * dilatationFactor + centerX;
                corner[1] = tempY * dilatationFactor + centerY;
            });
        }
    });

    redrawAllShapes();
});

shearXButton.addEventListener('click', function() {
    const shear = parseFloat(shearXValue.value)
    shapes.forEach((selectedShape, index) => {
        const shapeCheckbox = document.getElementById(`shape-${index + 1}`);
        if (shapeCheckbox.checked) {
            selectedShape.verticesList.forEach(corner => {
                corner[0] = corner[1] * shear + corner[0]
            });
        }
    });

    redrawAllShapes();
})

shearYButton.addEventListener('click', function() {
    const shear = parseFloat(shearYValue.value)
    shapes.forEach((selectedShape, index) => {
        const shapeCheckbox = document.getElementById(`shape-${index + 1}`);
        if (shapeCheckbox.checked) {
            selectedShape.verticesList.forEach(corner => {
                corner[1] = corner[0] * shear + corner[1]
            });
        }
    });

    redrawAllShapes();
})



function getSelectedShapeIndex() {
    const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            return i;
        }
    }
    return -1;
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

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling vertex shader:', gl.getShaderInfoLog(vertShader));
        return;
    }

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

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling fragment shader:', gl.getShaderInfoLog(fragShader));
        return;
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
}

function redrawShape(shapeIndex) {
    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas

    shapes.forEach(function(shape, index) {
        var verticesList = shape.verticesList;
        var shapeType = shape.shapeType;
        var vertices = verticesList.flat();
        var fragColorList = shape.fragColorList;

        var primitiveType;
        // If the shape is a line, use gl.LINES
        if (shapeType === "line") {
            primitiveType = gl.LINES;
        } else if (shapeType === "square" || shapeType === "rectangle") {
            primitiveType = gl.TRIANGLE_STRIP;
        } else if (shapeType === "polygon") {
            primitiveType = gl.TRIANGLE_FAN;
        }

        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        setupShapeDrawing(gl);

        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fragColorList.flat()), gl.STATIC_DRAW);

        var coord = gl.getAttribLocation(shaderProgram, "coordinates");
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.enableVertexAttribArray(coord);
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

        var vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexColor);

        gl.drawArrays(primitiveType, 0, vertices.length / 2);
    });
}

function drawShape(gl, startX, startY, endX, endY, shapeType) {
    var vertices = [];
    var selectedColor = hexToRgb(fillColor.value);
    var fragColorList = [selectedColor, selectedColor, selectedColor, selectedColor];

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
                            [endX / canvas.width * 2 - 1, 1 - startY / canvas.height * 2],
                            [startX / canvas.width * 2 - 1, 1 - endY / canvas.height * 2],
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

const stopPolygon = document.getElementById('stopPolygon');

function drawPolygon(gl, verticesList, fragColorList) {
    stopPolygon.addEventListener('click', function() {
        currentShapeType = null;
        if (verticesList.length < 3) {
            alert("Minimal 3 sudut untuk membuat poligon");
            return;
        }
        var verticesListFinal = convexHull(verticesList);
        var fragColorFinal = verticesListFinal.map(() => hexToRgb(fillColor.value));
        var vertices = verticesListFinal.flat();
        var fragColor = fragColorFinal.flat();
        var shaderProgram = setupShapeDrawing(gl, vertices, fragColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);
        storeShape(verticesListFinal, "polygon", fragColorFinal);
        displayShapeList(shapes);
        redrawShape(shapes.length - 1);
    });
}

function crossProduct(p1, p2, p3) {
    return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
}

function convexHull(points) {
    points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const lowerHull = [];
    for (const point of points) {
        while (lowerHull.length >= 2 && crossProduct(lowerHull[lowerHull.length - 2], lowerHull[lowerHull.length - 1], point) <= 0) {
            lowerHull.pop();
        }
        lowerHull.push(point);
    }
    
    const upperHull = [];
    for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        while (upperHull.length >= 2 && crossProduct(upperHull[upperHull.length - 2], upperHull[upperHull.length - 1], point) <= 0) {
            upperHull.pop();
        }
        upperHull.push(point);
    }
    
    upperHull.pop();
    lowerHull.pop();
    return lowerHull.concat(upperHull);
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

const moveCorner = document.getElementById('moveCorner');

function displayShapeList(arrayShape) {
    shapeList.innerHTML = '';

    arrayShape.forEach((shape, shapeIndex) => {
        const shapeItem = document.createElement('ul');
        const shapeCheckbox = document.createElement('input');
        shapeCheckbox.type = 'checkbox';
        shapeCheckbox.id = `shape-${shapeIndex + 1}`;
        shapeItem.appendChild(shapeCheckbox);

        const shapeLabel = document.createElement('label');
        shapeLabel.textContent = shape.shapeType.charAt(0).toUpperCase() + shape.shapeType.slice(1) + ` ${shapeIndex + 1}`;
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

            moveCorner.addEventListener('click', () => {
                cornerCheckbox.addEventListener('click', () => {
                    if (cornerCheckbox.checked) {
                        console.log(`Shape ${shapeIndex + 1}-Corner ${cornerIndex + 1} clicked`);
                        console.log(`Coordinate: (${shape.verticesList[cornerIndex][0]}, ${shape.verticesList[cornerIndex][1]})`);
                        console.log(`Color: (${shape.fragColorList[cornerIndex][0]}, ${shape.fragColorList[cornerIndex][1]}, ${shape.fragColorList[cornerIndex][2]}, ${shape.fragColorList[cornerIndex][3]})`);
                    
                        isDrawing = false;
                        canvas.addEventListener('mousemove', moveCorner);
                
                        function moveCorner(event) {
                            shape.verticesList[cornerIndex][0] = event.offsetX / canvas.width * 2 - 1;
                            shape.verticesList[cornerIndex][1] = 1 - event.offsetY / canvas.height * 2;
                            redrawAllShapes();
                        }
                
                        canvas.addEventListener('mouseup', function mouseUpHandler() {
                            canvas.removeEventListener('mousemove', moveCorner);
                            canvas.removeEventListener('mouseup', mouseUpHandler);
                            displayShapeList(shapes);
                        });
                    }
                });
            },);
        });

        shapeCheckbox.addEventListener('click', () => {
            console.log(`Shape ${shapeIndex + 1} clicked`);
            shape.verticesList.forEach((_, cornerIndex) => {
                if (shapeCheckbox.checked) {
                    const cornerCheckbox = document.getElementById(`corner-${shapeIndex + 1}-${cornerIndex + 1}`);
                    cornerCheckbox.checked = shapeCheckbox.checked;
                    console.log(`Shape ${shapeIndex + 1}-Corner ${cornerIndex + 1} clicked`);
                    console.log(`Coordinate: (${shape.verticesList[cornerIndex][0]}, ${shape.verticesList[cornerIndex][1]})`);
                    console.log(`Color: (${shape.fragColorList[cornerIndex][0]}, ${shape.fragColorList[cornerIndex][1]}, ${shape.fragColorList[cornerIndex][2]}, ${shape.fragColorList[cornerIndex][3]})`);
                } else {
                    const cornerCheckbox = document.getElementById(`corner-${shapeIndex + 1}-${cornerIndex + 1}`);
                    cornerCheckbox.checked = shapeCheckbox.checked;
                }
            });
        });

        shapeList.appendChild(shapeItem);
    });
}