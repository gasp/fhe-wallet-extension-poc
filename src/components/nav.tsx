import { usePopupStore } from '../store'

export function Nav() {
  const setShowSettings = usePopupStore((state) => state.setShowSettings)
  const onShowSettings = () => setShowSettings(true)
  return (
    <nav>
      <a onClick={onShowSettings}>≡</a>
    </nav>
  )
}
