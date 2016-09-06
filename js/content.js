// $(function(){
	var domains = {};
	var $scripts = $("script[src]");
	var $links = $("link[src]");
	domains[location.hostname] = true;

	function set_to_domains(element_src) {
		if(element_src.indexOf('/') == 0 || element_src.indexOf('./') == 0 || element_src.indexOf('../') == 0) {
			domains[location.host] = true;
		} else {
			var matched = element_src.match(/([a-z0-9A-Z]+\.)+[a-z]+/);
			domains[matched[0]] = true;
		}
	}

	$links.each(function(){
		var element_src = $(this).attr('src');
		set_to_domains(element_src);
	});
	$scripts.each(function(){
		var element_src = $(this).attr('src');
		set_to_domains(element_src)
	});
	
	domains = Object.keys(domains);

	setTimeout(function(){
		chrome.runtime.sendMessage({domains: domains}, function(response) {
			if(Object.keys(response.mapping).length){
				var listHtml = mkListHtml(response.mapping);
				var allhtml = mkAllHtml(listHtml);
				$("body").append(allhtml);
				$(".whatHostUsed").bind("mouseover",function(){
					if($(this).hasClass("whatHostUsedLeft")) {
						$(this).removeClass("whatHostUsedLeft").addClass("whatHostUsedRight")
					} else {
						$(this).removeClass("whatHostUsedRight").addClass("whatHostUsedLeft")
					}
				});
			}
		});
	}, 1000)

	function mkAllHtml(listHtml) {
		var allhtml = '<div class="whatHostUsed whatHostUsedLeft">\
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
// });


