import { useState, useCallback } from "react";

function useToggle(initial = false) {
  const [checked, setChecked] = useState(initial);
  const toggle = useCallback(() => setChecked(oldChecked => !oldChecked), []);
  return [checked, toggle];
}

export default useToggle;
