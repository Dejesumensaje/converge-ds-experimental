import * as React from 'react'
import { Textarea } from '../../components/ui'
import { ComponentHeader } from '../helpers'

export function TextareaSection() {
  const [notes,   setNotes]   = React.useState('')
  const [desc,    setDesc]    = React.useState('')
  const [longDesc, setLongDesc] = React.useState('')

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="textarea" title="Textarea" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', maxWidth: 360 }}>
        {/* Default */}
        <Textarea
          label="Notes"
          placeholder="Add a note…"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        {/* With helper text */}
        <Textarea
          label="Description"
          placeholder="Describe the issue…"
          helperText="Max 500 characters."
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />

        {/* Error with message */}
        <Textarea
          label="Feedback"
          value="   "
          onChange={() => {}}
          error="Feedback cannot be blank."
        />

        {/* Disabled */}
        <Textarea
          label="Locked notes"
          value="This field is read-only in the current context."
          onChange={() => {}}
          disabled
        />

        {/* rows=6 */}
        <Textarea
          label="Long description"
          placeholder="Enter a detailed description…"
          rows={6}
          value={longDesc}
          onChange={e => setLongDesc(e.target.value)}
          helperText="Supports plain text only."
        />
      </div>
    </section>
  )
}
