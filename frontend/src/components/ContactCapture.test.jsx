import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { fakeFetch } from '../test/fakeFetch'
import ContactCapture from './ContactCapture.jsx'

const CONTACT = '/api/contact/'
const field = () => screen.getByRole('textbox', { name: 'Your email or phone' })
// What each POST to the contact endpoint carried.
const sent = (fetch) => fetch.mock.calls.filter(([url]) => url === CONTACT).map(([, init]) => JSON.parse(init.body))

function accept() {
  return fakeFetch({ [CONTACT]: () => ({ status: 202, body: { ok: true } }) })
}

describe('ContactCapture', () => {
  it('starts as a "Work with me" button that opens straight into a focused field, with no other step', async () => {
    accept()
    render(<ContactCapture source="hero" />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Work with me' }))

    expect(field()).toHaveFocus()
    expect(field()).toHaveAccessibleDescription("I'll get back to you within a day.")
  })

  it('sends an email address on Enter and thanks the visitor in its place', async () => {
    const fetch = accept()
    render(<ContactCapture source="hero" />)
    await userEvent.click(screen.getByRole('button', { name: 'Work with me' }))

    await userEvent.keyboard('  jane@example.com {Enter}')

    expect(await screen.findByRole('status')).toHaveTextContent("Got it. I'll get back to you within a day.")
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(sent(fetch)).toEqual([{ contact: 'jane@example.com', source: 'hero', website: '' }])
    expect(fetch.mock.calls[0][1]).toMatchObject({ method: 'POST', headers: { 'Content-Type': 'application/json' } })
  })

  it('sends a phone number just the same, from the send button', async () => {
    const fetch = accept()
    render(<ContactCapture source="footer" open />)

    await userEvent.type(field(), '(317) 555-0142')
    await userEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Got it.')
    expect(sent(fetch)).toEqual([{ contact: '(317) 555-0142', source: 'footer', website: '' }])
  })

  it('catches something that is neither before anything is sent, then sends once it is fixed', async () => {
    const fetch = accept()
    render(<ContactCapture source="hero" open />)

    await userEvent.type(field(), 'jane@exam{Enter}')

    expect(screen.getByRole('alert')).toHaveTextContent("That doesn't look like an email or a phone number.")
    expect(field()).toHaveAttribute('aria-invalid', 'true')
    expect(sent(fetch)).toEqual([])

    await userEvent.type(field(), 'ple.com{Enter}')
    expect(await screen.findByRole('status')).toHaveTextContent('Got it.')
    expect(sent(fetch)).toEqual([{ contact: 'jane@example.com', source: 'hero', website: '' }])
  })

  it.each([
    [400, { contact: ['Enter an email address or a phone number.'] }, 'Enter an email address or a phone number.'],
    [429, { detail: 'Request was throttled.' }, "That's a few tries in a row. Give it a little while, then try again."],
    [503, { detail: "Couldn't take that right now." }, "Couldn't send that just now. Try again in a moment."],
  ])('explains a %i from the API and keeps what was typed, so the visitor can try again', async (status, body, shown) => {
    fakeFetch({ [CONTACT]: () => ({ status, body }) })
    render(<ContactCapture source="hero" open />)

    await userEvent.type(field(), 'jane@exa_mple.com{Enter}')

    expect(await screen.findByRole('alert')).toHaveTextContent(shown)
    expect(field()).toHaveValue('jane@exa_mple.com')
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled()
  })

  it('says to try again when the API cannot be reached at all', async () => {
    fakeFetch({})
    render(<ContactCapture source="hero" open />)

    await userEvent.type(field(), 'jane@example.com{Enter}')

    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't send that just now. Try again in a moment.")
  })

  it('closes back to the button on Escape when nothing is typed, with focus on the button', async () => {
    accept()
    render(<ContactCapture source="hero" />)
    await userEvent.click(screen.getByRole('button', { name: 'Work with me' }))

    await userEvent.type(field(), 'j{Escape}')
    expect(field()).toBeInTheDocument()

    await userEvent.type(field(), '{Backspace}{Escape}')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Work with me' })).toHaveFocus()
  })

  it('starts open where the visitor already scrolled to it, without stealing focus', () => {
    accept()
    render(<ContactCapture source="footer" open />)

    expect(screen.queryByRole('button', { name: 'Work with me' })).not.toBeInTheDocument()
    expect(field()).not.toHaveFocus()
  })

  it('hides the decoy from people and sends what a bot puts in it', async () => {
    const fetch = accept()
    const { container } = render(<ContactCapture source="hero" open />)
    const decoy = container.querySelector('input[name="website"]')

    expect(decoy).toHaveAttribute('aria-hidden', 'true')
    expect(decoy).toHaveAttribute('tabindex', '-1')
    expect(screen.getAllByRole('textbox')).toEqual([field()])

    await userEvent.type(decoy, 'https://spam.example')
    await userEvent.type(field(), 'bot@spam.example{Enter}')
    await screen.findByRole('status')
    expect(sent(fetch)).toEqual([{ contact: 'bot@spam.example', source: 'hero', website: 'https://spam.example' }])
  })
})
