import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Code, Box, Heading } from '@looker/components';
import styled from 'styled-components'
import AceEditor, { ICommand } from 'react-ace'
import { SqlContext } from './SqlContext';
import { sql_completers, ISqlCompleter } from './SqlEditorOptions'

const LANG = 'mysql'
require(`ace-builds/src-noconflict/mode-${LANG}`);
require(`ace-builds/src-noconflict/snippets/${LANG}`);

const THEME = 'textmate'
require(`ace-builds/src-noconflict/theme-${THEME}`)
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import { uniq } from 'lodash';

export function SqlEditor() {
  const [prepared, setPrepared] = useState()
  const [editor, setEditor] = useState()
  const [completers, setCompleters] = useState<ISqlCompleter[]>(sql_completers)
  const {
    setWrittenSql,
    written_sql,
    use_model,
    current_connection,
    current_model,
    setUpdatePrepared,
    current_columns,
    setRunning
  } = useContext(SqlContext)

  useEffect(() => {
    if (current_columns?.length && current_columns[0]?.columns.length) {
      const curr = current_columns[0]
      setCompleters(uniq([...completers, ...currentColumnCompleter(curr.columns, curr.schema_name, curr.name)]))
    }
  }, [current_columns])

  useEffect(() => {
    if (editor && completers.length) {
      const arr: any = [];
      editor.completers = arr;
      editor.completers.push(completerFunction(completers));
    }
  }, [completers])

  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK

  const commands: ICommand[] = [
    {
      name: "run",
      bindKey: {
        mac: "Command-Enter",
        win: "Ctrl-Enter"
      },
      exec: () => { setRunning(true) }
    }
  ]

  // console.log('written_sql', written_sql)

  return (
    <Box m="large" height="100%">
      <Heading>SQL</Heading>
      <AceEditor
        height="calc( 100% - 28px )"
        onLoad={(ed) => setEditor(ed)}
        width="100%"
        placeholder=""
        theme="textmate"
        mode={LANG}
        name="sql-editor"
        // onChange={(v, i) => setWrittenSql(v)}
        fontSize={14}
        showPrintMargin={false}
        showGutter={false}
        highlightActiveLine={true}
        value={written_sql && written_sql.partitioned ? written_sql.partitioned : ''}
        // @ts-ignore
        enableBasicAutocompletion={[completerFunction(completers)]}
        enableLiveAutocompletion
        commands={commands}
        setOptions={{
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
        readOnly={true}
        zIndex={0} />
    </Box>
  );
}

const currentColumnCompleter = (columns, schema, table) => {
  return columns.map((c, i) => {
    return {
      value: c.name,
      meta: `${schema}.${table}: (${c.data_type_database})`,
      score: (i)
    }
  })
}

const completerFunction = (completers) => {
  return {
    // @ts-ignore
    getCompletions(editor, session, pos, prefix, callback) {
      callback(null, completers);
    },
  }
}