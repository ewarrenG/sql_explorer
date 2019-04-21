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

function readCookie(cookieName) {
  var re = new RegExp('[; ]'+cookieName+'=([^\\s;]*)');
  var sMatch = (' '+document.cookie).match(re);
  if (cookieName && sMatch) return unescape(sMatch[1]);
  return '';
}