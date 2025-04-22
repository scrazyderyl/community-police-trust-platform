// hooks/useHereMaps.test.js
import { renderHook, act } from '@testing-library/react';
import { useHereMaps } from './useHereMaps';

// Mock the findMunicipalityByAddress function
jest.mock('@/services/GeoService', () => ({
  findMunicipalityByAddress: jest.fn().mockResolvedValue([
    { name: 'Test Municipality', filing_info: 'Test filing info' }
  ])
}));

describe('useHereMaps', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useHereMaps());
    
    expect(result.current.isMapReady).toBe(false);
    expect(result.current.mapRef).toBeDefined();
    expect(typeof result.current.handleSearch).toBe('function');
    expect(typeof result.current.locateUser).toBe('function');
  });

  it('should mark scripts as loaded when handleScriptLoad is called', () => {
    const { result } = renderHook(() => useHereMaps());
    
    act(() => {
      result.current.handleScriptLoad('core');
    });
    
    expect(result.current.scriptsLoaded.core).toBe(true);
  });
});