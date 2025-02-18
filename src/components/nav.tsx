import { usePopupStore } from '../store'

export function Nav() {
  const setShowSettings = usePopupStore((state) => state.setShowSettings)
  const onShowSettings = () => setShowSettings(true)
  return (
    <nav style={{ fontSize: '1.5em' }}>
      <a onClick={onShowSettings}>≡</a>
    </nav>
  )
}
