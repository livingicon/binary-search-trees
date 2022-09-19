/* NODE CLASS */
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

/* TREE CLASS */
class Tree {
  constructor(array) {
    this.root = buildTree(array); // returns the root node
  }


  // insert
  insert(value, node = this.root) { 
    if (node === null) {
      node = new Node(value);
      return node;
    }
    if(node.data < value) node.right = this.insert(value, node.right);
    if(node.data > value) node.left = this.insert(value, node.left);
    return node;
  };


  // delete
  delete(value, node = this.root) {
    if (node === null) {
      return node;
    }
    if(node.data < value) node.right = this.delete(value, node.right);
    else if(node.data > value) node.left = this.delete(value, node.left);
    else {
      // root with one child
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      } else { // root with two children, get smallest in it's right subtree
        node.data = minNodeData(node.right);
        // and delete the inorder successor (STUDY THIS!!)
        node.right = this.delete(node.data, node.right);
      }
    } 
    return node;
  };


  // find
  find(data, node = this.root) {
    if (data === undefined) return node;
    if (node.data == data) return node;
    if (node.data < data) return this.find(data, node.right);
    if (node.data > data) return this.find(data, node.left);
  };


  // levelOrder
  levelOrder(func, node = this.root) {
    const orderedDataArr = []; // array of callback results
    if (node === null) return;
    const fifoQueue = [node];
    while (fifoQueue.length != 0) { // while queue is not empty (has at least one discovered node)
      let node = fifoQueue.shift(); // remove first element in the queue and make it the node (fifo)
      orderedDataArr.push(node.data); // push it's data to new array
      if (node.left) fifoQueue.push(node.left); // add to end of queue
      if (node.right) fifoQueue.push(node.right);
    }
    if (!func) return orderedDataArr;
    else return orderedDataArr.map(element => func(element));
  };


  // inOrder (left, root, right)
  inOrder(func, node = this.root, orderedDataArr = []) {
    if (node === null) return;

    this.inOrder(func, node.left, orderedDataArr);
    orderedDataArr.push(node.data);
    this.inOrder(func, node.right, orderedDataArr)
    
    if (!func) return orderedDataArr;
    else return orderedDataArr.map(element => func(element));
  };


  // preOrder (root, left, right)
  preOrder(func, node = this.root, orderedDataArr = []) {
    if (node === null) return;

    orderedDataArr.push(node.data);
    this.preOrder(func, node.left, orderedDataArr);
    this.preOrder(func, node.right, orderedDataArr)

    if (!func) return orderedDataArr;
    else return orderedDataArr.map(element => func(element));
  };

  // postOrder (left, right, root)
  postOrder(func, node = this.root, orderedDataArr = []) {
    if (node === null) return;

    this.postOrder(func, node.left, orderedDataArr);
    this.postOrder(func, node.right, orderedDataArr)
    orderedDataArr.push(node.data);

    if (!func) return orderedDataArr;
    else return orderedDataArr.map(element => func(element));
  };


  // height
  height(value, node = this.find(value)) {
    // Base Case
    if (node === null) return -1;
    // Store the maximum height of
    // the left and right subtree
    const leftHeight = this.height(value, node.left);
    const rightHeight = this.height(value, node.right);
    // Update height of the current node
    let heightCounter = Math.max(leftHeight, rightHeight) +1;
    return heightCounter;
  }

  // depth (4 -- 1)
  depth(value, node = this.root, depthCounter = 0) {
    if (value === undefined) return this.height();
    if (node === null) return;
    if (node.data === value) return depthCounter;
    if (node.data < value) return this.depth(value, node.right, depthCounter + 1);
    if (node.data > value) return this.depth(value, node.left, depthCounter + 1);
  };


  // isBalanced
  isBalanced(node = this.root) {
    let leftHeight = this.height(node.left.data) + 1;
    let rightHeight = this.height(node.right.data) + 1;
    return (Math.abs(leftHeight - rightHeight) > 1) ? "not balanced" : "balanced";
  };


  // reBalance
  reBalance() {
    this.root = buildTree(this.inOrder());
  };
};


/* HELPER FUNCTIONS */
// Create tree
function buildTree(arr) {
  let treeArr = cleanedArray(arr);
  const treeBuild = (arr, start=0, end=arr.length - 1) => {
    if (start > end) return null;
    let mid = parseInt((start + end) / 2); 
    var node = new Node(arr[mid]);
    node.left = treeBuild(arr, start, mid - 1);
    node.right = treeBuild(arr, mid + 1, end);
    return node;
  }
  return treeBuild(treeArr);
};

// Merge Sort
function mergeSort(arr) {
  if(arr.length < 2) {
    return arr;
  } else {
    const left = mergeSort(arr.slice(0, Math.floor(arr.length / 2)));
    const right = mergeSort(arr.slice(Math.floor(arr.length / 2), arr.length));
    const sortedArr = [];
    while (left.length > 0 || right.length > 0) {
      if (left.length === 0 || right[0] < left[0]) {
        sortedArr[sortedArr.length] = right.shift();
      } else {
        sortedArr[sortedArr.length] = left.shift();
      }
    }
    return sortedArr;
  }
};

// Remove Duplicates
function removeDuplicate(arr) {
  let result = []
  arr.forEach((item, index) => { 
    if (arr.indexOf(item) == index) { 
      result.push(item) 
    }
  });
  return result;
};

// MergeSort and RemoveDuplicates
function cleanedArray(arr) {
  const cleanedArr = removeDuplicate(mergeSort(arr));
  return cleanedArr;
};

function minNodeData(node) {
  let minVal = node.data;
  while (node.left !== null) {
    minVal = node.left.data;
    node = node.left;
  }
  return minVal;
};

// "Print" tree in a structured format (to help visualize)
function prettyPrint(node, prefix = '', isLeft = true) {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
}


/* DRIVER SCRIPT (TESTING) */

// Helper function to generate a random array of given parameter length
const generateArr = (length) => {
  return Array.from({ length }, () => Math.floor(Math.random() * 100));
};

// Generate random tree of given parameter length
const tree = new Tree(generateArr(10));
// Print tree
prettyPrint(tree.root);
// Confirm tree is balanced
console.log(`This binary tree is currently ${tree.isBalanced()}.`);
// Traverse the tree
console.log(`Level Order Array: ${tree.levelOrder()}`);
console.log(`PreOrder Array: ${tree.preOrder()}`);
console.log(`PostOrder Array: ${tree.postOrder()}`);
console.log(`InOrder Array: ${tree.inOrder()}`);

// Unbalance the tree by adding five numbers > 100 to right side
const addToArr = (min=100, max=1000) => {
  for (let i = 0; i < 5; i++) {
    tree.insert(Math.floor(Math.random() * (max - min + 1)) + min); 
  }
};
addToArr();

// Print unbalanced tree
prettyPrint(tree.root);
// Confirm unbalanced
console.log(`This binary tree is currently ${tree.isBalanced()}.`);

// Rebalance unbalanced tree
tree.reBalance(tree);
// Print newly balanced tree
prettyPrint(tree.root);
// Confirm it is balanced
console.log(`This binary tree is currently ${tree.isBalanced()}.`);
// Traverse the tree
console.log(`Level Order Array: ${tree.levelOrder()}`);
console.log(`PreOrder Array: ${tree.preOrder()}`);
console.log(`PostOrder Array: ${tree.postOrder()}`);
console.log(`InOrder Array: ${tree.inOrder()}`);