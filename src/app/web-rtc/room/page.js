import dynamic from 'next/dynamic'

const RoomRTC = dynamic(
  () => import('./room_rtc'),
  { ssr: false }
)
export default function Room() {
  return <div><RoomRTC /></div>
}