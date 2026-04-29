interface ScoreBoxProps {
  label: string
  value: number
}

const ScoreBox = ({ label, value }: ScoreBoxProps) => (
  <div
    style={{
      backgroundColor: '#bbada0',
      borderRadius: '6px',
      padding: '8px 16px',
      textAlign: 'center',
      minWidth: '80px',
    }}
  >
    <div style={{ color: '#eee4da', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
      {label}
    </div>
    <div style={{ color: '#f9f6f2', fontSize: '1.4rem', fontWeight: 'bold' }}>{value}</div>
  </div>
)

export default ScoreBox
