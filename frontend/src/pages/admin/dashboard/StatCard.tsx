import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor }) => (
  <div className={`relative bg-gradient-to-br ${bgColor} rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center hover:scale-[1.03] transition-transform duration-200`}>
    <div className={`flex items-center justify-center mb-2`}>{icon}</div>
    <div className={`text-4xl font-extrabold ${color} mb-2`}>{value}</div>
    <div className="text-md font-bold text-slate-800 mb-1">{title}</div>
  </div>
);

export default StatCard;
