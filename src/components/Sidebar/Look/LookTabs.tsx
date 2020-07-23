import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, } from '@looker/components';
import { LookActionList } from './LookActionList';

export const SEARCH_FIELDS = "id,title,description,user_id,folder,model"

export function LookTabs( {turnDialogOff}: any) {


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
        />
        </TabPanel>
        <TabPanel>
        <LookActionList 
          turnDialogOff={turnDialogOff} 
          type="my_personal"
        />
        </TabPanel>
        <TabPanel>
        <LookActionList 
          turnDialogOff={turnDialogOff} 
          type="other_personal"
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
}
