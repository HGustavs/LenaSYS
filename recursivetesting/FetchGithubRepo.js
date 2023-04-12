// Plan B 

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
    else 
      fileTree.push(data[i])
  }
}

console.log("The current tree is: ", fileTree);

async function githubSingelFileFetch(requestedRepo, file) {   
  let url = requestedRepo;
  let response = await fetch(url);
  let data = await response.json();
  for (let i = 0; i < data.length; i++) {
    if(data[i].name == file) {//Checka så att data[i].name ger filnamn med filändelse precis som file har
      //ladda ner filen och ersätt den gammla med den nya
    }
  }
}
