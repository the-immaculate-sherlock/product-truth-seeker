
import React from 'react';
import { Shield, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type AuthenticationStatus = 'verified' | 'unverified' | 'pending';

interface AuthenticationBadgeProps {
  status: AuthenticationStatus;
  className?: string;
}

const AuthenticationBadge: React.FC<AuthenticationBadgeProps> = ({ status, className }) => {
  const iconMap = {
    verified: <Shield className="h-6 w-6" />,
    unverified: <AlertCircle className="h-6 w-6" />,
    pending: <Clock className="h-6 w-6" />
  };

  const textMap = {
    verified: 'Authentic Product',
    unverified: 'Counterfeit Alert',
    pending: 'Verification Pending'
  };

  const colorMap = {
    verified: 'bg-green-100 text-green-700 border-green-200',
    unverified: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  };

  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 rounded-full border',
      colorMap[status],
      className
    )}>
      {iconMap[status]}
      <span className="font-medium">{textMap[status]}</span>
    </div>
  );
};

export default AuthenticationBadge;
