//-------------------------------------------------------------------------------------------
// TileDat Class 		
//------------------a-------------------------------------------------------------------------
// Implements console tile contents
//-------------------------------------------------------------------------------------------

function tiledata(tilesize,color,bgcolor)
{
		var i;
		
	this.colors = [];
	for(i=0;i<tilesize;i++){
			this.colors[i]=color;
	}

	this.bgcolors = [];
	for(i=0;i<tilesize;i++){
			this.bgcolors[i]=bgcolor;
	}

	this.characters = [];			   	
	for(i=0;i<tilesize;i++){
			//this.characters[i]=String.fromCharCode(65+i);
			this.characters[i]="&nbsp;";
	}
	
}