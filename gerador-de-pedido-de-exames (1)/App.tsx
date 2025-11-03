import React, { useState, useEffect } from 'react';
import { FormData, RequestDetails } from './types';
import Form from './components/Form';
import Preview from './components/Preview';

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

const App: React.FC = () => {
    const getTodayDate = (): string => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Sample data kept for reference or potential future features
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const initialFormData: FormData = {
        patientName: 'João da Silva',
        dob: '15/05/1985',
        sex: 'Masculino',
        motherName: 'Maria da Silva',
        recordNumber: '1234567',
        originSector: 'Clínica Médica',
        bedNumber: '201-A',
        requestedExams: 'Hemograma completo\nTSH e T4 Livre\nGlicemia de Jejum',
        clinicalIndication: 'Avaliação de rotina, paciente com histórico de hipotireoidismo.',
        requestDate: getTodayDate(),
    };
    
    const emptyFormData: FormData = {
        patientName: '',
        dob: '',
        sex: '',
        motherName: '',
        recordNumber: '',
        originSector: '',
        bedNumber: '',
        requestedExams: '',
        clinicalIndication: '',
        requestDate: getTodayDate(),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const initialSecondRequestData: RequestDetails = {
        requestedExams: 'Ureia e Creatinina\nPerfil Lipídico Completo',
        clinicalIndication: 'Monitoramento da função renal e risco cardiovascular.',
        requestDate: getTodayDate(),
    };

    const emptySecondRequestData: RequestDetails = {
        requestedExams: '',
        clinicalIndication: '',
        requestDate: getTodayDate(),
    };

    const [formData, setFormData] = useState<FormData>(emptyFormData);
    const [secondRequestData, setSecondRequestData] = useState<RequestDetails>(emptySecondRequestData);
    const [showSecondCopy, setShowSecondCopy] = useState<boolean>(false);
    const [isSecondRequestActive, setIsSecondRequestActive] = useState<boolean>(false);
    const [secondExamLimitError, setSecondExamLimitError] = useState(false);

    useEffect(() => {
        if (isSecondRequestActive) {
            setShowSecondCopy(false);
        }
    }, [isSecondRequestActive]);
    
    useEffect(() => {
        if (secondRequestData.requestedExams.split('\n').length <= 19) {
            setSecondExamLimitError(false);
        }
    }, [secondRequestData.requestedExams]);

    const handlePrint = (): void => {
        window.print();
    };

    const handleClearForm = (): void => {
        setFormData(emptyFormData);
        setSecondRequestData(emptySecondRequestData);
        setIsSecondRequestActive(false);
        setShowSecondCopy(false);
    };
    
    const handleSecondRequestChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'requestedExams') {
            const lines = value.split('\n');
            if (lines.length > 19) {
                setSecondExamLimitError(true);
                return;
            }
        }

        if (name === 'requestDate') {
          const formattedValue = formatDate(value);
          setSecondRequestData(prev => ({...prev, [name]: formattedValue}));
        } else {
          setSecondRequestData(prev => ({...prev, [name]: value}));
        }
    }

    return (
        <div className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen font-sans antialiased">
            <header className="bg-white dark:bg-gray-900 p-4 shadow-md print:hidden sticky top-0 z-10">
                <div className="container mx-auto">
                    <h1 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">Gerador de Pedido de Exames</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Preencha o formulário para gerar o documento para impressão.</p>
                </div>
            </header>

            <main className="container mx-auto flex flex-col lg:flex-row p-4 gap-6">
                <div className="lg:w-1/3 xl:w-1/4 print:hidden">
                    <div className="sticky top-24">
                        <Form formData={formData} setFormData={setFormData} />

                        {isSecondRequestActive && (
                             <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl space-y-4 mt-6">
                                <h2 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-700 pb-2 mb-4">2º Pedido - Detalhes da Solicitação</h2>
                                <div>
                                    <label htmlFor="requestedExams2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exames Solicitados:</label>
                                    <textarea name="requestedExams" id="requestedExams2" value={secondRequestData.requestedExams} onChange={handleSecondRequestChange} rows={4} className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {secondExamLimitError && <p className="text-red-500 text-xs mt-1">Limite de 18 exames atingido.</p>}
                                </div>
                                <div>
                                    <label htmlFor="clinicalIndication2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Indicação Clínica:</label>
                                    <textarea name="clinicalIndication" id="clinicalIndication2" value={secondRequestData.clinicalIndication} onChange={handleSecondRequestChange} rows={3} className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="requestDate2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data da Solicitação:</label>
                                    <input type="text" name="requestDate" id="requestDate2" value={secondRequestData.requestDate} onChange={handleSecondRequestChange} placeholder="DD/MM/AAAA" className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                             </div>
                        )}

                        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-xl mt-6 space-y-3">
                            <label htmlFor="second-request-checkbox" className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id="second-request-checkbox"
                                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    checked={isSecondRequestActive}
                                    onChange={() => setIsSecondRequestActive(!isSecondRequestActive)}
                                />
                                <span className="ml-3 font-medium text-gray-700 dark:text-gray-300">Adicionar 2º Pedido (diferente)</span>
                            </label>

                            <label htmlFor="two-copies-checkbox" className={`flex items-center transition-opacity ${isSecondRequestActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                <input 
                                    type="checkbox" 
                                    id="two-copies-checkbox"
                                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={showSecondCopy}
                                    onChange={() => setShowSecondCopy(!showSecondCopy)}
                                    disabled={isSecondRequestActive}
                                />
                                <span className="ml-3 font-medium text-gray-700 dark:text-gray-300">Imprimir em duas vias (idênticas)</span>
                            </label>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-6">
                            <button
                                onClick={handlePrint}
                                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Imprimir Pedido
                            </button>
                            <button
                                onClick={handleClearForm}
                                title="Limpar Formulário"
                                aria-label="Limpar Formulário"
                                className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white font-bold p-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="preview-container lg:w-2/3 xl:w-3/4 bg-gray-400 dark:bg-gray-700 p-4 sm:p-6 rounded-lg overflow-x-auto">
                    <Preview 
                        formData={formData} 
                        showSecondCopy={showSecondCopy}
                        isSecondRequestActive={isSecondRequestActive}
                        secondRequestData={secondRequestData}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;