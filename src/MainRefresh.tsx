import { useState } from 'react';

function refresh(initialState = 0) {
  const [state, setState] = useState(initialState);
  const increment = () => setState(state => state + 1);
  const reset = () => {setState(0)};
  return [state, reset, increment];
}

export default refresh;