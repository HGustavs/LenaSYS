           /**
 * @description returns the value of a query string sent in a URL.
 * @param a key of type string.
 * @returns a string containing the value 
 */
           function search(key)
           {
               const parameters=new URLSearchParams(window.location.search);
               return parameters.get(key);
           } 
                   // Fetch variant parameters from server
                   var DiagramResponse;
                   
                 function fetchDiagram() {
                       var response;
           
                       let cid=search("courseid");
                       const folder=search("folder");
                       let did=search("did");
                       const id=search("id");
                       if(cid=="UNK"&&folder!=null)
                           cid=folder;
                       else
                           cid=1894;
                       if(did=="UNK"&&id!=null)
                           did=id;
                       else
                           did=21;
           
                       response = getCourseId(cid, did);
           
                       return response;
                   }
           
                   function getCourseId (courseId, did) {
                       try {
                           let response;
                           $.ajax({
                               async: false,
                               method: "GET",
                               url: `diagramservice.php?courseid=${courseId}&did=${did}`,
                               //>>>>>>> g1-2023-v5
                           }).done((res) => {
                               console.log(res)
                               response = res;
                           })
           
                           return response;
                       } catch (error) {
                           console.error(error);
                       }
                   }
                   
                   /**
                    * @description get the contents of a instruction file
                    * @param fileName the name of the file t.ex. test.html
                    * */
                   function getInstructions(fileName)
                   {
                       const instructions = DiagramResponse.instructions
                       if(instructions.length > 0){
                           for (let index = 0; index < instructions.length; index++) {
                               if(instructions[index][2]==fileName){
                                   window.parent.document.getElementById("assignment_discrb").innerHTML = instructions[index][3];
                               }
                               if(instructions[index][5]==fileName){
                                   window.parent.document.getElementById("diagram_instructions").innerHTML = instructions[index][6];
                               }
                           }
                       }			
                   }
           