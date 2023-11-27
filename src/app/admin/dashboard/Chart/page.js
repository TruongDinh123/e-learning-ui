import dynamic from 'next/dynamic'

const ChartDynamic = dynamic(
  () => import('./statistics-chart'),
  { ssr: false }
)
export default function Chart() {
  return <div><ChartDynamic /></div>
}