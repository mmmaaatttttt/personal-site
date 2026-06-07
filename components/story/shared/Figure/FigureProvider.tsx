"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";

interface FigureRegistry {
  register: (id: string) => number;
}

const FigureRegistryContext = createContext<FigureRegistry>({
  register: () => 0,
});

export function FigureProvider({ children }: { children: ReactNode }) {
  const registry = useRef(new Map<string, number>());
  const counter = useRef(0);

  const register = useCallback((id: string) => {
    if (!registry.current.has(id)) {
      registry.current.set(id, ++counter.current);
    }
    return registry.current.get(id)!;
  }, []);

  return (
    <FigureRegistryContext.Provider value={{ register }}>
      {children}
    </FigureRegistryContext.Provider>
  );
}

export function useFigureNumber(id: string): number {
  const { register } = useContext(FigureRegistryContext);
  return register(id);
}
