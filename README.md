# Algorithm Visualizer

An interactive web application that visualizes various data structures and algorithms using p5.js. This project provides real-time visualizations of sorting, searching, tree traversal, and graph algorithms to help understand how they work.

## Features

### 🎯 **Sorting Algorithms**

- **Bubble Sort** - Simple comparison-based algorithm
- **Selection Sort** - Finds minimum element and places it at beginning
- **Insertion Sort** - Builds final array one item at a time
- **Quick Sort** - Divide and conquer algorithm using pivot
- **Merge Sort** - Divide and conquer algorithm with stable sorting

### 🔍 **Searching Algorithms**

- **Linear Search** - Sequentially checks each element
- **Binary Search** - Requires sorted array, divides search space in half

### 🌳 **Tree Traversals**

- **Inorder Traversal** - Left → Root → Right (gives sorted order for BST)
- **Preorder Traversal** - Root → Left → Right (useful for copying trees)
- **Postorder Traversal** - Left → Right → Root (useful for deleting trees)

### 🕸️ **Graph Algorithms**

- **Breadth First Search (BFS)** - Explores all neighbors before moving to next level
- **Depth First Search (DFS)** - Explores as far as possible along each branch

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Running the Application

1. Clone or download this repository
2. Open `index.html` in your web browser
3. The application will load automatically

## 🎮 How to Use

### Navigation

- Use the navigation buttons to switch between different algorithm categories
- Each category shows relevant algorithms and their descriptions

### Controls

- **Array Size**: Adjust the number of elements to visualize (5-50)
- **Speed**: Control the visualization speed (1-10, where 10 is fastest)
- **Generate New Data**: Create new random data for visualization
- **Start**: Begin the algorithm execution
- **Reset**: Clear the visualization and return to initial state

### Understanding the Visualization

#### Sorting & Searching

- **Gray bars**: Normal state
- **Yellow bars**: Currently being compared
- **Red bars**: Elements being swapped
- **Blue bars**: Element being searched
- **Purple bars**: Found element
- **Green bars**: Sorted elements

#### Trees

- **Gray nodes**: Unvisited nodes
- **Blue nodes**: Currently exploring
- **Green nodes**: Visited nodes

#### Graphs

- **Gray nodes**: Unvisited nodes
- **Blue nodes**: Currently exploring
- **Green nodes**: Visited nodes
- **Lines**: Edges between connected nodes

## 🏗️ Project Structure

```
algo-vision/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── js/
│   ├── algorithms.js   # Algorithm implementations
│   ├── visualizer.js   # p5.js visualization logic
│   └── main.js         # Main application logic
└── README.md           # This file
```

## 🔧 Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Graphics**: p5.js library for canvas-based visualizations
- **Architecture**: Object-oriented design with separate concerns
- **Responsive**: Works on desktop and mobile devices

## 📚 Learning Resources

This visualizer is designed to help you understand:

- **Algorithm Complexity**: See how different algorithms perform with varying data sizes
- **Step-by-step Execution**: Watch algorithms work in real-time
- **Data Structure Behavior**: Understand how trees and graphs are traversed
- **Performance Metrics**: Track comparisons, swaps, and execution time

## 🎨 Customization

You can easily extend this project by:

1. **Adding New Algorithms**: Implement new algorithms in `algorithms.js`
2. **Custom Visualizations**: Modify the drawing functions in `visualizer.js`
3. **New Data Structures**: Add support for additional data structures
4. **UI Improvements**: Enhance the interface in `styles.css` and `index.html`

## 🤝 Contributing

Feel free to contribute to this project by:

- Reporting bugs
- Suggesting new features
- Adding new algorithms
- Improving the UI/UX
- Optimizing performance

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **p5.js** - For the excellent graphics library
- **Computer Science Community** - For algorithm explanations and implementations
- **Open Source Contributors** - For inspiration and best practices

---

**Happy Learning!** 🎓

Explore the fascinating world of algorithms through interactive visualizations and gain a deeper understanding of how they work.
