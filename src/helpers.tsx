export const app_search_params = [
  'sql',
  'qid',
  'did',
  'lid',
  'toggle'
]

export const appSearchPick = (app_obj) => {
  if (!app_obj) { return {} }
  let out: any = {}
  app_search_params.forEach(a => {
    if (app_obj[a] && app_obj[a].length) {
      out[a] = app_obj[a]
    }
  })
  return out
}

export const getAppSearch = (search: string) => {
  let sp;
  if (search.length) {
    sp = new URLSearchParams(search.split('?')[1])
    return {
      qid: sp.get('qid'),
      sql: sp.get('sql'),
      did: sp.get('did'),
      lid: sp.get('lid'),
      toggle: sp.get('toggle')
    }
  } else {
    return {}
  }
}

export const newSearchUrl = (search_obj: any) => {

  console.log(appSearchPick(search_obj))
  const obj = new URLSearchParams(appSearchPick(search_obj))
  return '?' + obj.toString()
}

export const exploreEmbedPath = (qid:string, toggle:string) => {
  return `?qid=${qid}&toggle=${toggle}`
}

export function apiCall(method: string, path: string, queryParams: string, payload: any) {
  let url = [path, queryParams].join('?')
  let obj: any = {
    method: method,
    headers: {
      "x-csrf-token": readCookie('CSRF-TOKEN')
    },
  }
  if (payload) { obj['body'] = JSON.stringify(payload) }
  return fetch(url, obj).then(
    response => response.json())
}

function readCookie(cookieName: string) {
  var re = new RegExp('[; ]' + cookieName + '=([^\\s;]*)');
  var sMatch = (' ' + document.cookie).match(re);
  if (cookieName && sMatch) return unescape(sMatch[1]);
  return '';
}

const TEMP_DYNAMIC_FIELD = {
  "measure": "",
  "based_on": "",
  "expression": "",
  "label": "",
  "type": "sum",
  "_kind_hint": "measure",
  "_type_hint": "number"
} 

export function getFields(explore: any) {
  var fields = explore.fields.dimensions;
  let dynamic_fields: any = [];
  var selected: any = []
  var sql_property_counts: any = {};

  // check for the number of times a sql property is used
  fields.forEach((f:any) => {
    if (sql_property_counts[f.sql]) {
      sql_property_counts[f.sql] = sql_property_counts[f.sql] + 1;
    } else {
      sql_property_counts[f.sql] = 1
    }
  })

  fields.forEach((f:any)=>{
    if (sql_property_counts[f.sql] > 1 && f.type.substring(0,4) == 'date' && f.type != 'date_time') {
      // do nothing with date parts
    } else if (f.is_numeric) {
      // create dynamic fields
      let temp = {
        ...TEMP_DYNAMIC_FIELD,
        measure: snakeCase(f.label),
        based_on: f.name,
        label: f.label,
      }
      dynamic_fields.push(temp)
      selected.push(temp.measure)
    } else {
      selected.push(f.name)
    }
  })
  return {selected, dynamic_fields};
}


const snakeCase = (string: string) => {
  return string.replace(/\W+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_');
};

