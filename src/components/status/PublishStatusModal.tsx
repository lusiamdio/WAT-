import React from 'react';
import { StatusUploadUI } from './StatusUploadUI';

interface PublishStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'media' | 'text';
}

export const PublishStatusModal: React.FC<PublishStatusModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'media',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in select-none">
      <StatusUploadUI onClose={onClose} initialMode={initialMode} />
    </div>
  );
};
