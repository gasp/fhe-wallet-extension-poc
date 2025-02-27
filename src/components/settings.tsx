import { usePopupStore } from '../store'
import { Delete } from './delete'
import { ExportWallet } from './export'

function State() {
  const state = usePopupStore.getState()
  return <pre>{JSON.stringify(state, null, 2)}</pre>
}

export function Settings() {
  const setShowSettings = usePopupStore((state) => state.setShowSettings)
  const hasWallet = usePopupStore((state) => state.hasWallet)
  const onClose = () => setShowSettings(false)
  return (
    <>
      <nav style={{ fontSize: '1.5em' }}>
        <a onClick={onClose}>×</a>
      </nav>
      <h1>Settings</h1>
      {hasWallet && (
        <>
          <Delete />
          <ExportWallet />
        </>
      )}
      <State />
    </>
  )
}
