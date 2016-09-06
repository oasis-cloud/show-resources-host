window.onload = function() {
	function get_localStorage_to_array() {
		var values = chrome.extension.getBackgroundPage().localStorage.getItem("pop-host-names");
		if(!values) return [];
		values = values.split("|");
		return values;
	}

	function set_localStorage(value) {
		if(!value) return false;
		chrome.extension.getBackgroundPage().localStorage.setItem("pop-host-names", value.join("|"));
		return true;
	}

	var v_host_lists = new Vue({
		el:'#pop-lists',
		data:{
			lists:[]
		},
		methods:{
			del_host:function(event){
				console.log(event.target)
				var el_host = event.target.previousSibling.innerText;
				v_host_lists.lists.splice(v_host_lists.lists.indexOf(el_host), 1);
				set_localStorage(v_host_lists.lists);
			},
			del_mouseenter:function(){
				var $parent = event.target.parentElement;
				$parent.className = "hover";
			},
			del_mouseout:function(){
				var $parent = event.target.parentElement;
				$parent.className = "";	
			}
		}
	});

	var v_add_list = new Vue({
		el:"#add-list-form",
		methods:{
			add_host_name:function(event){
				var el_input = document.querySelector("input", this.$el);
				var el_a = document.createElement("a");
				el_a.href = "http://" + el_input.value;
				if(el_a.host) {
					var localStorage_array = get_localStorage_to_array();
					var host_name = el_a.host;
					if(localStorage_array.indexOf(host_name) == -1) {
						localStorage_array.push(host_name);
						if(set_localStorage(localStorage_array)){
							v_host_lists.lists = localStorage_array;
						}
					}
				}
			}
		}
	});

	v_host_lists.lists = get_localStorage_to_array();

}