export interface ISqlCompleter {
  value: string,
  meta: string,
  name?: string,
  score?: number,
  caption?: string,
}
export const sql_completers: ISqlCompleter[] = [
  {
    value: 'SELECT',
    meta: '',
    score: 10
  },

]