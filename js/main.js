let visualizer;
let algorithms;
let currentAlgorithm = 'sorting';
let isRunning = false;

// Algorithm information
const algorithmInfo = {
    sorting: {
        title: 'Sorting Algorithms',
        description: 'Visualize how different sorting algorithms work step by step.',
        algorithms: [
            {
                name: 'Bubble Sort',
                complexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                stability: 'Stable',
                description: 'Simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
            },
            {
                name: 'Selection Sort',
                complexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                stability: 'Unstable',
                description: 'Finds the minimum element from the unsorted part and places it at the beginning. Simple but inefficient on large lists.'
            },
            {
                name: 'Insertion Sort',
                complexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                stability: 'Stable',
                description: 'Builds the final sorted array one item at a time. Efficient for small data sets and nearly sorted data.'
            },
            {
                name: 'Quick Sort',
                complexity: 'O(n log n)',
                spaceComplexity: 'O(log n)',
                stability: 'Unstable',
                description: 'Divide and conquer algorithm using a pivot element. Very efficient in practice, often faster than other O(n log n) algorithms.'
            },
            {
                name: 'Merge Sort',
                complexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                stability: 'Stable',
                description: 'Divide and conquer algorithm with guaranteed O(n log n) performance. Stable sorting with predictable performance.'
            }
        ]
    },
    trees: {
        title: 'Tree Traversals',
        description: 'Explore different ways to visit all nodes in a binary tree.',
        algorithms: [
            { name: 'Inorder Traversal', complexity: 'O(n)', description: 'Left → Root → Right (gives sorted order for BST)' },
            { name: 'Preorder Traversal', complexity: 'O(n)', description: 'Root → Left → Right (useful for copying trees)' },
            { name: 'Postorder Traversal', complexity: 'O(n)', description: 'Left → Right → Root (useful for deleting trees)' }
        ]
    },
    graphs: {
        title: 'Graph Algorithms',
        description: 'Visualize how graph traversal algorithms explore connected nodes.',
        algorithms: [
            { name: 'Breadth First Search', complexity: 'O(V + E)', description: 'Explores all neighbors before moving to next level' },
            { name: 'Depth First Search', complexity: 'O(V + E)', description: 'Explores as far as possible along each branch' }
        ]
    }
};

function setup() {
    // Initialize algorithms and visualizer
    algorithms = new Algorithms();
    visualizer = new Visualizer();

    // Connect visualizer to algorithms
    visualizer.algorithms = algorithms;

    // Set up event listeners
    setupEventListeners();

    // Generate initial data
    visualizer.generateData();

    // Update algorithm info
    updateAlgorithmInfo();

    // Initialize sorting algorithm dropdown visibility
    const sortingGroup = document.getElementById('sortingAlgorithmGroup');
    sortingGroup.style.display = 'flex'; // Show by default since sorting is the initial algorithm
}

function draw() {
    if (visualizer) {
        visualizer.draw();
    }
}

function setupEventListeners() {
    // Algorithm navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const algorithm = e.target.dataset.algorithm;
            setActiveAlgorithm(algorithm);
        });
    });

    // Controls
    document.getElementById('arraySize').addEventListener('input', (e) => {
        document.getElementById('arraySizeValue').textContent = e.target.value;
        if (!isRunning) {
            visualizer.generateData();
        }
    });

    document.getElementById('speed').addEventListener('input', (e) => {
        document.getElementById('speedValue').textContent = e.target.value;
        visualizer.setSpeed(parseInt(e.target.value));
    });

    document.getElementById('generateBtn').addEventListener('click', () => {
        if (!isRunning) {
            visualizer.generateData();
            visualizer.resetVisualization();
        }
    });

    document.getElementById('startBtn').addEventListener('click', () => {
        if (!isRunning) {
            startAlgorithm();
        }
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        resetAlgorithm();
    });

    // Sorting algorithm selection
    document.getElementById('sortingAlgorithm').addEventListener('change', () => {
        // Update algorithm info when selection changes
        updateAlgorithmInfo();
    });

    // Graph algorithm selection
    document.getElementById('graphAlgorithm').addEventListener('change', () => {
        // Update algorithm info when selection changes
        updateAlgorithmInfo();
    });

    // Source vertex selection
    document.getElementById('sourceVertex').addEventListener('change', () => {
        // Reset visualization when source vertex changes
        if (!isRunning) {
            visualizer.resetVisualization();
        }
    });
}

