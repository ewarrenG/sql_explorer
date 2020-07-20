import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { DialogManager, DialogContent, Tabs, TabList, Tab, TabPanels, TabPanel, useToggle } from '@looker/components';
import { Code } from '@looker/components';
import styled from 'styled-components'
import { LookActionList } from './LookActionList';
import { sortBy, filter } from 'lodash';
import { LoadingSvg } from '../LoadingSvg';

export const SEARCH_FIELDS = "id,title,description,user_id,folder,model"

export function LookTabs( {turnDialogOff}: any) {
  const [all_looks, setAllLooks] = useState()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK

  useEffect(()=>{
    getAllLooks();
  }, [])

  const getAllLooks = async () => {
    const all_lks = await sdk.ok(sdk.all_looks(SEARCH_FIELDS))
    setAllLooks(sortBy(all_lks, ['title','id']))
  }

  if (all_looks) {
    return (
      <Tabs>
        <TabList>
          <Tab>Favorites</Tab>
          <Tab>Shared</Tab>
          <Tab>My Personal</Tab>
          <Tab>Other User Personal</Tab>
          <Tab>Recently Viewed</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <LookActionList 
            turnDialogOff={turnDialogOff} 
            type="favorites"
          />
          </TabPanel>
  
          <TabPanel>
          <LookActionList 
            turnDialogOff={turnDialogOff} 
            type="shared"
            all_={all_looks}
          />
          </TabPanel>
          <TabPanel>
          <LookActionList 
            turnDialogOff={turnDialogOff} 
            type="my_personal"
            all_looks={all_looks}
          />
          </TabPanel>
          <TabPanel>
          <LookActionList 
            turnDialogOff={turnDialogOff} 
            type="other_personal"
            all_looks={all_looks}
          />
          </TabPanel>
          <TabPanel>
          <LookActionList 
            turnDialogOff={turnDialogOff} 
            type="recently_viewed"
          />
          </TabPanel>
        </TabPanels>
      </Tabs>
    );
  } else {
    return <LoadingSvg toggle_loading={true}/>
  }

  
}
