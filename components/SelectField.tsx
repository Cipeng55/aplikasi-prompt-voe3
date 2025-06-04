import React from 'react';
import { SelectOption } from '../types';

interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  value,
  onChange,
  options,
}) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-100"
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-slate-700 text-gray-200">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;