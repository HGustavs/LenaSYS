// Initializing queue array.
var fileQueue = [];

breadthFirstTraversal("https://api.github.com/repos/HGustavs/Webbprogrammering-Examples/contents/");

async function breadthFirstTraversal(requestedRepo) {   
  let url = requestedRepo;
  let response = await fetch(url);
  let data = await response.json();
  for (let i = 0; i < data.length; i++) {
    if (data[i].type == "dir") 
      breadthFirstTraversal(requestedRepo + '/' + data[i].name);
    else 
      queue.push(data[i])
  }
}
console.log("The current queue is: ", queue);


// Icke funktionell för tillfället, behöver omfaktoreras
function buildTree(){
  for (let i = 0; i < files.length; i++) {
    if (fileQueue[i].path.includes("/")){
      let myArray = fileQueue[i].path.split("/");
    
    
    }
    return 
  }

  
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
}

// window.open(data[i].download_url);
