window.onload = function() {
    // Get WebGL context
    var canvas = document.getElementById('webgl-canvas');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Change background color to yellow
    gl.clearColor(0.0, 1.0, 1.0, 1.0); // R, G, B, Alpha

    // Define vertices for a square
    var squareVertices = [
        -0.40,  0.35, 0.0,  // Top left
        -0.30, -0.15, 0.0,  // Bottom left
         0.20, -0.40, 0.0,  // Bottom right
         0.00,  0.35, 0.0   // Top right
    ];

    // Combine all vertices
    var vertices = squareVertices;

    // Create buffer for vertices for rendering
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Create vertex shader

    // Source
    var vertexShaderSource = `
        attribute vec3 coordinates;
        varying vec3 fragColor;

        void main(void) {
            gl_Position = vec4(coordinates, 1.0);
            fragColor = vec3(0.4, 0.0, 0.2);
        }
    `;

    // Create fragment shader
    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 fragColor;

        void main(void) {
            gl_FragColor = vec4(fragColor, 1.0);
        }
    `;

    // Create vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    // Create fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create shader program
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    // Associate shader programs with vertex buffer
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the square
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
};
