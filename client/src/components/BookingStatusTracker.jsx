import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Wrench, 
  ThumbsUp, 
  XCircle 
} from 'lucide-react';

const steps = [
  { key: 'Pending', label: 'Requested', icon: Clock },
  { key: 'Assigned', label: 'Tech Assigned', icon: UserCheck },
  { key: 'Accepted', label: 'Accepted', icon: CheckCircle2 },
  { key: 'In Progress', label: 'In Progress', icon: Wrench },
  { key: 'Completed', label: 'Completed', icon: ThumbsUp }
];

const BookingStatusTracker = ({ currentStatus }) => {
  if (currentStatus === 'Cancelled') {
    return (
      <div className="tracker-cancelled-box">
        <XCircle size={28} color="#dc2626" />
        <div>
          <h4 style={{ margin: 0, color: '#991b1b' }}>Booking Cancelled</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7f1d1d' }}>
            This service booking has been cancelled and is no longer active.
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = steps.findIndex(s => s.key === currentStatus);

  return (
    <div className="status-tracker-container">
      <div className="tracker-steps">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = currentIdx >= idx;
          const isCurrent = currentIdx === idx;

          return (
            <div key={step.key} className={`tracker-step ${isDone ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}>
              <div className="tracker-node">
                <Icon size={18} />
              </div>
              <span className="tracker-label">{step.label}</span>
              {idx < steps.length - 1 && (
                <div className={`tracker-line ${currentIdx > idx ? 'filled' : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingStatusTracker;
