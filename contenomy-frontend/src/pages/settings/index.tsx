import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import AccountTab from './components/AccountTab';
import PersonalDataTab from './components/PersonalDataTab';
import SecurityTab from './components/SecurityTab';
import NotificationsTab from './components/NotificationsTab';

function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Settings() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="Account" />
        <Tab label="Dati anagrafici" />
        <Tab label="Sicurezza" />
        <Tab label="Notifiche" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <AccountTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PersonalDataTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SecurityTab />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <NotificationsTab />
      </TabPanel>
    </Box>
  );
}