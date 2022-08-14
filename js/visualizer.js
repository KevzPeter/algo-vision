class Visualizer {
    constructor() {
        this.canvas = null;
        this.currentAlgorithm = 'sorting';
        this.data = [];
        this.treeData = null;
        this.graphData = null;
        this.speed = 5;
        this.isRunning = false;

        // Visualization states
        this.comparing = [];
        this.swapping = [];
        this.searching = -1;
        this.found = -1;
        this.notFound = false;
        this.sorted = [];
        this.visited = new Set();
        this.exploring = new Set();

        // Graph layout storage
        this.graphPositions = {};

        this.setupCanvas();
    }

    setupCanvas() {
        const container = document.getElementById('canvas-container');
        this.canvas = createCanvas(800, 500);
        this.canvas.parent(container);
        this.canvas.style('border-radius', '10px');
    }

    setAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
        this.resetVisualization();
        this.generateData();
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    generateData() {
        const size = parseInt(document.getElementById('arraySize').value);

        switch (this.currentAlgorithm) {
            case 'sorting':
                this.data = this.algorithms.generateRandomArray(size);
                break;
            case 'trees':
                this.treeData = this.algorithms.generateBinaryTree(size);
                this.data = this.treeToArray(this.treeData);
                break;
            case 'graphs':
                this.graphData = this.algorithms.generateGraph(size);
                this.data = Array.from({ length: size }, (_, i) => i);
                // Calculate and store graph positions
                this.graphPositions = this.calculateGraphPositions(Object.keys(this.graphData).map(Number));
                console.log('Graph data generated:', this.graphData);
                console.log('Graph positions calculated:', this.graphPositions);
                // Update source vertex options when graph data is generated
                if (typeof updateSourceVertexOptions === 'function') {
                    updateSourceVertexOptions();
                }
                break;
        }
    }

    treeToArray(node, result = []) {
        if (node) {
            result.push(node.value);
            this.treeToArray(node.left, result);
            this.treeToArray(node.right, result);
        }
        return result;
    }

    resetVisualization() {
        this.comparing = [];
        this.swapping = [];
        this.sorted = [];
        this.visited.clear();
        this.exploring.clear();

        // Clear graph positions to force recalculation on next data generation
        this.graphPositions = {};
    }

    // Visualization state setters
    setComparing(indices) {
        this.comparing = indices;
        // Force a redraw to show the comparison state
        this.redraw();
    }

    setSwapping(indices) {
        this.swapping = indices;
        // Force a redraw to show the updated data
        this.redraw();
    }

    redraw() {
        // This will be called by p5.js draw loop
        // The data is already updated, so the next draw() call will show changes
    }



    setSorted(indices) {
        this.sorted = indices;
    }

    setVisited(node) {
        if (typeof node === 'number') {
            this.visited.add(node);
        } else {
            this.visited.add(node.value);
        }
    }

    setExploring(node) {
        if (typeof node === 'number') {
            this.exploring.add(node);
        } else {
            this.exploring.add(node.value);
        }
    }

    updateDataElement(index, value) {
        if (index >= 0 && index < this.data.length) {
            this.data[index] = value;
            // Debug: log the update
            console.log(`Updated data[${index}] = ${value}`);
        }
    }

    draw() {
        background(255);

        switch (this.currentAlgorithm) {
            case 'sorting':
            case 'searching':
                this.drawArray();
                break;
            case 'trees':
                this.drawTree();
                break;
            case 'graphs':
                this.drawGraph();
                break;
        }
    }

    drawArray() {
        const barWidth = width / this.data.length;
        const maxValue = Math.max(...this.data);

        for (let i = 0; i < this.data.length; i++) {
            const barHeight = (this.data[i] / maxValue) * (height - 100);
            const x = i * barWidth;
            const y = height - barHeight - 50;

            // Determine color based on state
            let fillColor;
            if (this.sorted.includes(i)) {
                fillColor = color(76, 175, 80); // Green for sorted
            } else if (this.comparing.includes(i)) {
                fillColor = color(255, 193, 7); // Yellow for comparing
            } else if (this.swapping.includes(i)) {
                fillColor = color(244, 67, 54); // Red for swapping
            } else {
                fillColor = color(158, 158, 158); // Gray for normal
            }

            fill(fillColor);
            stroke(0);
            strokeWeight(1);
            rect(x + 2, y, barWidth - 4, barHeight);

            // Draw value on top of bar
            fill(0);
            noStroke();
            textAlign(CENTER);
            textSize(12);
            text(this.data[i], x + barWidth / 2, y - 5);
        }


    }

    drawTree() {
        if (!this.treeData) return;

        const nodeRadius = 25;
        const levelHeight = 80;
        const startX = width / 2;
        const startY = 50;

        this.drawTreeNode(this.treeData, startX, startY, width / 4, levelHeight, nodeRadius);
    }

    drawTreeNode(node, x, y, offset, levelHeight, nodeRadius) {
        if (!node) return;

        // Determine color based on state
        let fillColor;
        if (this.visited.has(node.value)) {
            fillColor = color(76, 175, 80); // Green for visited
        } else if (this.exploring.has(node.value)) {
            fillColor = color(33, 150, 243); // Blue for exploring
        } else {
            fillColor = color(158, 158, 158); // Gray for normal
        }

        // Draw node
        fill(fillColor);
        stroke(0);
        strokeWeight(2);
        circle(x, y, nodeRadius * 2);

        // Draw value
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(14);
        text(node.value, x, y);

        // Draw edges and children
        if (node.left) {
            const leftX = x - offset;
            const leftY = y + levelHeight;
            stroke(0);
            strokeWeight(2);
            line(x, y + nodeRadius, leftX, leftY - nodeRadius);
            this.drawTreeNode(node.left, leftX, leftY, offset * 0.7, levelHeight, nodeRadius);
        }

        if (node.right) {
            const rightX = x + offset;
            const rightY = y + levelHeight;
            stroke(0);
            strokeWeight(2);
            line(x, y + nodeRadius, rightX, rightY - nodeRadius);
            this.drawTreeNode(node.right, rightX, rightY, offset * 0.7, levelHeight, nodeRadius);
        }
    }

    drawGraph() {
        if (!this.graphData) {
            console.log('No graph data available');
            return;
        }

        const nodeRadius = 20;
        const nodes = Object.keys(this.graphData).map(Number);
        console.log('Drawing graph with nodes:', nodes);
        console.log('Graph positions:', this.graphPositions);
        
        // If positions are missing, recalculate them
        if (Object.keys(this.graphPositions).length === 0) {
            console.log('Recalculating graph positions');
            this.graphPositions = this.calculateGraphPositions(nodes);
        }

        // Draw edges
        stroke(0);
        strokeWeight(1);
        for (const node of nodes) {
            for (const neighbor of this.graphData[node]) {
                const startPos = this.graphPositions[node];
                const endPos = this.graphPositions[neighbor];
                line(startPos.x, startPos.y, endPos.x, endPos.y);
            }
        }

        // Draw nodes
        for (const node of nodes) {
            const pos = this.graphPositions[node];

            // Determine color based on state
            let fillColor;
            if (this.visited.has(node)) {
                fillColor = color(76, 175, 80); // Green for visited
            } else if (this.exploring.has(node)) {
                fillColor = color(33, 150, 243); // Blue for exploring
            } else {
                fillColor = color(158, 158, 158); // Gray for normal
            }

            fill(fillColor);
            stroke(0);
            strokeWeight(2);
            circle(pos.x, pos.y, nodeRadius * 2);

            // Draw node number
            fill(0);
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(12);
            text(node, pos.x, pos.y);
        }
    }

    calculateGraphPositions(nodes) {
        const positions = {};
        const padding = 60; // Keep nodes away from edges
        const minDistance = 80; // Minimum distance between nodes to avoid overlap
        
        // Use canvas dimensions if available, otherwise use default values
        const canvasWidth = width || 800;
        const canvasHeight = height || 500;

        // Place nodes randomly with some constraints
        nodes.forEach((node) => {
            let attempts = 0;
            let validPosition = false;

            while (!validPosition && attempts < 100) {
                const x = padding + Math.random() * (canvasWidth - 2 * padding);
                const y = padding + Math.random() * (canvasHeight - 2 * padding);

                // Check if this position is far enough from already placed nodes
                validPosition = true;
                for (const placedNode of Object.values(positions)) {
                    const distance = Math.sqrt((x - placedNode.x) ** 2 + (y - placedNode.y) ** 2);
                    if (distance < minDistance) {
                        validPosition = false;
                        break;
                    }
                }

                if (validPosition) {
                    positions[node] = { x, y };
                }
                attempts++;
            }

            // If we couldn't find a valid position after many attempts, just place it randomly
            if (!validPosition) {
                positions[node] = {
                    x: padding + Math.random() * (canvasWidth - 2 * padding),
                    y: padding + Math.random() * (canvasHeight - 2 * padding)
                };
            }
        });

        return positions;
    }

    windowResized() {
        resizeCanvas(800, 500);
    }
}
