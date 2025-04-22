// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock the HERE Maps global object
global.H = {
  Map: jest.fn().mockImplementation(() => ({
    addEventListener: jest.fn(),
    getViewPort: jest.fn().mockReturnValue({ resize: jest.fn() })
  })),
  service: {
    Platform: jest.fn().mockImplementation(() => ({
      createDefaultLayers: jest.fn().mockReturnValue({
        vector: { normal: { map: {} } }
      }),
      getSearchService: jest.fn()
    }))
  },
  mapevents: {
    MapEvents: jest.fn(),
    Behavior: jest.fn()
  },
  ui: {
    UI: {
      createDefault: jest.fn().mockReturnValue({
        getBubbles: jest.fn().mockReturnValue([]),
        addBubble: jest.fn(),
        removeBubble: jest.fn()
      })
    },
    InfoBubble: jest.fn()
  }
};