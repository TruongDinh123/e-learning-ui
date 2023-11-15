import dynamic from 'next/dynamic'

const LobbyRTC = dynamic(
  () => import('./lobby_rtc'),
  { ssr: false }
)
export default function Room() {
  return <div><LobbyRTC /></div>
}