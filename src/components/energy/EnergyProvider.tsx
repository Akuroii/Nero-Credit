import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
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

  // Safety net: if focus leaves the page entirely (tab switch, alt-tab)
  // while a character happens to be "active," the pointerleave that
  // would normally clear it may never fire. Clear on blur/hide so
  // energy can never be left stuck active with no way to end it.
  useEffect(() => {
    const clear = () => setActiveId(null);
    const onVisibility = () => {
      if (document.hidden) clear();
    };
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

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
