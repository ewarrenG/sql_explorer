import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@looker/components';
import { DashboardActionList } from './DashboardActionList';
import { DashboardTabCreateDashboard } from './DashboardTabCreateDashboard';

export function DashboardTabs( {turnDialogOff, is_saving}: any) {
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
        />
        </TabPanel>
        <TabPanel>
        <DashboardActionList 
          turnDialogOff={turnDialogOff} 
          type="my_personal"
        />
        </TabPanel>
        <TabPanel>
        <DashboardActionList 
          turnDialogOff={turnDialogOff} 
          type="other_personal"
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
            is_saving={is_saving}
            turnDialogOff={turnDialogOff}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
  
}
