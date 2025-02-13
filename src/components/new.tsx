import { useState } from 'react'
import { Create } from './create'
import { Import } from './import'

export function New() {
  const [tab, setTab] = useState<'create' | 'import'>('create')

  return (
    <>
      <nav>
        <a onClick={() => setTab('create')}>create</a> |{' '}
        <a onClick={() => setTab('import')}>import</a>
      </nav>
      {tab === 'create' ? <Create /> : <Import />}
    </>
  )
}
