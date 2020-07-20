export const app_search_params = [
  'sql',
  'qid',
  'did',
  'lid',
  'toggle'
]

export const appSearchPick = (app_obj) => {
  if (!app_obj) { return {}}
  let out: any = {}
  app_search_params.forEach(a=>{
    if (app_obj[a]) {
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
  return '?' + new URLSearchParams(appSearchPick(search_obj)).toString()
}

export const exploreEmbedPath = (qid, toggle) => {
  return `?qid=${qid}&toggle=${toggle}`
}