function setActiveAlgorithm(algorithm) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-algorithm="${algorithm}"]`).classList.add('active');

    // Update current algorithm
    currentAlgorithm = algorithm;
    visualizer.setAlgorithm(algorithm);

    // Show/hide algorithm-specific controls
    const sortingGroup = document.getElementById('sortingAlgorithmGroup');
    const graphGroup = document.getElementById('graphAlgorithmGroup');
    const sourceVertexGroup = document.getElementById('sourceVertexGroup');

    // Hide all groups first
    sortingGroup.style.display = 'none';
    graphGroup.style.display = 'none';
    sourceVertexGroup.style.display = 'none';

    // Show appropriate groups based on algorithm type
    if (algorithm === 'sorting') {
        sortingGroup.style.display = 'flex';
    } else if (algorithm === 'graphs') {
        graphGroup.style.display = 'flex';
        sourceVertexGroup.style.display = 'flex';
        updateSourceVertexOptions();
    }

    // Update algorithm info
    updateAlgorithmInfo();

    // Reset visualization
    visualizer.resetVisualization();
}

function updateSourceVertexOptions() {
    if (!visualizer.graphData) return;

    const sourceVertexSelect = document.getElementById('sourceVertex');
    const vertices = Object.keys(visualizer.graphData).map(Number);

    // Clear existing options
    sourceVertexSelect.innerHTML = '';

    // Add options for each vertex
    vertices.forEach(vertex => {
        const option = document.createElement('option');
        option.value = vertex;
        option.textContent = vertex;
        sourceVertexSelect.appendChild(option);
    });

    // Set default to first vertex
    if (vertices.length > 0) {
        sourceVertexSelect.value = vertices[0];
    }
}

function updateAlgorithmInfo() {
    const info = algorithmInfo[currentAlgorithm];
    const infoDiv = document.getElementById('algorithmInfo');

    let html = `<h4>${info.title}</h4>`;
    html += `<p>${info.description}</p>`;

    if (currentAlgorithm === 'sorting') {
        // Show detailed info about the currently selected sorting algorithm
        const selectedAlgorithm = document.getElementById('sortingAlgorithm').value;
        const selectedAlgoInfo = info.algorithms.find(algo =>
            algo.name.toLowerCase().includes(selectedAlgorithm)
        );

        if (selectedAlgoInfo) {
            html += `<h5>Selected Algorithm: ${selectedAlgoInfo.name}</h5>`;
            html += `<p><strong>Time Complexity:</strong> ${selectedAlgoInfo.complexity}</p>`;
            html += `<p><strong>Space Complexity:</strong> ${selectedAlgoInfo.spaceComplexity}</p>`;
            html += `<p><strong>Stability:</strong> ${selectedAlgoInfo.stability}</p>`;
            html += `<p><strong>Description:</strong> ${selectedAlgoInfo.description}</p>`;
        }

        html += '<h5>All Available Sorting Algorithms:</h5><ul>';
    } else if (currentAlgorithm === 'graphs') {
        // Show detailed info about the currently selected graph algorithm
        const selectedAlgorithm = document.getElementById('graphAlgorithm').value;
        const selectedAlgoInfo = info.algorithms.find(algo =>
            algo.name.toLowerCase().includes(selectedAlgorithm)
        );

        if (selectedAlgoInfo) {
            html += `<h5>Selected Algorithm: ${selectedAlgoInfo.name}</h5>`;
            html += `<p><strong>Time Complexity:</strong> ${selectedAlgoInfo.complexity}</p>`;
            html += `<p><strong>Description:</strong> ${selectedAlgoInfo.description}</p>`;
        }

        html += '<h5>All Available Graph Algorithms:</h5><ul>';
    } else {
        html += '<h5>Available Algorithms:</h5><ul>';
    }

    info.algorithms.forEach(algo => {
        html += `<li><strong>${algo.name}</strong> (${algo.complexity})<br>`;
        html += `<small>${algo.description}</small></li>`;
    });

    html += '</ul>';
    infoDiv.innerHTML = html;
}

async function startAlgorithm() {
    if (isRunning) return;

    isRunning = true;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('generateBtn').disabled = true;

    try {
        switch (currentAlgorithm) {
            case 'sorting':
                await runSortingAlgorithm();
                break;
            case 'trees':
                await runTreeAlgorithm();
                break;
            case 'graphs':
                await runGraphAlgorithm();
                break;
        }
    } catch (error) {
        console.error('Algorithm execution error:', error);
    } finally {
        isRunning = false;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('generateBtn').disabled = false;
    }
}

async function runSortingAlgorithm() {
    const array = [...visualizer.data];
    const selectedAlgorithm = document.getElementById('sortingAlgorithm').value;

    // Run the selected sorting algorithm
    switch (selectedAlgorithm) {
        case 'bubble':
            await algorithms.bubbleSort(array, visualizer);
            break;
        case 'selection':
            await algorithms.selectionSort(array, visualizer);
            break;
        case 'insertion':
            await algorithms.insertionSort(array, visualizer);
            break;
        case 'quick':
            await algorithms.quickSort(array, visualizer);
            break;
        case 'merge':
            await algorithms.mergeSort(array, visualizer);
            break;
        default:
            await algorithms.bubbleSort(array, visualizer);
    }

    // Ensure visualizer data is fully synced after algorithm completion
    visualizer.data = [...array];
}

async function runTreeAlgorithm() {
    if (!visualizer.treeData) return;

    // Run inorder traversal
    await algorithms.inorderTraversal(visualizer.treeData, visualizer);
}

async function runGraphAlgorithm() {
    if (!visualizer.graphData) return;

    const selectedAlgorithm = document.getElementById('graphAlgorithm').value;
    const sourceVertex = parseInt(document.getElementById('sourceVertex').value);

    // Run the selected graph algorithm starting from the selected source vertex
    switch (selectedAlgorithm) {
        case 'bfs':
            await algorithms.breadthFirstSearch(visualizer.graphData, sourceVertex, visualizer);
            break;
        case 'dfs':
            await algorithms.depthFirstSearch(visualizer.graphData, sourceVertex, visualizer);
            break;
        default:
            await algorithms.breadthFirstSearch(visualizer.graphData, sourceVertex, visualizer);
    }
}

function resetAlgorithm() {
    visualizer.resetVisualization();
    visualizer.generateData();

    // Reset stats
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('swaps').textContent = '0';
    document.getElementById('time').textContent = '0ms';
}

// Handle window resize
function windowResized() {
    if (visualizer) {
        visualizer.windowResized();
    }
}
