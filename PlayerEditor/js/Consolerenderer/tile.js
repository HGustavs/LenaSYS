//-------------------------------------------------------------------------------------------
// Tile Class 		
//-------------------------------------------------------------------------------------------
// Implements a console tile
//-------------------------------------------------------------------------------------------
function tile(xpos,ypos,tilesize,color,bgcolor)
{
	var tileid="tile"+ypos+":"+xpos;
	
	this.tileid = tileid;
	this.updated = 1;
	this.tiledata = new tiledata(tilesize,color,bgcolor);

	this.render = function() {
		var oldcolor,oldbgcolor;
	
		// If this tile has not been drawn
		if(this.updated){
			var str="";
			var tp;

			// Build tile contents (only generate new spans if either background or foreground color changes)
			for(tp=0;tp<tilesize;tp++){
				// Only add a second span if rest of cell has different
				if(tp==0||oldcolor!=this.tiledata.colors[tp]||oldbgcolor!=this.tiledata.bgcolors[tp]){
					if(tp!=0) str+="</span>";
					str+="<span style='";
					str+=colortab[this.tiledata.colors[tp]];
					str+=bgcolortab[this.tiledata.bgcolors[tp]];			    						
					str+="'>";													
				}
				
				// Save Character data and remember old colors
				str+=this.tiledata.characters[tp];			    						
				oldcolor=this.tiledata.colors[tp];
				oldbgcolor=this.tiledata.bgcolors[tp];
			}
			str+="</span>";

			// Assign Tile to Its Position in Document	  
			var tileText = document.getElementById(this.tileid);		
			if(tileText==null){
				alert("Unknown Tile: "+this.tileid+"\n\n"+str);	    						
			}else{
				tileText.innerHTML=str;
			}
			
			// Indicate that this tile has been drawn
			this.updated=0;
		}
	}
}