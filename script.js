// Canvas and Context
const canvas = document.getElementById("tspCanvas");
const ctx = canvas.getContext("2d");
let points = [];

// Customizable Colors
const COLORS = { point: "orange", path: "white", label: "orange" };

// Generate Random Coordinates
function generateCoordinates() {
    const numLocations = +document.getElementById("num-locations").value;
    if (numLocations < 2) return alert("Please enter at least 2 locations!");

    points = Array.from({ length: numLocations }, (_, i) => ({
        x: Math.random() * (canvas.width - 40) + 20, // Padding of 20
        y: Math.random() * (canvas.height - 40) + 20,
    }));

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear Canvas
    points.forEach((p, i) => drawPoint(p, i + 1));
}

// Draw a Point
function drawPoint({ x, y }, label) {
    ctx.fillStyle = COLORS.point;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLORS.label;
    ctx.fillText(label, x + 8, y + 5); // Offset for better visibility
}

// Calculate Shortest Path (Nearest Neighbor)
function calculateTSP() {
    if (points.length < 2) return alert("Generate at least 2 points first!");

    let visited = Array(points.length).fill(false),
        route = [0],
        totalDistance = 0;

    visited[0] = true;

    for (let i = 0; i < points.length - 1; i++) {
        const { next, distance } = findNearest(points[route[i]], visited);
        route.push(next);
        visited[next] = true;
        totalDistance += distance;
    }

    // Add distance back to start
    totalDistance += calcDistance(points[route.at(-1)], points[route[0]]);
    document.getElementById("route").textContent = route.map(r => r + 1).join(" -> ");
    document.getElementById("distance").textContent = totalDistance.toFixed(2);

    visualizeRoute(route);
}

// Find Nearest Point
function findNearest(current, visited) {
    return points.reduce(
        (nearest, point, i) =>
            !visited[i] && calcDistance(current, point) < nearest.distance
                ? { next: i, distance: calcDistance(current, point) }
                : nearest,
        { next: -1, distance: Infinity }
    );
}

// Calculate Distance
const calcDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Visualize the TSP Route
function visualizeRoute(route) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear Canvas
    route.forEach((i, idx) => {
        drawPoint(points[i], i + 1);
        if (idx > 0) drawLine(points[route[idx - 1]], points[i]);
    });
    drawLine(points[route.at(-1)], points[route[0]]); // Close the loop
}

// Draw Line Between Two Points
function drawLine(start, end) {
    ctx.strokeStyle = COLORS.path;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}