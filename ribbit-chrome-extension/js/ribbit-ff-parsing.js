// This is the regular expression used to find US formatted phone numbers
phoneNumberRegexUS=/(?:\([2-9][0-8]\d\)\ ?|[2-9][0-8]\d[\- \.\/]?)[2-9]\d{2}[- \.\/]?\d{4}\b/g,

// This is the regular expression used to find UK formatted phone numbers
phoneNumberRegexUK=/0\d{2,4}[ -]{1}[\d]{3}[\d -]{1}[\d -]{1}[\d]{1,4}\b/g,

/*
 * To make it easier to follow, the code below is just finding matches for the US numbers,
 * but you can easily see how you could just add in a second check for UK numbers as well.
 */
// ribLoad();
// This is what searches through the page elements, creating links out of anything that matches the regex above
clickToCall=function(){
  //  var isEnabled=rib!=null?rib.getIsEnabled():false;
  //  alert(isEnabled);
   // if(!isEnabled)
//	    return;
    var allowedParents = ['abbr','acronym','address','applet','b','bdo','big','blockquote','body','caption','center','cite','code','dd','del','div','dfn','dt','em','fieldset','font','form','h1','h2','h3','h4','h5','h6','i','iframe','ins','kdb','li','nobr','object','pre','p','q','samp','small','span','strike','s','strong','sub','sup','td','th','tt','u','var'],
    search='//text()[(parent::'+allowedParents.join(' or parent::')+')'+']',
	textNodes=document.evaluate(search,document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null),
	
	updateNodes=function(textNodes){
		for(var i=0,textNode;i<textNodes.snapshotLength;i++){
			textNode=textNodes.snapshotItem(i);
			if(phoneNumberRegexUS.test(textNode.nodeValue)){
				var
					source=textNode.nodeValue,
					replacement=document.createElement('span');
                    if (textNode != null)
				textNode.parentNode.replaceChild(replacement,textNode);
				phoneNumberRegexUS.lastIndex=0;
				for(var match=null,lastLastIndex=0;(match=phoneNumberRegexUS.exec(source));){
                    
					replacement.appendChild(document.createTextNode(source.substring(lastLastIndex,match.index)));
					
                    // Create anchor element
                    var a = document.createElement('a');
					a.setAttribute('style','cursor:pointer');
                    a.setAttribute('number', match[0]);
                    a.appendChild(document.createTextNode("Call "+match[0]+" with Ribbit"));
					
                    // This is the function that is called when the user clicks on the number
                    // Send message to background page to initiate call
                    a.addEventListener('click',function(){  
						var	num = this.getAttribute("number");
                        chrome.extension.sendRequest(["call", num]);
					},false);
                    
                    // Rollover message to indicate a callable number
					a.addEventListener('mouseover',function(){
						this.setAttribute('title',this.innerHTML);
					},false);
					
                    replacement.appendChild(a);
					lastLastIndex=phoneNumberRegexUS.lastIndex
				}
				replacement.appendChild(document.createTextNode(source.substring(lastLastIndex)));
				replacement.normalize();
			}
		}
	};
		
    updateNodes(textNodes);
    /*for(var i=0;i<document.defaultView.frames.length;i++){
        textNodes=document.defaultView.frames[i].document.evaluate(search,document.defaultView.frames[i].document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
		updateNodes(textNodes)
    }*/
};

clickToCall();
