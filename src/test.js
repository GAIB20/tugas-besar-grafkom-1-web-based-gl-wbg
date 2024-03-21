// Get the canvas element
const canvas = document.getElementById('webgl-canvas');
// Initialize WebGL context
const gl = canvas.getContext('webgl');

// Vertex shader program
const vsSource = `
    attribute vec2 aPosition;

    void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`;

// Fragment shader program
const fsSource = `
    precision mediump float;
    uniform vec4 uColor;

    void main() {
        gl_FragColor = uColor;
    }
`;

// Compile shader
function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Create vertex shader
const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
// Create fragment shader
const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);

// Create shader program
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
}

gl.useProgram(shaderProgram);

// Define square vertices
const vertices = [
    -0.5, 0.5, // Top left
    -0.5, -0.5, // Bottom left
    0.5, -0.5, // Bottom right
    0.5, 0.5 // Top right
];

// Create buffer
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// Get attribute location
const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'aPosition');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// Set uniform color
const colorUniformLocation = gl.getUniformLocation(shaderProgram, 'uColor');
gl.uniform4fv(colorUniformLocation, [0.0, 0.0, 1.0, 1.0]); // Blue color

// Draw square
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
