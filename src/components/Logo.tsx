export default function Logo({ size = 48 }: { size?: number }) {
  return (
    <img
      src="/branding/icon.png"
      alt="Baseline"
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
