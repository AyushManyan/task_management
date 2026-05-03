import { createContext, useContext, useState, useCallback } from "react";

const RefreshContext = createContext({ refresh: false, triggerRefresh: () => {} });

export function RefreshProvider({ children }) {
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = useCallback(() => setRefresh(r => !r), []);
  return (
    <RefreshContext.Provider value={{ refresh, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  return useContext(RefreshContext);
}
