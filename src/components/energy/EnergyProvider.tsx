import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import type { CharacterId } from '../../data/characters';

interface Point {
  x: number;
  y: number;
}

interface EnergyContextValue {
  activeId: CharacterId | null;
  setActiveId: (id: CharacterId | null) => void;
  registerPosition: (id: CharacterId, point: Point) => void;
  getPosition: (id: CharacterId) => Point | undefined;
}

const EnergyContext = createContext<EnergyContextValue | null>(null);

export function EnergyProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<CharacterId | null>(null);
  const positions = useRef(new Map<CharacterId, Point>());

  const registerPosition = useCallback((id: CharacterId, point: Point) => {
    positions.current.set(id, point);
  }, []);
  const getPosition = useCallback((id: CharacterId) => positions.current.get(id), []);

  return (
    <EnergyContext.Provider value={{ activeId, setActiveId, registerPosition, getPosition }}>
      {children}
    </EnergyContext.Provider>
  );
}

export function useEnergy() {
  const ctx = useContext(EnergyContext);
  if (!ctx) throw new Error('useEnergy must be used within EnergyProvider');
  return ctx;
}
