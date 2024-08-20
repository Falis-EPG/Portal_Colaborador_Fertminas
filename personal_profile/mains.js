APP={}
APP.init = function(){

	_this=this;
	this.state = "loading";
	this.loader.show();
	console.log(this.data.title, "v" + this.data.version + " " + this.data.langauge);

	// get incoming query params
	this.queryParams = $.getQueryParameters();
	if(this.queryParams.page) { this.page = this.queryParams.page;}

	// get device specs and capabilities
	getSpecs(this);

	AOS.init({
      offset: 60,
      duration:1000,
    });
	//window.addEventListener('load', 9);

	// show upgrade if case not supported
	if( ( this.browser.name=="Chrome" && this.browser.version<20 ) || ( this.browser.name=="IE" && this.browser.version<11 ) ||  ( this.browser.name=="MSIE" && this.browser.version<11 ) ){
		// show upgrade msg if required
	}

	if(this.isMobile){
		$("body").addClass("mobile");

	}
	
	// section and page is pushed to page
	if(window.section) { state = window.section; }
	if(window.page) { state+= "/" + window.page;}
	if(!window.section) { state = "home"; }
	
	// check if all preloaded and ready to go
	this.checkPreloadComplete = function(){
		console.log("CHECKING IF READY");
		if(!APP.modelsLoaded) { return null;}
		APP.loader.hide();
		APP.header.show();
		APP.go(state,false);
		
		
	}

	

	// init the views 
	APP.webGL.init();
	APP.header.init();
	APP.footer.init();
	APP.menu.init();
	APP.home.init();
	APP.work.init();
	APP.prototypes.init();
	APP.press.init();
	APP.art.init();
	APP.info.init();
	APP.workDetail.init();
	APP.prototypesDetail.init();
	APP.artDetail.init();
	APP.pressDetail.init();

	APP.videos.init();

	VanillaTilt.init(document.querySelectorAll(".tilt"), {
		reverse:true,
		max:5,
		scale:1.03,
		glare:true,
		"max-glare":.1
	});

	// hide all before start
	$(".page").addClass("hide");

    file = 'eph.mp3'

	APP.sounds=[];
	// set up the site default sounds
	$.each(APP.data.sounds,function(i, s){
		var sound = new Howl({
		  src: s.file,
		  loop: s.loop,
		  volume: s.volume,
		  html5: s.html5,
		  onend: function(o) {
		    //console.log('Finished!',o);
		  },
		  name: s.name
		});
		APP.sounds[s.name] = sound;
		APP.sounds[s.name].volume(s.volume);
		APP.sounds[s.name].maxVolume=s.volume;
	});


	// global mute control
	APP.muteAll = function(ignoreGlobalSoundState){
		console.log("mute all ");
		$(".footer-sound .sbar").addClass("noAnim");
		clearInterval(window.muteInterval);
		var v = Howler.volume();
		window.muteInterval=setInterval(function(){
			v-=.1;
			Howler.volume(v);
			if(v<=0.0){ Howler.volume(0.0); clearInterval(window.muteInterval);}
			//console.log("ticking");
		},50);

		//_this.analyser.minDecibels = -100;
		
		// flag will 
		if( !ignoreGlobalSoundState ) { APP.soundOn = false; }
	}

	// global unmute control
	APP.unMuteAll = function(ignoreGlobalSoundState){
		console.log("unMute all ");
		$(".footer-sound .sbar").removeClass("noAnim");
		clearInterval(window.muteInterval);
		var v = Howler.volume();
		window.muteInterval=setInterval(function(){
			v+=.1;
			Howler.volume(v);
			if(v>=1){ Howler.volume(1); clearInterval(window.muteInterval);}
			//console.log("ticking");
		},50);

		//_this.analyser.minDecibels = -60;

		// flag will 
		if( !ignoreGlobalSoundState ) { APP.soundOn = true; }

	}

	
	APP.sounds["ambient"].play();
	APP.soundOn=true;


		// legacy show hide as needed
	var hidden, visibilityChange;
	if (typeof document.hidden !== "undefined") {
	    hidden = "hidden";
	    visibilityChange = "visibilitychange";
	} else if (typeof document.mozHidden !== "undefined") {
	    hidden = "mozHidden";
	    visibilityChange = "mozvisibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
	    hidden = "msHidden";
	    visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
	    hidden = "webkitHidden";
	    visibilityChange = "webkitvisibilitychange";
	}

	APP.hidden = false;

	document.addEventListener(visibilityChange, handleVisibilityChange, false);

	function handleVisibilityChange() {
	   if(document[hidden]){
	   		APP.hidden = true;
	   		APP.muteAll(true);
	   		
	   }

	    if(!document[hidden]){
	    	APP.hidden = false;
	    	if(APP.soundOn){
	   			APP.unMuteAll(true);
	   		}
	   }

	}



	

	$(".footer-sound").click(function(e){
		APP.sounds['click'].play();
		//_this.audio.playFromTo("click",0,1);
		if (APP.soundOn) {
	    	$(".footer-sound .sbar").addClass("noAnim");
	   		APP.soundOn = false;
	   		APP.muteAll();
	   		// udpate cookie
	   		setCookie("muted",1);
	  	} else {
	    	$(".footer-sound .sbar").removeClass("noAnim");
	    	APP.soundOn = true;
	    	APP.unMuteAll();
	    	setCookie("muted",0);
	  	}
		
	});
	

	// to help with needing click to start audio
	$("body").click(function(){
		//APP.sounds["click"].play();
	});

	$(".background").click(function(){
		//APP.sounds["click"].play();
	});

	$("#webgl").click(function(){
		//APP.sounds["click"].play();
	});

	APP.mouse = new THREE.Vector2(0,0);
	if(!this.isMobile){
		window.addEventListener("mousemove", mouseMove);
	}

	function mouseMove(e){
		var x =  (e.clientX - window.innerWidth/2);
  		var y = (e.clientY - window.innerHeight/2);
  		APP.mouse.x = x;
  		APP.mouse.y = y;
  		//$(".background-video").css("transform","translate("+x+"px,"+y+"px)");
	}

	// reel close button
	$('#reel .close').on('click', function() {
		APP.sounds["click"].play();
		APP.hideReel();
	});


	// lazy load
	document.addEventListener("DOMContentLoaded", function() {
	var lazyloadImages;    

	  if ("IntersectionObserver" in window) {
	    lazyloadImages = document.querySelectorAll(".lazy");
	    var imageObserver = new IntersectionObserver(function(entries, observer) {
	      entries.forEach(function(entry) {
	        if (entry.isIntersecting) {
	          var image = entry.target;
	          image.src = image.dataset.src;
	          //image.classList.remove("lazy");
	          imageObserver.unobserve(image);
	        }
	      });
	    });

	    lazyloadImages.forEach(function(image) {
	      imageObserver.observe(image);
	    });
	  } else {  
	    var lazyloadThrottleTimeout;
	    lazyloadImages = document.querySelectorAll(".lazy");
	    
	    function lazyload () {
	      if(lazyloadThrottleTimeout) {
	        clearTimeout(lazyloadThrottleTimeout);
	      }    

	      lazyloadThrottleTimeout = setTimeout(function() {
	        var scrollTop = window.pageYOffset;
	        lazyloadImages.forEach(function(img) {
	            if(img.offsetTop < (window.innerHeight + scrollTop)) {
	              img.src = img.dataset.src;
	              img.classList.remove('lazy');
	            }
	        });
	        if(lazyloadImages.length == 0) { 
	          document.removeEventListener("scroll", lazyload);
	          window.removeEventListener("resize", lazyload);
	          window.removeEventListener("orientationChange", lazyload);
	        }
	      }, 20);
	    }

	    document.addEventListener("scroll", lazyload);
	    window.addEventListener("resize", lazyload);
	    window.addEventListener("orientationChange", lazyload);
	  }
	})


	
}	
	


