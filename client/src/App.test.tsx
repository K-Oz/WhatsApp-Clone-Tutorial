import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders WhatsApp Clone', () => {
  render(<App />)
  const titleElement = screen.getByText(/WhatsApp Clone/i)
  expect(titleElement).toBeInTheDocument()
})
