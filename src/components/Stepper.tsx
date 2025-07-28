interface IStepperProps {
    currentStep: number;
}
export const Stepper = ({ currentStep }: IStepperProps) => {
    const steps = [
        'Firmando electrónicamente',
        'Enviando al SRI',
        'Esperando validación'
    ];

    return (
        <div className="flex justify-between items-center my-8">
            {steps.map((label, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold 
            ${index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        {index + 1}
                    </div>
                    <div className="mt-2 text-center text-sm">
                        {label}
                    </div>
                </div>
            ))}
        </div>
    );
};