// global analytics event tracking
APP.trackEvent = function(e){
	console.log("Event Tracked", e);
	dataLayer.push(e);
}

/*
// handle resizing of browser 
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
	// handle non webGL specific resizing
	if(app.currentTip){
		app.toolTip.show(app.state,app.currentTip);
	}
}

*/


// listen for user changing states with back and next buttons
window.onpopstate = function(event) {
	//alert(event.state);
 	var state = (event.state);
  	if(!state) { state = "home";}
    if(state=="/") { state = "home"; }
    APP.go(state, false);
};


APP.showReel = function(){
	$("#reel").addClass("show");
	APP.webGL.paused = true;
	APP.muteAll(true);

	$.each(APP.videoPlayers,function(i,p){
		if( p.showreel ){ p.play(); } else { p.pause(); }
	});
	_this.canvas.removeEventListener('mousedown', APP.webGL.onMouseDownLanding, false);

}


APP.hideReel = function(){
	$("#reel").removeClass("show");
	$.each(APP.videoPlayers,function(i,p){
		if( p.showreel ){ p.pause(); }
	});
	APP.webGL.paused = false;
	if(APP.soundOn){
		APP.unMuteAll();
	}
	_this.canvas.addEventListener('mousedown', APP.webGL.onMouseDownLanding, false);
}




