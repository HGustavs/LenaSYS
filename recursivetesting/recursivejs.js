const files = new Array();

breadthFirstTraversal("https://api.github.com/repos/HGustavs/Webbprogrammering-Examples/contents/");

async function breadthFirstTraversal(requestedRepo) {   
  let url = requestedRepo;
  let response = await fetch(url);
  let data = await response.json();
  for (let i = 0; i < data.length; i++) {
    if (data[i].type == "dir") 
      breadthFirstTraversal(requestedRepo + '/' + data[i].name);
    else 
      files.push(data[i])
  }
}
console.log(files);


// Icke funktionell för tillfället, behöver omfaktoreras
// function printTree(){
//   for (let i = 0; i < files.length; i++) {
//     if (files[i].path.includes("/")) {
//       const myArray = files[i].path.split("/");
//       for (let j = 0; j < myArray.length; j++) {
//         if (myArray[j] == "Examples") {
//           console.log(files[i].path);
//         }
//       }
//     }
//   }
// }

// window.open(data[i].download_url);
