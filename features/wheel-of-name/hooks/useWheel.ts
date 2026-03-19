'use client';

import { useState, useCallback } from 'react';
import { WheelState, WheelItem, WheelConfig } from '../types';
import { calculateSpin } from '../utils/wheel';

export function useWheel(config: WheelConfig = { spinDuration: 5000, minSpins: 5 }) {
  const [state, setState] = useState<WheelState>({
    items: [],
    isSpinning: false,
    rotation: 0,
    winner: null,
  });

  const addItem = useCallback((item: WheelItem) => {
    setState(prev => ({ ...prev, items: [...prev.items, item], winner: null }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
      winner: prev.winner?.id === id ? null : prev.winner,
    }));
  }, []);

  const clearItems = useCallback(() => {
    setState(prev => ({ ...prev, items: [], winner: null }));
  }, []);

  const updateItems = useCallback((items: WheelItem[]) => {
    setState(prev => ({ ...prev, items, winner: null }));
  }, []);

  const clearWinner = useCallback(() => {
    setState(prev => ({ ...prev, winner: null }));
  }, []);

  const spin = useCallback(() => {
    if (state.items.length === 0 || state.isSpinning) return;

    const { targetRotation, winner } = calculateSpin(state.items, state.rotation, config);

    setState(prev => ({ ...prev, isSpinning: true, winner: null, rotation: targetRotation }));

    setTimeout(() => {
      setState(prev => ({ ...prev, isSpinning: false, winner }));
    }, config.spinDuration);

  }, [state.items, state.isSpinning, state.rotation, config]);

  return {
    state,
    addItem,
    removeItem,
    clearItems,
    updateItems,
    spin,
    clearWinner,
    config,
  };
}
