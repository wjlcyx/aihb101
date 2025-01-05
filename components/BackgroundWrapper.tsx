export default function BackgroundWrapper({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            backgroundImage: 'url(/background.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 1,
          }}
        />
        {children}
      </div>
    )
  }