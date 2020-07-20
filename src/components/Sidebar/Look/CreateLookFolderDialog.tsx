import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Flex, Grid, ActionListItemColumn, ActionListItem, ActionList, doDefaultActionListSort, Chip, Space, Heading, SpaceVertical, FieldText, DialogContent, Button, Spinner, DialogFooter, Text } from '@looker/components';
import styled from 'styled-components'
import AppContext from '../../../AppContext';
import { slice, last } from 'lodash';

const FIELDS = 'id,name,child_count,parent_id,can'
const BODY = {
  deleted: 'false',
  fields: FIELDS,
  sorts: 'name asc'
}
const COLUMNS = [
  {
    id: 'id',
    primaryKey: true,
    title: 'ID',
    type: 'number',
    widthPercent: 20,
    sortDirection: 'asc',
    canSort: true
  },
  {
    id: 'name',
    title: 'Name',
    type: 'string',
    widthPercent: 55,
    canSort: true
  },
  {
    id: 'child_count',
    title: 'Subfolders',
    type: 'number',
    widthPercent: 25,
    canSort: true
  },
]

export function CreateLookFolderDialog({ look_title, setLookTitle, saving, handleLookSubmit }: any) {
  const { user } = useContext(AppContext)
  const { personal_folder_id } = user
  const [columns, setColumns] = useState(COLUMNS)
  const [can_edit, setCanEdit] = useState(false)
  const [data, setData] = useState<any>([])
  const [looks, setLooks] = useState<any>([])
  const [bread_crumbs, setBreadCrumbs] = useState<any>([{ id: '0', name: '...Top', edit_content: false }]);
  const [top, setTop] = useState<any>([])
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK


  useEffect(() => {
    getInitial();
  }, [])

  const getInitial = async () => {
    const shared = sdk.ok(sdk.folder('home', FIELDS))
    const personal = sdk.ok(sdk.folder(personal_folder_id, FIELDS))
    const all_users = sdk.ok(sdk.folder('users', FIELDS))
    const [s, p, u] = await Promise.all([shared, personal, all_users])
    setData([s, p, u])
    setTop([s, p, u])
  }

  const getLooks = async (folder) => {
    const lks = await sdk.ok(sdk.folder_looks(folder, 'title'))
    setLooks(lks)
  }

  const handleChipClick = async (id, i) => {
    var folder
    if (id === '0') {
      folder = top
    } else {
      folder = await sdk.ok(sdk.search_folders({
        ...BODY,
        parent_id: id
      }))
    }
    const {
      columns: sortedColumns,
      data: sortedData,
    } = doDefaultActionListSort(folder, columns, 'title', 'asc')
    setData(sortedData)
    setColumns(sortedColumns)
    setBreadCrumbs(slice(bread_crumbs, 0, i + 1))
    getLooks(id)
  }

  const handleActionClick = async (id, name, edit_content) => {
    const folder = await sdk.ok(sdk.search_folders({
      ...BODY,
      parent_id: id
    }))
    const {
      columns: sortedColumns,
      data: sortedData,
    } = doDefaultActionListSort(folder, columns, 'title', 'asc')
    setData(sortedData)
    setColumns(sortedColumns)
    setBreadCrumbs([...bread_crumbs, { id, name, edit_content }])
    getLooks(id)
  }

  const onSort = (id, sortDirection) => {
    const {
      columns: sortedColumns,
      data: sortedData,
    } = doDefaultActionListSort(data, columns, id, sortDirection)
    setData(sortedData)
    setColumns(sortedColumns)
  }

  const items = data.map((r) => {
    return (
      <ActionListItem
        key={r.id}
        id={r.id}
        onClick={() => handleActionClick(r.id, r.name, r.can.edit_content)}
      >
        <ActionListItemColumn>{r.id}</ActionListItemColumn>
        <ActionListItemColumn>{r.name}</ActionListItemColumn>
        <ActionListItemColumn>{r.child_count}</ActionListItemColumn>
      </ActionListItem>
    )
  })

  const chips = bread_crumbs.map((r, i) => {
    return <StyledChip
      key={r.id}
      disabled={(i === bread_crumbs.length - 1)}
      onClick={() => { handleChipClick(r.id, i) }}
    >
      {r.name}
    </StyledChip>
  })

  const lks: string[] = looks.map(l => l.title)
  const current: any = last(bread_crumbs)
  let field_validation: any = {}

  if (lks.indexOf(look_title) > -1) {
    field_validation = { type: 'error', message: 'Look title already exists in folder' }
  } else if (look_title.length === 0) {
    field_validation = { type: 'error', message: 'Enter a title' }
  }

  return (
    <>
      <DialogContent>
        <Grid columns={1}>
          <SpaceVertical gap="xsmall">
            <Heading fontSize="medium">Select a folder</Heading>
            <Flex>
              <Space gap="xsmall">
                {chips}
              </Space>
            </Flex>
            <ActionList
              onSort={onSort}
              columns={columns}
            >{items}</ActionList>
            <Heading fontSize="medium" >Enter title</Heading>
            <FieldText
              validationMessage={field_validation}
              placeholder="Enter look title"
              value={look_title}
              onChange={(e) => {
                setLookTitle(e.target.value || '')
              }}
            />
          </SpaceVertical>
        </Grid>
      </DialogContent>
      <DialogFooter>
        <Button
          width="100px"
          size="small"
          disabled={saving || (current?.id === '0') || !current.edit_content}
          onClick={()=>{handleLookSubmit(current.id)}}
          >{(saving) ? <Spinner /> : "Submit"}
        </Button>
        {!current.edit_content && (!(current?.id === '0')) && <Text fontSize="xxsmall">Can't create in this folder</Text>}
        { (current?.id === '0') && <Text fontSize="xxsmall">Select a folder</Text>}
      </DialogFooter>

    </>
  );
}

const StyledChip = styled(Chip)`
  cursor: pointer;
`

