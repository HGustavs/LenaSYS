/*
 *  This function acts as a wrapper to a canvas object. It logs
 *  every function call before forwarding the call to the canvas.
 *  TODO: Implement the logging and support for all canvas function
 *  calls.
 */

function captureCanvas(canvas){
    this.ctx = canvas;      // This is the actual canvas object
    this.ctx.lineWidth = 5;
    this.beginPath = function(){
        // TODO: Log to XML file instead of debug log
        console.log("called beginPath");
        this.ctx.beginPath();
    }
    
    this.moveTo = function(x, y){
        // TODO: Log to XML file instead of debug log
        console.log("called moveTo. Parameters (x, y): " + x + ", " + y);
        this.ctx.moveTo(x, y);
    }
    
     this.lineTo = function(x, y){
        // TODO: Log to XML file instead of debug log
        console.log("called lineTo. Parameters (x, y): " + x + ", " + y);
        this.ctx.lineTo(x, y);
    }
    
    this.stroke = function(){
        // TODO: Log to XML file instead of debug log
        console.log("called stroke");        
        this.ctx.stroke();
    }
}