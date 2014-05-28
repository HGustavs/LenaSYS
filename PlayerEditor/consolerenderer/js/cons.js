//-------------------------------------------------------------------------------------------
// Console renderer		
//-------------------------------------------------------------------------------------------
// Main console playback component
//-------------------------------------------------------------------------------------------		
function cons(consolewidth,consoleheight,tilesize,color,bgcolor)
{
	// General Console variables
	this.rows=[];
	this.altrows=[];
	this.consolewidth=consolewidth;
	this.consoleheight=consoleheight;
	this.tilesize=tilesize;
	
	// Swap Screen Console Variables (either 1 or 2)
	this.currentbuffer=1;
	
	// Caret variables
	this.carethidden=0;			// 0 = Shown 1 = Hidden
	this.caretblink=0;			// 0 = No blink 1 = Blink On
	this.caretx=0;
	this.carety=0;
	this.oldcaretx=0;
	this.oldcarety=0;
	this.linewrap=false;
	
	// Caret save/restore variables
	this.caretsaved=new caretstate();

	// Color and default color variables
	this.defaultcolor=color;
	this.defaultbgcolor=bgcolor;
	this.color=color;
	this.bgcolor=bgcolor;
	this.caretcolor=color;
	
	// Deferred rendering variables
	this.delaycnt=0;
	this.deferscroll=8;

	// Playing variables
	this.step=0;	
	this.paused=1;
	this.finished=0;
	this.repeat=0;
	this.fastforward=0;
	this.windtarget=-1;
	this.playafterwind=1;
	
	// Timesteps
	this.timesteps=null;
	
	// Timeout storer
	this.timeoutStore=null;
						
	// Create screen and swap screen
	for(var cy=0;cy<consoleheight;cy++){
		this.rows[cy]=[];
		this.altrows[cy]=[];
		for(var cx=0;cx<consolewidth;cx+=tilesize){
			this.rows[cy][Math.floor(cx/tilesize)] = new tile(cx,cy,tilesize,color,bgcolor);
			this.altrows[cy][Math.floor(cx/tilesize)] = new tile(cx,cy,tilesize,color,bgcolor);
		}
	}


	//-------------------------------------------------------------------------------------------
	// startup
	//-------------------------------------------------------------------------------------------
	// initiates timesteps variable
	//-------------------------------------------------------------------------------------------
	this.startup = function(xmlDoc)
	{
		this.timesteps=xmlDoc.getElementsByTagName("timestep");
	}

	//-------------------------------------------------------------------------------------------
	// clrscr
	//-------------------------------------------------------------------------------------------
	// Clears Screen
	//-------------------------------------------------------------------------------------------
	this.clrscr = function()
	{
		// Clear all rows
		for(var ki=0;ki<this.consoleheight;ki++){
			this.clearrow(ki);
		}
		// Reset position
		this.gotoxy(0,0);
	}

	//-------------------------------------------------------------------------------------------
	// updatecursorstate
	//-------------------------------------------------------------------------------------------
	// Renders Cursor Element
	//-------------------------------------------------------------------------------------------
	this.updatecursorstate = function()
	{
		var caretelem = document.getElementById("caret");		
		if(this.carethidden==1){
			caretelem.className="caret carethidden";
		}else{
			if(this.caretblink==1){
				caretelem.className="caret caretblink";
			}else{
				caretelem.className="caret caretnoblink";
			}
		}
	}

	//-------------------------------------------------------------------------------------------
	// showcursor
	//-------------------------------------------------------------------------------------------
	// Shows the cursor caret
	//-------------------------------------------------------------------------------------------
	this.showcursor = function()
	{
		this.carethidden=false;
		this.updatecursorstate();
	}

	//-------------------------------------------------------------------------------------------
	// hidecursor
	//-------------------------------------------------------------------------------------------
	// Hides the cursor caret
	//-------------------------------------------------------------------------------------------
	this.hidecursor = function()
	{
		this.carethidden=true;
		this.updatecursorstate();
	}

	//-------------------------------------------------------------------------------------------
	// blinkstate
	//-------------------------------------------------------------------------------------------
	//
	//-------------------------------------------------------------------------------------------
	this.blinkstate = function(state)
	{
		if(state){
			this.carethidden=true;
		}else{
			this.carethidden=false;
		}
		this.updatecursorstate();
	}					

	//-------------------------------------------------------------------------------------------
	// savecursor
	//-------------------------------------------------------------------------------------------
	// Saves the complete cursor state
	//-------------------------------------------------------------------------------------------
	this.savecursor = function()
	{
		this.caretsaved.xk=this.caretx;
		this.caretsaved.yk=this.carety;
		this.caretsaved.carethidden=this.carethidden;
		this.caretsaved.caretblink=this.caretblink;
		this.caretsaved.textcolor=this.color;
		this.caretsaved.textbgcolor=this.bgcolor;
		this.caretsaved.caretcolor=this.caretcolor;
	}					

	//-------------------------------------------------------------------------------------------
	// loadcursor
	//-------------------------------------------------------------------------------------------
	// Saves the complete cursor state
	//-------------------------------------------------------------------------------------------
	this.loadcursor = function()
	{
		this.gotoxy(this.caretsaved.xk,this.caretsaved.yk);
		this.carethidden=this.caretsaved.carethidden;
		this.caretblink=this.caretsaved.caretblink;
		this.updatecursorstate();
		
		this.color=this.caretsaved.textcolor;
		this.bgcolor=this.caretsaved.textbgcolor;
		this.caretcolor=this.caretsaved.caretcolor;
	}					

	//-------------------------------------------------------------------------------------------
	// skip
	//-------------------------------------------------------------------------------------------
	// Skips N steps forward or backward.
	//-------------------------------------------------------------------------------------------
	this.skip = function(skippos)
	{
		if(this.timesteps!=null){
			// Calculate new position
			var windpos=this.step+skippos;
			// Make sure position is valid
			if(windpos<0) windpos=0;
			if(windpos>=this.timesteps.length) windpos=this.timesteps.length-1;

			this.windto(windpos);
		}							
	}

	//-------------------------------------------------------------------------------------------
	// search
	//-------------------------------------------------------------------------------------------
	// Search by clicking the playback position
	//-------------------------------------------------------------------------------------------
	this.search = function(event)
	{
		// Calculating search percentage (0%-100%)
		var rect = document.getElementById("barcontainer").getBoundingClientRect();
		var width = document.getElementById("barcontainer").offsetWidth;
		var percentage = (event.clientX - rect.left) / width;

		// Move to new position
		this.windto(Math.floor(this.timesteps.length * percentage));
	}
	
	//-------------------------------------------------------------------------------------------
	// windto
	//-------------------------------------------------------------------------------------------
	// Initiates either rewind or fastforward
	// Rewind equals clearscreen plus fastforward
	//-------------------------------------------------------------------------------------------
	this.windto = function(windpos)
	{
		// Only allow winding one step at the time
		if (this.windtarget < 0) {
			if(this.paused==0) {
				this.playafterwind=1;
			} else {
				this.playafterwind=0;
			}
			if(windpos<this.step){
				// Rewind
				this.windtarget=windpos;
				this.step=0;
				this.fastforward=1;	
				this.clrscr();
				// Set to playing
				this.paused=0;
				this.advancestep();
			} else if(windpos>this.step){
				// Fast Forward
				this.windtarget=windpos;
				this.fastforward=1;
				// Set to playing
				this.paused=0;
				this.advancestep();
			}
		}	
	}

	//-------------------------------------------------------------------------------------------
	// switch
	//-------------------------------------------------------------------------------------------
	// Switching play/pause
	//-------------------------------------------------------------------------------------------
	this.switchPlayback = function()
	{
		if(this.paused==1){
			this.play();
		}else{
			this.pause();
		}
	}

	//-------------------------------------------------------------------------------------------
	// play
	//-------------------------------------------------------------------------------------------
	// Play starts animation or restarts if paused 
	//-------------------------------------------------------------------------------------------
	this.play = function()
	{
		// Only play if we have a document
		if(this.timesteps!=null){
			this.paused=0;
			// Start over if finished
			if (this.finished == 1) {
				// Clearing screen
				this.reset();
			}
			this.advancestep();								
		}
		
		document.getElementById("playcontrol").innerHTML="<img src='images/pause_button.svg'/>";			
	}

	//-------------------------------------------------------------------------------------------
	// pause 		
	//-------------------------------------------------------------------------------------------
	// Stops execution at current step
	//-------------------------------------------------------------------------------------------
	this.pause = function()
	{
		this.paused=1;

		document.getElementById("playcontrol").innerHTML="<img src='images/play_button.svg'/>";	
	}

	//-------------------------------------------------------------------------------------------
	// reset 		
	//-------------------------------------------------------------------------------------------
	// Resetting playback
	//-------------------------------------------------------------------------------------------
	this.reset = function() 
	{
		this.clrscr();
		this.step = 0;
		this.finished = 0;
	}

	//-------------------------------------------------------------------------------------------
	// toggleRepeat 		
	//-------------------------------------------------------------------------------------------
	// Toggle the repeat function
	//-------------------------------------------------------------------------------------------
	this.toggleRepeat = function()
	{
		// Toggle repeat
		if (this.repeat == 0) {
			// Repeat
			this.repeat = 1;
			document.getElementById("repeatcontrol").innerHTML="<img src='images/replay_button_activated.svg'/>";
		}else {
			// Don't repeat
			this.repeat = 0;
			document.getElementById("repeatcontrol").innerHTML="<img src='images/replay_button.svg'/>";
		}
	}

	//-------------------------------------------------------------------------------------------
	// getcolorname 		
	//-------------------------------------------------------------------------------------------
	// Fetching name of color
	//-------------------------------------------------------------------------------------------
	this.getcolorname = function(colnam)
	{
		// Search for color name
		for(var i=0;i<colornames.length;i++){
			if(colornames[i]==colnam) return i;
		}
		return null;
	}
						
	//-------------------------------------------------------------------------------------------
	// advancestep 		
	//-------------------------------------------------------------------------------------------
	// Advances one step in the XML file
	//-------------------------------------------------------------------------------------------
	this.advancestep = function ()
	{
		if(!this.paused){
			// Only advance if there are timesteps left
			if(this.step<this.timesteps.length){
				// Do not update search bar when fast forwarding
				if(!this.fastforward){
					this.updateSearchBar();				
				}
					
				// Fetch actions from timestep
				childr=this.timesteps[this.step].childNodes;
				// Calculate delay
				delay=Math.round(this.timesteps[this.step].getAttribute('delay')*1000.0);
				// Set next delay
				if(this.step>=this.timesteps.length-2){
					nextdelay=1;
					delay=1;
				}else{
					nextdelay=Math.round(this.timesteps[this.step+1].getAttribute('delay')*1000.0);									
				}

				// Run timestep actions
				for(jj=0;jj<childr.length;jj++){
					if(childr[jj].nodeName=="special"){
						// Ignore "special" for now
					}else if(childr[jj].nodeName=="#text"){
						// Ignore #text as it should contain only white space
					}else if(childr[jj].nodeName=="color"){
						// Set text color
						var col=childr[jj].getAttribute('foreground');
						if(col!=null){
							var coln=this.getcolorname(col);
							if (col=="normal-default") coln=this.defaultcolor;
							if(coln==null) alert("Unknown Color Name: "+col);
							this.color=parseInt(coln);
						}
						var bgcol=childr[jj].getAttribute('background');
						// Set background color
						if(bgcol!=null){
							var bgcoln=this.getcolorname(bgcol);
							if (bgcol=="normal-default") bgcoln=this.defaultbgcolor;
							if(bgcoln==null) alert("Unknown BG Color Name: "+bgcol);
							this.bgcolor=parseInt(bgcoln);
						}
					}else if(childr[jj].nodeName=="text"){
						// Write text node!
						cons.printtext(childr[jj].textContent);
					}else if(childr[jj].nodeName=="newline"){
						cons.newline();
					}else if(childr[jj].nodeName=="cursor"){
						// Only partial implementation of cursor
						var xk=childr[jj].getAttribute('absolutecolumn');
						var yk=childr[jj].getAttribute('absoluterow');
						var blinking=childr[jj].getAttribute('blinking');
						var state=childr[jj].getAttribute('state');
						var show=childr[jj].getAttribute('show');
						var keycontrol=childr[jj].getAttribute('key-control');
						if(xk!=null&&yk!=null){
							cons.gotoxy(xk,yk);
						}else if(show!=null){
							if(show=="true"){
								cons.showcursor();
							}else{
								cons.hidecursor();									    						
							}
						}else if(blinking!=null){
							if(blinking=="true"){
								cons.blinkstate(1);
							}else{
								cons.blinkstate(0);
							}
						}else if(state!=null){
							if(state=="save"){
								// Remember position and state of cursor
								cons.savecursor();
							}else if(state="restore"){
								// Overwrite position and state of cursor
								cons.loadcursor();
							}
						}else if(keycontrol!=null){
							// Key-control is ignored for now 
						}else{
							alert("Unknown Cursor Command Parameters: ");
						}
					}else if(childr[jj].nodeName=="erase"){
						// Clear
						var range=childr[jj].getAttribute('range');
						if(range=="all"){
								cons.clrscr();
						}else{
								alert("Unknown Range: "+range);
						}
					}else if(childr[jj].nodeName=="screen"){
						// Swap Screen
						var swapto=parseInt(childr[jj].getAttribute('switchto'));
						if(swapto==0){
								this.currentbuffer=1;
								this.touch();
								this.renderTiles();
						}else if(swapto==1){
								this.currentbuffer=2;
								this.touch();
								this.renderTiles();
						}else{
								alert("Unknown Buffer: "+swapto);									    				
						}
					}else{
						alert("Unknown Op Class: "+childr[jj].nodeName);
					}
				}
				this.step++;
				
				// If we reach fastforward target, stop fastforward mode and render current tile
				if(this.windtarget>=0&&this.step>=this.windtarget){
					this.fastforward=0;
					this.windtarget=-1;
					
					if(!this.playafterwind){
						this.pause();
					} 
					
					this.updateSearchBar();							
					this.renderTiles();
				}		
					
				// If we are in fastforward do not render tiles
				if(this.fastforward){
					nextdelay=0;			
				}else{
					if(delay>0){
						cons.renderTiles();
						this.delaycnt=0;
					}else{
						this.delaycnt++;
						if(this.delaycnt>this.deferscroll){
							cons.renderTiles();
							this.delaycnt=0;
						}
					}
				}

				// Run advancestep after specific amount of time (recursive).
				// Set timeout is needed to ensure that HTML-changes are loading.
				clearTimeout(this.timeoutStore);
				this.timeoutStore = setTimeout(function(){cons.advancestep();}, nextdelay);			
									
			}else{
				// Reached end of XML
				cons.renderTiles();
				this.pause();
				this.finished = 1;

				// Repeat or finish
				if (this.repeat == 1) {
					this.play();
				}
			}
		}
	}				

	//-------------------------------------------------------------------------------------------
	// Update search bar
	//-------------------------------------------------------------------------------------------	
	this.updateSearchBar = function()
	{
		var fract=this.step/this.timesteps.length;
		document.getElementById("bar").style.width = (Math.round(100*fract) + '%');
	}
	
	//-------------------------------------------------------------------------------------------
	// renderCaret
	//-------------------------------------------------------------------------------------------
	this.renderCaret = function(caretx,carety,chr)
	{														
		// Ignore caret outside of screen bounds (generates javascript error)
		if(caretx<this.consolewidth&&carety<this.consoleheight){
			// Render html for caret layer using character chr (character decides if we render or un-render caret)
			cx=(Math.floor(caretx/this.tilesize))*this.tilesize;
			cy=carety;
			cid="caret"+cy+":"+cx;
			var carettile = document.getElementById(cid);							
			cxp=caretx%this.tilesize;
			
			str="";
			for(var ii=0;ii<this.tilesize;ii++){
				if(ii==cxp){
						str+=chr;
				}else{
						str+="&nbsp;";
				}
			}
			carettile.innerHTML=str;

			// Set caret color
			var caret = document.getElementById("caret");
			ccolor=colortab[this.caretcolor];
			caret.style.color=ccolor.substring(6, ccolor.length-1);
		}
	}

	//-------------------------------------------------------------------------------------------
	// renderTiles
	//-------------------------------------------------------------------------------------------
	this.renderTiles = function()
	{														
		// Clear old Caret
		this.renderCaret(this.oldcaretx,this.oldcarety,"&nbsp;");													
		
		// Render All Tiles
		for(var cy=0;cy<consoleheight;cy++){
			for(cx=0;cx<consolewidth;cx+=this.tilesize){
				if(this.currentbuffer==1){
					this.rows[cy][Math.floor(cx/this.tilesize)].render();
				}else if(this.currentbuffer==2){
					this.altrows[cy][Math.floor(cx/this.tilesize)].render();												
				}
			}
		}

		// Render new Caret (&#9608; is solid box) (&#8215; is bottom dual caret) (&#95; is underscore character)
		this.renderCaret(this.caretx,this.carety,"&#9608;");
		this.oldcaretx=this.caretx;
		this.oldcarety=this.carety;		
	}

	//-------------------------------------------------------------------------------------------
	// prepconsoleTiles
	//-------------------------------------------------------------------------------------------
	this.prepconsoleTiles = function()
	{
		var consarea = document.getElementById('cons');							
		var caretarea = document.getElementById('caret');							
		str="";
		caretstr="";
		
		caretdef="";
		for(var i=0;i<this.tilesize;i++){
			caretdef+="&nbsp;";
		}
		
		for(var cy=0;cy<consoleheight;cy++){
			for(cx=0;cx<consolewidth;cx+=tilesize){
					str+="<span id='"+"tile"+cy+":"+cx+"'></span>";												
					caretstr+="<span id='"+"caret"+cy+":"+cx+"'>"+caretdef+"</span>";												
			}
			str+="<br/>";
			caretstr+="<br/>";
		}
		consarea.innerHTML=str;
		caretarea.innerHTML=caretstr;
	}

	//-------------------------------------------------------------------------------------------
	// printtext
	//-------------------------------------------------------------------------------------------
	this.printtext = function(tex)
	{
		var tx;
		for(tx=0;tx<tex.length;tx++){
			// If we write outside bunds either ignore or new line
			if(this.linewrap||(!this.linewrap&&this.caretx<this.consolewidth)){
				if(this.linewrap&&this.caretx>=this.consolewidth){
					this.caretx=0;
					this.carety++;
					if(this.carety>=this.consoleheight){
						// Scroll
						this.carety=this.consoleheight-1;
						this.scroll();									
					}
				}
				cpos=this.caretx % this.tilesize;
				ctpos=Math.floor(this.caretx / this.tilesize);
			
				whitesp=tex.charAt(tx);
				whitesp=whitesp.replace(" ","&nbsp;");
				if(this.currentbuffer==1){
					this.rows[this.carety][ctpos].tiledata.characters[cpos]=whitesp;
					this.rows[this.carety][ctpos].tiledata.colors[cpos]=this.color;
					this.rows[this.carety][ctpos].tiledata.bgcolors[cpos]=this.bgcolor;
					this.rows[this.carety][ctpos].updated=1;
				}else{
					this.altrows[this.carety][ctpos].tiledata.characters[cpos]=whitesp;
					this.altrows[this.carety][ctpos].tiledata.colors[cpos]=this.color;
					this.altrows[this.carety][ctpos].tiledata.bgcolors[cpos]=this.bgcolor;
					this.altrows[this.carety][ctpos].updated=1;
				}
			}else{
				// Ignore if outside bounds and no line wrap
			}										
			this.caretx++;
		}
	}

	//-------------------------------------------------------------------------------------------
	// newline
	//-------------------------------------------------------------------------------------------
	this.newline = function()
	{
		this.caretx=0;
		this.carety++;
		if(this.carety>=this.consoleheight){
			// Scroll
			this.carety=this.consoleheight-1;
			this.scroll();									
		}
	}

	//-------------------------------------------------------------------------------------------
	// gotoxy
	//-------------------------------------------------------------------------------------------
	this.gotoxy = function(xk,yk)
	{
		// Go to a new position in console
		if(xk>=this.consolewidth) xk=this.consolewidth-1;
		if(yk>=this.consoleheight) xy=this.consoleheight-1;
		
		this.caretx=xk;
		this.carety=yk;
	}   

	//-------------------------------------------------------------------------------------------
	// touch
	//-------------------------------------------------------------------------------------------
	this.touch = function()
	{
		// Update All Tiles
		for(var cy=0;cy<this.consoleheight;cy++){
			for(var cx=0;cx<this.consolewidth;cx+=this.tilesize){
				if(this.currentbuffer==1){
					this.rows[cy][Math.floor(cx/this.tilesize)].updated=1;
				}else if(this.currentbuffer==2){
					this.altrows[cy][Math.floor(cx/this.tilesize)].updated=1;
				}
			}
		}
	}

	//-------------------------------------------------------------------------------------------
	// scroll
	//-------------------------------------------------------------------------------------------
	this.scroll = function()
	{
		// Render All Tiles
		for(var cy=0;cy<(this.consoleheight-1);cy++){
			for(var cx=0;cx<this.consolewidth;cx+=this.tilesize){
				if(this.currentbuffer==1){
					t1=this.rows[cy][Math.floor(cx/this.tilesize)];
					t2=this.rows[cy+1][Math.floor(cx/this.tilesize)];
				}else if(this.currentbuffer==2){
					t1=this.altrows[cy][Math.floor(cx/this.tilesize)];
					t2=this.altrows[cy+1][Math.floor(cx/this.tilesize)];
				}
				t1.updated=1;
				for(ch=0;ch<this.tilesize;ch++){
					t1.tiledata.colors[ch]=t2.tiledata.colors[ch];
					t1.tiledata.bgcolors[ch]=t2.tiledata.bgcolors[ch];
					t1.tiledata.characters[ch]=t2.tiledata.characters[ch];
				}
			}
		}
		this.clearrow(this.consoleheight-1);						  
	}

	//-------------------------------------------------------------------------------------------
	// clearrow
	//-------------------------------------------------------------------------------------------
	this.clearrow = function(rowy)
	{
		// Clear specified row
		for(var cx=0;cx<this.consolewidth;cx+=this.tilesize){
			if(this.currentbuffer==1){
				t1=this.rows[rowy][Math.floor(cx/this.tilesize)];
			}else if(this.currentbuffer==2){
				t1=this.altrows[rowy][Math.floor(cx/this.tilesize)];
			}
			t1.updated=1;
			for(ch=0;ch<this.tilesize;ch++){
				t1.tiledata.colors[ch]=this.defaultcolor;
				t1.tiledata.bgcolors[ch]=this.defaultbgcolor;
				t1.tiledata.characters[ch]="&nbsp;";
			}
		}
	}
}