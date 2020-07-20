import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@looker/components';
import { DashboardActionList } from './DashboardActionList';
import { sortBy, filter } from 'lodash';
import { LoadingSvg } from '../../LoadingSvg';
import { DashboardTabCreateDashboard } from './DashboardTabCreateDashboard';

export const SEARCH_FIELDS = "id,title,description,user_id,folder"

export function DashboardTabs( {turnDialogOff}: any) {
  const [all_dashboards, setAllDashboards] = useState()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK

  useEffect(()=>{
    getAllDashboards();
  }, [])

  const getAllDashboards = async () => {
    const all_dbs = await sdk.ok(sdk.all_dashboards(SEARCH_FIELDS))
    const no_lookml_dbs = filter(all_dbs, o=>o.folder.name!=='LookML Dashboards')
    setAllDashboards(sortBy(no_lookml_dbs, ['title','id']))
  }

  if (all_dashboards) {
    return (
      <Tabs>
        <TabList>
          <Tab>Favorites</Tab>
          <Tab>Shared</Tab>
          <Tab>My Personal</Tab>
          <Tab>Other User Personal</Tab>
          <Tab>Recently Viewed</Tab>
          <Tab>Create Dashboard</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DashboardActionList 
            turnDialogOff={turnDialogOff} 
            type="favorites"
          />
          </TabPanel>
  
          <TabPanel>
          <DashboardActionList 
            turnDialogOff={turnDialogOff} 
            type="shared"
            all_dashboards={all_dashboards}
          />
          </TabPanel>
          <TabPanel>
          <DashboardActionList 
            turnDialogOff={turnDialogOff} 
            type="my_personal"
            all_dashboards={all_dashboards}
          />
          </TabPanel>
          <TabPanel>
          <DashboardActionList 
            turnDialogOff={turnDialogOff} 
            type="other_personal"
            all_dashboards={all_dashboards}
          />
          </TabPanel>
          <TabPanel>
          <DashboardActionList 
            turnDialogOff={turnDialogOff} 
            type="recently_viewed"
          />
          </TabPanel>
          <TabPanel>
            <DashboardTabCreateDashboard 
              turnDialogOff={turnDialogOff}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    );
  } else {
    return <LoadingSvg toggle_loading={true}/>
  }

  
}
