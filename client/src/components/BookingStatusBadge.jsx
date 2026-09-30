import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  XCircle, 
  RotateCw 
} from 'lucide-react';

const BookingStatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Pending':
        return {
          bg: '#FEF3C7',
          color: '#92400E',
          border: '#FDE68A',
          icon: <Clock size={14} />
        };
      case 'Assigned':
        return {
          bg: '#E0E7FF',
          color: '#3730A3',
          border: '#C7D2FE',
          icon: <UserCheck size={14} />
        };
      case 'Accepted':
        return {
          bg: '#E0F2FE',
          color: '#0369A1',
          border: '#BAE6FD',
          icon: <CheckCircle2 size={14} />
        };
      case 'In Progress':
        return {
          bg: '#F3E8FF',
          color: '#6B21A8',
          border: '#E9D5FF',
          icon: <RotateCw size={14} className="spin-slow" />
        };
      case 'Completed':
        return {
          bg: '#DCFCE7',
          color: '#166534',
          border: '#BBF7D0',
          icon: <CheckCircle2 size={14} />
        };
      case 'Cancelled':
        return {
          bg: '#FEE2E2',
          color: '#991B1B',
          border: '#FECACA',
          icon: <XCircle size={14} />
        };
      default:
        return {
          bg: '#F3F4F6',
          color: '#374151',
          border: '#E5E7EB',
          icon: <AlertCircle size={14} />
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        lineHeight: 1
      }}
    >
      {config.icon}
      {status}
    </span>
  );
};

export default BookingStatusBadge;
