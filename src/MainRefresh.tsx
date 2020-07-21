import { useState } from 'react';

function refresh(initialState = 0) {
  const [state, setState] = useState(initialState);
  const increment = () => setState(state => state + 1);
  return [state, increment];
}

export default refresh;