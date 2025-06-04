import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea';
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  rows = 3,
}) => {
  const commonProps = {
    id,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    placeholder,
    className: "mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-100 placeholder-gray-400",
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea {...commonProps} rows={rows} />
      ) : (
        <input type="text" {...commonProps} />
      )}
    </div>
  );
};

export default FormField;