APP.videos = {
	init: function(){
		APP.videoPlayers=[];
		
		// vimeo videos //
		// add a player for eaah vimeo video
		// add speical handlers for REEL as well in here
		var m = APP.data.reel;
		c="<div data-id='"+m.id+"' data-showreel=true data-autoplay=false class='player vimeo' id='player_"+m.id+"''></div>";
		$("#reel .reel-video").html(c);

		$.each($(".vimeo"),function(i,e){
         	var id = $(e).attr("data-id");
         	var autoplay = $(e).attr("data-autoplay");
         	var showreel = $(e).attr("data-showreel");
		    var options = {
		        id: id,
		        height: '349',
		        width: '560',
		        loop: false,
		        autoplay:autoplay,
		        byline:false,
		        color:'ffff5d',
		        title:false
		    };

		    var player = new Vimeo.Player('player_'+id, options);

		    player.setVolume(1);

		    player.on('play', function() {
		        console.log('video played');
		        APP.muteAll(true);
		    });

		    player.on('pause', function() {
		        console.log('video paused!');
		        if(APP.soundOn && !APP.hidden){
		   			APP.unMuteAll();
		   		}
		    });

		    player.on('stop', function() {
		        console.log('video stopped');
		        if(APP.soundOn && !APP.hidden){
		   			APP.unMuteAll();
		   		}
		    });

		    player.on('loaded', function() {
		        console.log('video is ready and loaded');
		    });

		    if(showreel) { player.showreel = true;} else { player.showreel=false; }
		    
      		APP.videoPlayers.push(player);
	     });


	}



	


}





