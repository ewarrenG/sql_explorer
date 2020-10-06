import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@looker/components';
import { SqlContext } from '../SqlContext';

export function SqlSidebarRun() {
  const { handleRun, use_model, running, setRunning } = useContext(SqlContext)
  

  const handleClick = async () => {
    handleRun();
  }

  return (
    <Button 
      onClick={handleClick}
      disabled={running}
    >
      {(running)?'Running':'Run'}
    </Button>
  );
}
