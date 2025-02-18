import { useState } from 'react'
import { usePopupStore } from '../store'
import { Create } from './create'
import { Import } from './import'

export function New() {
  const [tab, setTab] = useState<'create' | 'import'>('create')
  const setShowSettings = usePopupStore((state) => state.setShowSettings)
  const onShowSettings = () => setShowSettings(true)
  return (
    <>
      <nav style={{ fontSize: '1.5em' }}>
        <a onClick={onShowSettings}>≡</a> |{' '}
        <a onClick={() => setTab('create')}>create</a> |{' '}
        <a onClick={() => setTab('import')}>import</a>
      </nav>
      {tab === 'create' ? <Create /> : <Import />}
    </>
  )
}
