const statusConfig = {
  PENDING: ['Pendiente', 'text-bg-warning'],
  APPROVED: ['Aprobada', 'text-bg-success'],
  REJECTED: ['Rechazada', 'text-bg-danger'],
}

function StatusBadge({ status }) {
  const [label, color] = statusConfig[status] || [status, 'text-bg-secondary']
  return <span className={`badge ${color}`}>{label}</span>
}

export default StatusBadge
