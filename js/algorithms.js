class Algorithms {
    constructor() {
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
    }

    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
    }

    // Sorting Algorithms
    async bubbleSort(array, visualizer) {
        this.resetStats();
        this.startTime = Date.now();

        const n = array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                if (array[j] > array[j + 1]) {
                    // Swap elements
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    this.swaps++;

                    // Update visualizer data to reflect the swap
                    visualizer.updateDataElement(j, array[j]);
                    visualizer.updateDataElement(j + 1, array[j + 1]);

                    // Update visualization
                    visualizer.setComparing([j, j + 1]);
                    visualizer.setSwapping([j, j + 1]);
                    await this.delay(visualizer.speed);
                }
            }
        }

        visualizer.setSorted(array.map((_, i) => i));
        this.updateStats();
    }

    async selectionSort(array, visualizer) {
        this.resetStats();
        this.startTime = Date.now();

        const n = array.length;
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            for (let j = i + 1; j < n; j++) {
                this.comparisons++;
                if (array[j] < array[minIdx]) {
                    minIdx = j;
                }
                visualizer.setComparing([i, j]);
                await this.delay(visualizer.speed);
            }

            if (minIdx !== i) {
                [array[i], array[minIdx]] = [array[minIdx], array[i]];
                this.swaps++;

                // Update visualizer data to reflect the swap
                visualizer.updateDataElement(i, array[i]);
                visualizer.updateDataElement(minIdx, array[minIdx]);

                visualizer.setSwapping([i, minIdx]);
                await this.delay(visualizer.speed);
            }
        }

        visualizer.setSorted(array.map((_, i) => i));
        this.updateStats();
    }

    async insertionSort(array, visualizer) {
        this.resetStats();
        this.startTime = Date.now();

        const n = array.length;
        for (let i = 1; i < n; i++) {
            let key = array[i];
            let j = i - 1;

            while (j >= 0 && array[j] > key) {
                this.comparisons++;
                array[j + 1] = array[j];
                this.swaps++;

                // Update visualizer data to reflect the shift
                visualizer.updateDataElement(j + 1, array[j + 1]);

                visualizer.setComparing([j, j + 1]);
                visualizer.setSwapping([j, j + 1]);
                await this.delay(visualizer.speed);
                j--;
            }
            array[j + 1] = key;
            // Update visualizer data for the final placement
            visualizer.updateDataElement(j + 1, key);
        }

        visualizer.setSorted(array.map((_, i) => i));
        this.updateStats();
    }

    async quickSort(array, visualizer, low = 0, high = null) {
        if (high === null) {
            this.resetStats();
            this.startTime = Date.now();
            high = array.length - 1;
        }

        if (low < high) {
            const pi = await this.partition(array, visualizer, low, high);
            await this.quickSort(array, visualizer, low, pi - 1);
            await this.quickSort(array, visualizer, pi + 1, high);
        }

        if (low === 0 && high === array.length - 1) {
            visualizer.setSorted(array.map((_, i) => i));
            this.updateStats();
        }
    }

    async partition(array, visualizer, low, high) {
        const pivot = array[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            this.comparisons++;
            visualizer.setComparing([j, high]);
            await this.delay(visualizer.speed);

            if (array[j] < pivot) {
                i++;
                if (i !== j) {
                    [array[i], array[j]] = [array[j], array[i]];
                    this.swaps++;

                    // Update visualizer data to reflect the swap
                    visualizer.updateDataElement(i, array[i]);
                    visualizer.updateDataElement(j, array[j]);

                    visualizer.setSwapping([i, j]);
                    await this.delay(visualizer.speed);
                }
            }
        }

        if (i + 1 !== high) {
            [array[i + 1], array[high]] = [array[high], array[i + 1]];
            this.swaps++;

            // Update visualizer data to reflect the swap
            visualizer.updateDataElement(i + 1, array[i + 1]);
            visualizer.updateDataElement(high, array[high]);

            visualizer.setSwapping([i + 1, high]);
            await this.delay(visualizer.speed);
        }

        return i + 1;
    }

    async mergeSort(array, visualizer, left = 0, right = null) {
        if (right === null) {
            this.resetStats();
            this.startTime = Date.now();
            right = array.length - 1;
        }

        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            await this.mergeSort(array, visualizer, left, mid);
            await this.mergeSort(array, visualizer, mid + 1, right);
            await this.merge(array, visualizer, left, mid, right);
        }

        if (left === 0 && right === array.length - 1) {
            visualizer.setSorted(array.map((_, i) => i));
            this.updateStats();
        }
    }

    async merge(array, visualizer, left, mid, right) {
        const leftArray = array.slice(left, mid + 1);
        const rightArray = array.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        while (i < leftArray.length && j < rightArray.length) {
            this.comparisons++;
            visualizer.setComparing([left + i, mid + 1 + j]);
            await this.delay(visualizer.speed);

            if (leftArray[i] <= rightArray[j]) {
                array[k] = leftArray[i];
                i++;
            } else {
                array[k] = rightArray[j];
                j++;
            }
            k++;
        }

        while (i < leftArray.length) {
            array[k] = leftArray[i];
            i++;
            k++;
        }

        while (j < rightArray.length) {
            array[k] = rightArray[j];
            j++;
            k++;
        }
    }



    // Tree Algorithms
    async inorderTraversal(node, visualizer, result = []) {
        if (node) {
            await this.inorderTraversal(node.left, visualizer, result);
            result.push(node.value);
            visualizer.setVisited(node);
            await this.delay(visualizer.speed);
            await this.inorderTraversal(node.right, visualizer, result);
        }
        return result;
    }

    async preorderTraversal(node, visualizer, result = []) {
        if (node) {
            result.push(node.value);
            visualizer.setVisited(node);
            await this.delay(visualizer.speed);
            await this.preorderTraversal(node.left, visualizer, result);
            await this.preorderTraversal(node.right, visualizer, result);
        }
        return result;
    }

    async postorderTraversal(node, visualizer, result = []) {
        if (node) {
            await this.postorderTraversal(node.left, visualizer, result);
            await this.postorderTraversal(node.right, visualizer, result);
            result.push(node.value);
            visualizer.setVisited(node);
            await this.delay(visualizer.speed);
        }
        return result;
    }

    // Graph Algorithms
    async breadthFirstSearch(graph, start, visualizer) {
        this.resetStats();
        this.startTime = Date.now();

        const visited = new Set();
        const queue = [start];
        const result = [];

        visited.add(start);

        while (queue.length > 0) {
            const vertex = queue.shift();
            result.push(vertex);

            visualizer.setVisited(vertex);
            await this.delay(visualizer.speed);

            for (const neighbor of graph[vertex] || []) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                    visualizer.setExploring(neighbor);
                    await this.delay(visualizer.speed);
                }
            }
        }

        this.updateStats();
        return result;
    }

    async depthFirstSearch(graph, start, visualizer, visited = new Set(), result = []) {
        if (visited.size === 0) {
            this.resetStats();
            this.startTime = Date.now();
        }

        visited.add(start);
        result.push(start);

        visualizer.setVisited(start);
        await this.delay(visualizer.speed);

        for (const neighbor of graph[start] || []) {
            if (!visited.has(neighbor)) {
                visualizer.setExploring(neighbor);
                await this.delay(visualizer.speed);
                await this.depthFirstSearch(graph, neighbor, visualizer, visited, result);
            }
        }

        if (visited.size === 1) {
            this.updateStats();
        }

        return result;
    }

    // Utility methods
    async delay(speed) {
        const delayTime = (11 - speed) * 50; // Convert speed 1-10 to delay
        await new Promise(resolve => setTimeout(resolve, delayTime));
    }

    updateStats() {
        const timeElapsed = Date.now() - this.startTime;
        document.getElementById('comparisons').textContent = this.comparisons;
        document.getElementById('swaps').textContent = this.swaps;
        document.getElementById('time').textContent = timeElapsed + 'ms';
    }

    // Data generation
    generateRandomArray(size) {
        return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    }

    generateSortedArray(size) {
        return Array.from({ length: size }, (_, i) => i + 1);
    }

    generateReverseSortedArray(size) {
        return Array.from({ length: size }, (_, i) => size - i);
    }

    generateBinaryTree(size) {
        const values = this.generateRandomArray(size);
        const root = { value: values[0], left: null, right: null };

        for (let i = 1; i < values.length; i++) {
            this.insertIntoTree(root, values[i]);
        }

        return root;
    }

    insertIntoTree(node, value) {
        if (value < node.value) {
            if (node.left === null) {
                node.left = { value, left: null, right: null };
            } else {
                this.insertIntoTree(node.left, value);
            }
        } else {
            if (node.right === null) {
                node.right = { value, left: null, right: null };
            } else {
                this.insertIntoTree(node.right, value);
            }
        }
    }

    generateGraph(size) {
        const graph = {};
        for (let i = 0; i < size; i++) {
            graph[i] = [];
            const numEdges = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numEdges; j++) {
                const neighbor = Math.floor(Math.random() * size);
                if (neighbor !== i && !graph[i].includes(neighbor)) {
                    graph[i].push(neighbor);
                }
            }
        }
        return graph;
    }
}
