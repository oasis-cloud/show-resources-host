window.onload = function() {
	var localstorage;

	if(chrome.extension) {
		localstorage = 	chrome.extension.getBackgroundPage().localStorage;
	} else {
		localstorage = localStorage;
	}

	function get_localStorage_defaultconf() {
		var values = localstorage.getItem("pop-host-default-conf");
		return values;
	}
	function set_localStorage_defaultconf(value) {
		if(!value) return false;
		localstorage.setItem("pop-host-default-conf", value);
		return true;
	}
	function in_arr(key,arr) {
		for(var i = 0; i < arr.length; i++) {
			if(arr[i]['d'] == key) {
				return i
			}
		}
		return false;	
	}
	var v_host_lists = new Vue({
		el:'#pop-lists',
		data:{
			lists:[]
		},
		methods:{
			del_host:function(event){
				var el_host = event.target.previousSibling,
					el_domain = event.target.parentElement.parentElement.previousSibling,
					host_name,
					is_in_arr,
					domain_name;
				while(el_host.nodeType == 3) {
					el_host = el_host.previousSibling
				}

				host_name = el_host.innerText;

				while(el_domain.nodeType == 3) {
					el_domain = el_domain.previousSibling
				}
				
				domain_name = el_domain.querySelector("span").innerText;				

				is_in_arr = in_arr(domain_name, v_host_lists.lists);

				if(is_in_arr !== false) {
					var temp = v_host_lists.lists[is_in_arr]["h"].indexOf(host_name);
					v_host_lists.lists[is_in_arr]["h"].splice(temp, 1);
				}
				
				localstorage.setItem("hosts-names", JSON.stringify(v_host_lists.lists));
			},
			del_domain:function(event){
				var el_domain = event.target.previousSibling,
					domain_name,
					is_in_arr;
				while(el_domain.nodeType == 3) {
					el_domain = el_domain.previousSibling
				}
				domain_name = el_domain.innerText;
				
				is_in_arr = in_arr(domain_name, v_host_lists.lists);

				if(is_in_arr !== false) {
					v_host_lists.lists.splice(is_in_arr, 1);
					localstorage.setItem("hosts-names", JSON.stringify(v_host_lists.lists))
				}
			}
		}
	});

	var v_add_list = new Vue({
		el:"#add-list-form",
		methods:{
			add_hosts_name:function(event){
				var arr,is_in_arr,newhosts,
					el_input = document.querySelector("#add-list-form input", this.$el),
					el_textarea = document.querySelector("#add-list-form textarea", this.$el),
				
					page_domain = el_input.value,
					page_domain_hostname = el_textarea.value;

				if(!page_domain) return;
				
				arr = localstorage.getItem("hosts-names") || "[]";
				arr = JSON.parse(arr);
				
				is_in_arr = in_arr(page_domain,arr);

				if(is_in_arr !== false) {
					newhosts = page_domain_hostname.split("\n");

					for(var i = 0; i < newhosts.length;i++) {
						if(arr[is_in_arr]['h'].indexOf(newhosts[i]) == -1) {
							arr[is_in_arr]['h'].push(newhosts[i]);	
						}
					}
					
				} else {
					arr.push({d:page_domain,h:page_domain_hostname.split("\n")});
				}
				localstorage.setItem("hosts-names", JSON.stringify(arr));
				v_host_lists.lists = arr;
			}
		}
	});
	var v_explain = new Vue({
		el:".explain-header",
		methods:{
			show_explain:function(event){
				var $explain = document.querySelector("#explain");
				var is_open = $explain.dataset.open;
				if(is_open == 'no') {
					$explain.style.display = "block";
					$explain.dataset.open = "yes";
				} else {
					$explain.style.display = "none";
					$explain.dataset.open = "no";
				}
			}
		}
	});

	var v_default_conf = new Vue({
		el:"#default-conf-form",
		data:{
			open:"true"
		},
		methods:{
			isopen:function(event){
				if(event.target.checked) {
					set_localStorage_defaultconf("true");
				} else {
					set_localStorage_defaultconf("false");
				}
				
			}
		}
	})


	var default_conf = get_localStorage_defaultconf();
	
	if(default_conf == null) {
		set_localStorage_defaultconf("true");
		v_default_conf.open = "true";
	} else {
		v_default_conf.open = default_conf;
	}

	var obj = localstorage.getItem("hosts-names") || "{}";

	v_host_lists.lists = JSON.parse(obj);

}