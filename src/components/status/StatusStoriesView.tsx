import React from 'react';
import { StatusUploadUI } from './StatusUploadUI';

export const StatusStoriesView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#0b141a] overflow-hidden p-2 md:p-6 select-none">
      <StatusUploadUI standalone />
    </div>
  );
};
