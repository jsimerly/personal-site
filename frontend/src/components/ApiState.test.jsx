import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ApiState from './ApiState.jsx'

const renderItems = (items) => <p>{items.join(', ')}</p>

function renderState(state) {
  return render(<ApiState state={{ data: null, error: null, loading: false, slow: false, ...state }}>{renderItems}</ApiState>)
}

describe('ApiState', () => {
  it('says it is loading while a request is out', () => {
    renderState({ loading: true })

    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('tells the visitor the server is waking up once a request runs slow', () => {
    renderState({ loading: true, slow: true })

    expect(screen.getByText(/^Waking up the server/)).toBeInTheDocument()
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
  })

  it('shows a plain alert instead of the content when the request fails', () => {
    renderState({ error: new Error('boom') })

    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't load this. Try again in a moment.")
    expect(screen.queryByText(/boom/)).not.toBeInTheDocument()
  })

  it('hands the loaded data to its children', () => {
    renderState({ data: ['a', 'b'] })

    expect(screen.getByText('a, b')).toBeInTheDocument()
  })
})
