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
        -0.90,  0.35, 0.0,  // Top left
        -0.80, -0.15, 0.0,  // Bottom left
        -0.30, -0.40, 0.0,  // Bottom right
        -0.50,  0.35, 0.0   // Top right
    ];

    // Define vertices for a triangle
    var triangleVertices = [
        0.40,  0.35, 0.0,  // Top
        -0.15, -0.25, 0.0,   // Bottom left
        0.35, -0.25, 0.0     // Bottom right
    ];

    // Define vertices for a circle
    var circleVertices = [];
    var numSegments = 30;
    var radius = 0.2;
    var centerX = 0.65;
    var centerY = 0.0;
    for (var i = 0; i < numSegments; i++) {
        var theta = (2 * Math.PI * i) / numSegments;
        var x = centerX + radius * Math.cos(theta);
        var y = centerY + radius * Math.sin(theta);
        circleVertices.push(x, y, 0.0);
    }

    // Combine all vertices
    var vertices = squareVertices.concat(triangleVertices, circleVertices);

    // Create buffer for vertices for rendering
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Create vertex shader

    // Source
    var vertexShaderSource = `
        attribute vec3 coordinates;
        uniform mat4 modelViewMatrix;
        void main(void) {
            gl_Position = modelViewMatrix * vec4(coordinates, 1.0);
        }
    `;

    // Create fragment shader
    var fragmentShaderSource = `
        precision mediump float;
        void main(void) {
            // Define orange and purple colors
            vec3 orange = vec3(1.0, 0.5, 0.0);
            vec3 purple = vec3(0.5, 0.0, 0.5);

            // Calculate gradient color based on fragment position
            vec3 color = orange + (gl_FragCoord.y / 400.0) * (purple - orange);

            // Set fragment color
            gl_FragColor = vec4(color, 1.0);
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

    // Define model view matrices for translation
    var modelViewMatrix = gl.getUniformLocation(shaderProgram, 'modelViewMatrix');

    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the square
    gl.uniformMatrix4fv(modelViewMatrix, false, [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // Draw the triangle
    gl.uniformMatrix4fv(modelViewMatrix, false, [
        1, 0, 0, 0.5,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
    gl.drawArrays(gl.TRIANGLES, 4, 3);

    // Draw the circle
    gl.uniformMatrix4fv(modelViewMatrix, false, [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
    gl.drawArrays(gl.TRIANGLE_FAN, 7, numSegments);
};
