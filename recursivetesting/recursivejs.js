// Initializing queue array.
let fileTree = [];

breadthFirstTraversal("https://api.github.com/repos/HGustavs/Webbprogrammering-Examples/contents/");
async function breadthFirstTraversal(requestedRepo) {   
  let url = requestedRepo;
  let response = await fetch(url);
  let data = await response.json();
  for (let i = 0; i < data.length; i++) {
    if (data[i].type == "dir") 
      breadthFirstTraversal(requestedRepo + '/' + data[i].name);
    else {
      // fileQueue.push(data[i])
      // console.log("3");
      let pathSplit = [];
      pathSplit.push(data[i].path.split("/"));
      buildTree(data[i], pathSplit, fileTree);
    }
  }
}

console.log("The current tree is: ", fileTree);


// data what eventually will be put at the end of tree
// pathSplit the string path split into an array
// previewsDir the folder traversed in to 
function buildTree(data, pathSplit, previewsDir){
  console.log(pathSplit);
  console.log(previewsDir);

  if (pathSplit[0].length > 1) {
    previewsDir.push(pathSplit[0].shift());
    // delete first element in array 
    buildTree(data, pathSplit, previewsDir);
  } else 
    previewsDir.push(data);
}


  // // console.log("1");
  // for (let i = 0; i < fileQueue.length; i++) {
  //   // console.log("2");
  //   // console.log(fileQueue[i].path);
  //   if (fileQueue[i].path.includes("/")){
  //     // console.log("3");
  //     let myArray = fileQueue[i].path.split("/");
  //     for (let j = 0; j < myArray.length; j++) {
  //       console.log(fileQueue[i].path);
  //     }
  //   }
  //   return 
  // }
  
  
  // for (let i = 0; i < files.length; i++) {
  //   if (files[i].path.includes("/")) {
  //     const myArray = files[i].path.split("/");
  //     for (let j = 0; j < myArray.length; j++) {
  //       if (myArray[j] == "Examples") {
  //         console.log(files[i].path);
  //       }
  //     }
  //   }
  // }
// }

// window.open(data[i].download_url);
