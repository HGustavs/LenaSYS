//--------------------------------------------------------------------
// adjust - adjusts all the fixed midpoints or other points of interest to the actual geometric midpoint of the symbol
//--------------------------------------------------------------------

diagram.adjust = function ()
{
		for(i=0;i<this.length;i++){
				item=this[i];
				
				// Diagram item
				if(item.kind==2){
						item.adjust();						
				}
				
		}
		
}