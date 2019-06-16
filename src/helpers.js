export function apiCall(method, path, queryParams, payload) {
  let url = [path, queryParams].join('?')
  let obj = { 
    method: method,
    headers: {
      "x-csrf-token": readCookie('CSRF-TOKEN')
    },
    body: JSON.stringify(payload)
  }
  return fetch(url, obj).then(
    response => response.json())
}

function readCookie(cookieName) {
  var re = new RegExp('[; ]'+cookieName+'=([^\\s;]*)');
  var sMatch = (' '+document.cookie).match(re);
  if (cookieName && sMatch) return unescape(sMatch[1]);
  return '';
}

export function createQuery(dynamic_query) {
	var body = {
		"model": dynamic_query.model,
		"view": "sql_runner_query",
    "fields": dynamic_query.selected,
    "sorts": dynamic_query.sorts,
    "dynamic_fields": JSON.stringify(dynamic_query.dynamic_fields),
    "vis_config": dynamic_query.vis_config
  };
  return body;
}

export function tryJSONParse(s){
  try{
      return JSON.parse(s)
    }catch(e){
      return undefined
    }
}

export function d_elements_sorter(d_elements) {
  d_elements = d_elements.filter(function( obj ) {
    return obj.type != 'text';
  });
  if (d_elements.length > 0) {
    d_elements = d_elements.sort(function(a,b) {
      let a_title = a.title || a.look.title;
      let b_title = b.title || b.look.title;
      let comparison = 0;
      if (a_title.toUpperCase() > b_title.toUpperCase()) {
        comparison = 1
      } else {
        comparison = -1
      }
      return comparison
    })
  }
  return d_elements
}