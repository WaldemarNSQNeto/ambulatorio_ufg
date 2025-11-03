import React, { useState, useEffect } from 'react';
import { FormData } from '../types';

interface FormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Form: React.FC<FormProps> = ({ formData, setFormData }) => {
  const [examLimitError, setExamLimitError] = useState(false);

  useEffect(() => {
    if (formData.requestedExams.split('\n').length <= 19) {
        setExamLimitError(false);
    }
  }, [formData.requestedExams]);

  const formatDate = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'requestedExams') {
        const lines = value.split('\n');
        if (lines.length > 19) {
            setExamLimitError(true);
            // Do not update state, blocking the user from adding more lines.
            return;
        }
    }
    
    if (name === 'dob' || name === 'requestDate') {
      const formattedValue = formatDate(value);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value as FormData['sex'] }));
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl space-y-4">
      <h2 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-700 pb-2 mb-4">Informações do Paciente</h2>
      
      <div>
        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do paciente:</label>
        <input type="text" name="patientName" id="patientName" value={formData.patientName} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Nascimento:</label>
          <input type="text" name="dob" id="dob" value={formData.dob} onChange={handleChange} placeholder="DD/MM/AAAA" className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sexo:</label>
            <div className="flex items-center space-x-4 h-10">
                <label className="flex items-center cursor-pointer">
                    <input type="radio" name="sex" value="Masculino" checked={formData.sex === 'Masculino'} onChange={handleRadioChange} className="form-radio h-4 w-4 text-blue-600" />
                    <span className="ml-2 text-sm">Masculino</span>
                </label>
                <label className="flex items-center cursor-pointer">
                    <input type="radio" name="sex" value="Feminino" checked={formData.sex === 'Feminino'} onChange={handleRadioChange} className="form-radio h-4 w-4 text-pink-600" />
                    <span className="ml-2 text-sm">Feminino</span>
                </label>
            </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da mãe:</label>
        <input type="text" name="motherName" id="motherName" value={formData.motherName} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <h2 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-700 pb-2 mb-4 pt-4">Informações de Atendimento</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="recordNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prontuário/Atend.:</label>
            <input type="text" name="recordNumber" id="recordNumber" value={formData.recordNumber} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
           <div>
            <label htmlFor="originSector" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Setor de Origem:</label>
            <input type="text" name="originSector" id="originSector" value={formData.originSector} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="bedNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nº do Leito:</label>
            <input type="text" name="bedNumber" id="bedNumber" value={formData.bedNumber} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
      </div>
      
      <h2 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-700 pb-2 mb-4 pt-4">Detalhes da Solicitação</h2>
      
      <div>
        <label htmlFor="requestedExams" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exames Solicitados:</label>
        <textarea name="requestedExams" id="requestedExams" value={formData.requestedExams} onChange={handleChange} rows={4} className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {examLimitError && <p className="text-red-500 text-xs mt-1">Limite de 18 exames atingido.</p>}
      </div>

      <div>
        <label htmlFor="clinicalIndication" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Indicação Clínica:</label>
        <textarea name="clinicalIndication" id="clinicalIndication" value={formData.clinicalIndication} onChange={handleChange} rows={3} className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

       <div>
          <label htmlFor="requestDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data da Solicitação:</label>
          <input type="text" name="requestDate" id="requestDate" value={formData.requestDate} onChange={handleChange} placeholder="DD/MM/AAAA" className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
    </div>
  );
};

export default Form;