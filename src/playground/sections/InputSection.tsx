import * as React from 'react'
import { Input } from '../../components/ui'
import { Mail, Lock } from 'lucide-react'
import { ComponentHeader } from '../helpers'

export function InputSection() {
  const [inputVal,       setInputVal]       = React.useState('')
  const [inputPwd,       setInputPwd]       = React.useState('')
  const [inputPwdReveal, setInputPwdReveal] = React.useState('')

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="input" title="Input" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', maxWidth: 360 }}>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          iconLeft={Mail}
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          helperText="We'll never share your email."
        />
        <Input
          label="Password"
          type="password"
          iconLeft={Lock}
          value={inputPwd}
          onChange={e => setInputPwd(e.target.value)}
        />
        <Input
          label="Error state"
          value="invalid@"
          onChange={() => {}}
          error
          errorMessage="Enter a valid email address."
        />
        <Input
          label="Disabled"
          value="Readonly value"
          onChange={() => {}}
          disabled
        />
        <Input
          label="Password"
          type="password"
          iconLeft={Lock}
          revealable
          value={inputPwdReveal}
          onChange={e => setInputPwdReveal(e.target.value)}
          helperText="Min. 8 characters, one uppercase, one number."
        />
      </div>
    </section>
  )
}
