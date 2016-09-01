$(function(){
	var domains = {};
	var $scripts = $("script[src]");
	var $links = $("link[src]");
	
	
	domains[location.hostname] = true;

	$links.each(function(){
		var element_src = $(this).attr('src');
		// var anchor_element = document.createElement("a");
		// anchor_element.href = element_src;
		// domains[anchor_element.host] = true;
		var matched = element_src.match(/([a-z0-9A-Z]+\.)+[a-z]+/);
		domains[matched[0]] = true;

	});
	$scripts.each(function(){
		var element_src = $(this).attr('src');
		// var anchor_element = document.createElement("a");
		// anchor_element.href = element_src;
		// domains[anchor_element.host] = true;
		var matched = element_src.match(/([a-z0-9A-Z]+\.)+[a-z]+/);
		domains[matched[0]] = true;
	});
	
	domains = Object.keys(domains);

	setTimeout(function(){
		chrome.runtime.sendMessage({domains: domains}, function(response) {
			if(Object.keys(response.mapping).length){
				var listHtml = mkListHtml(response.mapping);
				var allhtml = mkAllHtml(listHtml);
				$("body").append(allhtml);
				$("#whatHostUsed").bind("mouseover",function(){
					if($(this).css("left") == '0px') {
						$(this).css("left", "auto");
						$(this).css("right", "0px");
					} else {
						$(this).css("left", "0px");
						$(this).css("right", "auto");
					}
				});
			}
		});
	}, 1000)

	function mkAllHtml(listHtml) {
		var allhtml = '<div id="whatHostUsed">\
					<ul>' + listHtml + '</ul>\
				</div>';
		return allhtml;
	}
	function mkListHtml(datas) {
		var listHtml = [];
		var color = ['#33c86a', '#cb1c39', '#69879f', '#78bd22', '#762ca7', '#03c0c6'];
		var ran = 0;
		for(var i in datas) {
			ran = (ran >= color.length) ? 0 : ran;
			listHtml.push('<li class="fore-li"><span class="fore1" style="background:'+color[ran]+'">' + i + '</span><span class="fore2" style="background:'+color[ran]+'">' + datas[i] + '</span></li>')
			ran += 1;
		}
		return listHtml.join('');
	}
});


