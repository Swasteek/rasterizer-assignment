// Point class for grid coordinates
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Global variables
const GRID_SIZE = 50;
const CELL_SIZE = 10;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const ENDPOINT_RADIUS = 8;

let endpoint1;
let endpoint2;
let dragging = null;
let rasterizer;
let currentAlgorithm = 'bresenham';
let circleMode = 'diameter'; // 'diameter' or 'center'

function setup() {
    const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    canvas.parent('canvas-container');

    // Initialize endpoints
    endpoint1 = new Point(10, 10);
    endpoint2 = new Point(40, 35);

    // Create rasterizer instance (default to Bresenham)
    rasterizer = new BresenhamRasterizer();

    // Setup UI updates
    updatePointInfo();

    // Make switchAlgorithm available globally
    window.switchAlgorithm = function (algo) {
        currentAlgorithm = algo;

        // Update circle mode display
        const circleModeSelect = document.getElementById('circleMode');
        if (algo === 'circle') {
            circleModeSelect.style.display = 'block';
            circleMode = circleModeSelect.value;
        } else {
            circleModeSelect.style.display = 'none';
        }

        // Switch rasterizer
        switch (algo) {
            case 'bresenham':
                rasterizer = new BresenhamRasterizer();
                break;
            case 'dda':
                rasterizer = new DDARasterizer();
                break;
            case 'wu':
                rasterizer = new WuRasterizer();
                break;
            case 'circle':
                rasterizer = new MidpointCircleRasterizer();
                break;
        }
    };

    // Handle circle mode change
    document.getElementById('circleMode').addEventListener('change', function (e) {
        circleMode = e.target.value;
    });
}

function draw() {
    background(255);

    // Draw grid
    stroke(220);
    strokeWeight(1);
    for (let i = 0; i <= GRID_SIZE; i++) {
        line(i * CELL_SIZE, 0, i * CELL_SIZE, CANVAS_SIZE);
        line(0, i * CELL_SIZE, CANVAS_SIZE, i * CELL_SIZE);
    }

    let rasterizedPixels;

    if (currentAlgorithm === 'circle') {
        // For circle, handle different modes
        if (circleMode === 'diameter') {
            // Use both points as diameter endpoints
            rasterizedPixels = rasterizer.rasterize(endpoint1, endpoint2);

            // Draw diameter line
            stroke(255, 0, 0, 100);
            strokeWeight(1);
            line(endpoint1.x * CELL_SIZE + CELL_SIZE / 2,
                endpoint1.y * CELL_SIZE + CELL_SIZE / 2,
                endpoint2.x * CELL_SIZE + CELL_SIZE / 2,
                endpoint2.y * CELL_SIZE + CELL_SIZE / 2);
        } else {
            // center mode: first point is center, second defines radius
            const center = endpoint1;
            const radius = Math.sqrt(
                Math.pow(endpoint2.x - endpoint1.x, 2) +
                Math.pow(endpoint2.y - endpoint1.y, 2)
            );
            rasterizedPixels = rasterizer.rasterizeCircle(center, radius);

            // Draw radius line
            stroke(255, 0, 0, 100);
            strokeWeight(1);
            line(center.x * CELL_SIZE + CELL_SIZE / 2,
                center.y * CELL_SIZE + CELL_SIZE / 2,
                endpoint2.x * CELL_SIZE + CELL_SIZE / 2,
                endpoint2.y * CELL_SIZE + CELL_SIZE / 2);
        }
    } else {
        // For line algorithms
        rasterizedPixels = rasterizer.rasterize(endpoint1, endpoint2);

        // Draw reference line (1px thin line)
        stroke(255, 0, 0);
        strokeWeight(1);
        line(endpoint1.x * CELL_SIZE + CELL_SIZE / 2,
            endpoint1.y * CELL_SIZE + CELL_SIZE / 2,
            endpoint2.x * CELL_SIZE + CELL_SIZE / 2,
            endpoint2.y * CELL_SIZE + CELL_SIZE / 2);
    }

    // Draw rasterized pixels
    if (currentAlgorithm === 'wu') {
        // For Wu's algorithm, draw with intensity
        noStroke();
        for (let p of rasterizedPixels) {
            // p[2] is intensity for Wu's algorithm
            const intensity = p[2] || 1;
            fill(100, 150, 255, 150 * intensity);
            rect(p[0] * CELL_SIZE, p[1] * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    } else {
        // For other algorithms
        fill(100, 150, 255, 150);
        noStroke();
        for (let p of rasterizedPixels) {
            rect(p.x * CELL_SIZE, p.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }

    // Draw endpoints
    fill(255, 100, 100);
    stroke(200, 50, 50);
    strokeWeight(2);
    ellipse(endpoint1.x * CELL_SIZE + CELL_SIZE / 2,
        endpoint1.y * CELL_SIZE + CELL_SIZE / 2,
        ENDPOINT_RADIUS * 2, ENDPOINT_RADIUS * 2);
    ellipse(endpoint2.x * CELL_SIZE + CELL_SIZE / 2,
        endpoint2.y * CELL_SIZE + CELL_SIZE / 2,
        ENDPOINT_RADIUS * 2, ENDPOINT_RADIUS * 2);

    // Update point info
    updatePointInfo();
    document.getElementById('pointCount').textContent = rasterizedPixels.length;
}

function updatePointInfo() {
    document.getElementById('point1').textContent = `${endpoint1.x}, ${endpoint1.y}`;
    document.getElementById('point2').textContent = `${endpoint2.x}, ${endpoint2.y}`;
}

function mousePressed() {
    // Check if clicking on endpoint1
    const d1 = dist(mouseX, mouseY,
        endpoint1.x * CELL_SIZE + CELL_SIZE / 2,
        endpoint1.y * CELL_SIZE + CELL_SIZE / 2);
    if (d1 < ENDPOINT_RADIUS) {
        dragging = endpoint1;
        return;
    }

    // Check if clicking on endpoint2
    const d2 = dist(mouseX, mouseY,
        endpoint2.x * CELL_SIZE + CELL_SIZE / 2,
        endpoint2.y * CELL_SIZE + CELL_SIZE / 2);
    if (d2 < ENDPOINT_RADIUS) {
        dragging = endpoint2;
        return;
    }
}

function mouseDragged() {
    if (dragging !== null) {
        // Convert mouse position to grid coordinates
        const gridX = constrain(floor(mouseX / CELL_SIZE), 0, GRID_SIZE - 1);
        const gridY = constrain(floor(mouseY / CELL_SIZE), 0, GRID_SIZE - 1);

        dragging.x = gridX;
        dragging.y = gridY;
    }
}

function mouseReleased() {
    dragging = null;
}