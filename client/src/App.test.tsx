import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

// Mock the fetch call to prevent issues during testing
beforeEach(() => {
  // @ts-ignore
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  )
})

afterEach(() => {
  // @ts-ignore
  global.fetch.mockRestore()
})

test('renders without crashing', () => {
  render(<App />)
  // Just test that the app renders without throwing an error
  expect(document.body).toBeTruthy()
})