// router, manage state  //
APP.go = function(state, storeHistory){
	if(this.state==state) { return false; }
	console.log("Change state requested. From " + this.state + " to " + state);

	// get section and page
	var path = state.split( '/' );
	if(path[0]){ var section  = path[0]; }
	if(path[1]){ var page = path[1]; }

	var fromPath = this.state.split( '/' );
	if(fromPath[0]){ var fromSection  = fromPath[0]; }
	if(fromPath[1]){ var fromPage = fromPath[1]; }

	// dynamic url is same level unless coming from deeper link
	// then up a level
	p = "./";
	if(fromPage){ p = "../";}

	if( section ) { 
		console.log("section",section);
	}

	if( page ){
		console.log("page",page);
	}

	console.log(p);

	// close the menu if open
	APP.menu.hide();



	// handle leaving old state
	switch(fromSection){
		case "home":
			APP.home.hide();
			break;

		case "work":
			if(fromPage){
				APP.workDetail.hide();
			} else {
				APP.work.hide();
			}
			break;

		case "prototypes":
			if(fromPage){
				APP.prototypesDetail.hide();
			} else {
				APP.prototypes.hide();
			}
			break;


		case "art":
			if(fromPage){
				APP.artDetail.hide();
			} else {
				APP.art.hide();
			}
			break;

		case "press":
			if(fromPage){
				APP.pressDetail.hide();
			} else {
				APP.press.hide();
			}
			break;

		case "info":
			APP.info.hide();
			break;

		case "contact":
			APP.contact.hide();
			break;

	}


	// handle entering new state
	switch(section){
		case "home":
			var title = APP.data.home.title;
			document.title = APP.data.home["page-title"];
			if(storeHistory) { history.pushState(state, title, p); }
			APP.state = state;
			APP.webGL.go("home");
			APP.home.show();
			break;

		case "work":
			if( page ){
				// work detail
				APP.loader.update(.0);
				APP.loader.show();
				$.get("data/" + section + "/" + page + ".json", function(data){
					setTimeout(function(){APP.workDetail.load(data);},800);
					if(storeHistory) { history.pushState(state, title, p + state); }
					APP.state = state;
					document.title = data['page-title'];
					APP.webGL.go("workDetail");
					setTimeout(function(){APP.loader.update(.7);},500);
					setTimeout(function(){APP.workDetail.show(); APP.loader.update(1.0); APP.loader.hide()},1000);
				});

			} else {
				// work index
				var title = APP.data.work.title;
				document.title = APP.data.work["page-title"];
				setTimeout(function(){APP.work.show();},0);
				APP.webGL.go("work");
				if(storeHistory) { history.pushState(state, title, p + state); }
				APP.state = state;
			}
			break;

		case "press":
			if( page ){
				// press  detail
				APP.loader.update(.0);
				APP.loader.show();
				$.get("data/" + section + "/" + page + ".json", function(data){
					setTimeout(function(){APP.pressDetail.load(data);},800);
					if(storeHistory) { history.pushState(state, title, p + state); }
					APP.state = state;
					document.title = data['page-title'];
					APP.webGL.go("pressDetail");
					setTimeout(function(){APP.loader.update(.7);},500);
					setTimeout(function(){APP.pressDetail.show(); APP.loader.update(1.0); APP.loader.hide()},1000);
				});

			} else {
				// art index
				var title = APP.data.press.title;
				document.title = APP.data.press["page-title"];
				setTimeout(function(){APP.press.show();},0);
				APP.webGL.go("press");
				if(storeHistory) { history.pushState(state, title, p + state); }
				APP.state = state;
			}
			
			break;

		case "art":
			if( page ){
				// art detail
				APP.loader.update(.0);
				APP.loader.show();
				$.get("data/" + section + "/" + page + ".json", function(data){
					setTimeout(function(){APP.artDetail.load(data);},800);
					if(storeHistory) { history.pushState(state, title, p + state); }
					APP.state = state;
					document.title = data['page-title'];
					APP.webGL.go("artDetail");
					setTimeout(function(){APP.loader.update(.7);},500);
					setTimeout(function(){APP.artDetail.show(); APP.loader.update(1.0); APP.loader.hide()},1000);
				});

			} else {
				// art index
				var title = APP.data.art.title;
				document.title = APP.data.art["page-title"];
				setTimeout(function(){APP.art.show();},0);
				APP.webGL.go("art");
				if(storeHistory) { history.pushState(state, title, p + state); }
				APP.state = state;
			}
			
			break;


		case "prototypes":
			if( page ){
				// prototype detail
				APP.loader.update(.0);
				APP.loader.show();
				$.get("data/" + section + "/" + page + ".json", function(data){
					setTimeout(function(){APP.prototypesDetail.load(data);},800);
					if(storeHistory) { history.pushState(state, title, p + state); }
					APP.state = state;
					document.title = data['page-title'];
					APP.webGL.go("prototypesDetail");
					setTimeout(function(){APP.loader.update(.7);},500);
					setTimeout(function(){APP.prototypesDetail.show(); APP.loader.update(1.0); APP.loader.hide()},1000);
				});

			} else {
				// work index
				var title = APP.data.prototypes.title;
				document.title = APP.data.prototypes["page-title"];
				setTimeout(function(){APP.prototypes.show();},0);
				APP.webGL.go("prototypes");
				if(storeHistory) { history.pushState(state, title, p + state); }
				APP.state = state;
			}
			break;


		case "info":

			var title = APP.data.info.title;
			document.title = APP.data.info["page-title"];
			setTimeout(function(){APP.info.show();},0);
			APP.webGL.go("info");
			if(storeHistory) { history.pushState(state, title, p + state); }
			APP.state = state;
			break;
			
	}

	// update loaded icon default image
	if(state=="home"){
		setTimeout(function(){
			$(".top-bar").removeClass("hide");
			$(".bottom-bar").removeClass("hide");
			$(".top-bar").addClass("bar");
			$(".bottom-bar").addClass("bar");
			$(".header").removeClass("show");
			$(".footer-menu").addClass("show");
		},500)

	} else {
		setTimeout(function(){
			$(".top-bar").removeClass("bar");
			$(".bottom-bar").removeClass("bar");
			$(".top-bar").addClass("hide");
			$(".bottom-bar").addClass("hide");
			$(".header").addClass("show");
			$(".footer-menu").removeClass("show");
		},500)
	}

	// hide / show anything globally here
	
	setTimeout(function(){
		//$('html,body').animate({ scrollTop: 100 },0);
		$('html,body').animate({ scrollTop: 0 },1000);
	},50);


	
}



