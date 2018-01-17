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
	domains[location.host] = true;
	domains = Object.keys(domains);
	// console.log(domains)
	setTimeout(function(){
		chrome.runtime.sendMessage({domains: domains, currentpageurl:location.host}, function(response) {
			if(Object.keys(response.mapping).length){
				var listHtml = mkListHtml(response.mapping);
				var allhtml = mkAllHtml(listHtml);
				$("body").append(allhtml);
				$(".whatHostUsed").bind("mouseover",function(){
					if($(this).hasClass("whatHostUsedRight")) {
						$(this).removeClass("whatHostUsedRight").addClass("whatHostUsedLeft")
					} else {
						$(this).removeClass("whatHostUsedLeft").addClass("whatHostUsedRight")
					}
				});
			}
		});
	}, 1500)

	function mkAllHtml(listHtml) {
		var allhtml = '<div class="whatHostUsed whatHostUsedRight">\
					<ul>' + listHtml + '</ul>\
				</div>';
		return allhtml;
	}
	function mkListHtml(datas) {
		var listHtml = [];
		var color = ['#33c86a', '#69879f', '#78bd22', '#762ca7', '#03c0c6', '#209cee'];
		var ran = 0;
		var fromCache = ''
		for(var i = 0; i < datas.length; i++) {
			ran = (ran >= color.length) ? 0 : ran;	
			if(datas[i]['detail']) {
				fromCache = datas[i]['detail']['fromCache'] ? 'fromCache' : 'fromServer'
				listHtml.push('<li class="fore-li"><span class="fore1" style="background:'+color[ran]+'">' + datas[i]['host'] + '</span><span class="fore2" style="background:'+color[ran]+'">' + datas[i]['detail']['ip'] + '</span><span class="fore3" style="background:'+color[ran]+'">' + fromCache + '</span></li>')
			} else {
				listHtml.push('<li class="fore-li"><span class="fore1" style="background:#cb1c39">' + datas[i]['host'] + '</span><span class="fore2" style="background:#cb1c39">network error</span></li>')
			}
			ran += 1;
		}
		return listHtml.join('');
	}
// });


