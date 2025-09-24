import React, { useState, useRef } from 'react';
import { analyzeApplianceImage } from '../services/geminiService';
import type { ApplianceAnalysis } from '../types';
import { CameraIcon, BoltIcon, LightbulbIcon } from './IconComponents';

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            }
        };
        reader.readAsDataURL(file);
    });
    return {
        base64: await base64EncodedDataPromise,
        mimeType: file.type,
    };
};

export const ApplianceAnalyzer: React.FC = () => {
    const [analysis, setAnalysis] = useState<ApplianceAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImagePreview(URL.createObjectURL(file));
        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const { base64, mimeType } = await fileToGenerativePart(file);
            const result = await analyzeApplianceImage(base64, mimeType);
            setAnalysis(result);
        } catch (err) {
            console.error(err);
            setError("Sorry, I couldn't analyze that image. Please try another one.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const triggerFileSelect = () => fileInputRef.current?.click();

    const ResultDisplay = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {imagePreview && (
                 <img src={imagePreview} alt="Appliance preview" className="rounded-lg object-cover w-full h-64 shadow-md border-2 border-steel"/>
            )}
            {analysis && (
            <div className="space-y-4">
                <h4 className="text-2xl font-bold text-text-primary">{analysis.applianceName}</h4>
                <div className="flex items-center gap-3 bg-steel-dark/50 p-3 rounded-lg">
                    <BoltIcon className="w-6 h-6 text-cyan-glow"/>
                    <div>
                        <p className="font-semibold text-cyan-glow">Est. Monthly Consumption</p>
                        <p className="text-text-primary">{analysis.estimatedConsumption}</p>
                    </div>
                </div>
                <div>
                    <h5 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                        <LightbulbIcon className="w-5 h-5 text-cyan-glow"/>
                        Energy-Saving Tips
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary">
                        {analysis.tips.map((tip, index) => <li key={index}>{tip}</li>)}
                    </ul>
                </div>
                 <button onClick={() => {
                     setAnalysis(null);
                     setImagePreview(null);
                     setError(null);
                     if(fileInputRef.current) fileInputRef.current.value = "";
                 }} className="w-full mt-4 px-4 py-2 font-semibold text-steel-dark bg-gradient-to-br from-cyan-glow to-cyan-dark rounded-full hover:shadow-cyan-glow transition-all">Analyze Another</button>
            </div>
            )}
        </div>
    );
    
    const UploadPrompt = () => (
         <div className="text-center">
            <button onClick={triggerFileSelect} className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-steel rounded-lg hover:border-cyan-glow/80 transition-colors animate-pulse-glow">
                <CameraIcon className="w-16 h-16 text-steel-light group-hover:text-cyan-glow transition-colors mb-4"/>
                <p className="text-lg font-semibold text-text-primary">Snap & Save</p>
                <p className="text-text-secondary">Click to upload or take a photo</p>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                capture="environment"
                className="hidden"
            />
        </div>
    );
    
    const Loader = () => (
         <div className="flex flex-col items-center justify-center w-full h-64">
            <div className="w-12 h-12 border-4 border-cyan-glow border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-text-secondary">Analyzing your appliance...</p>
        </div>
    );

    return (
        <div className="bg-surface-card rounded-xl shadow-card border border-steel p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Appliance Analyzer</h2>
            
            {error && <div className="text-center p-3 my-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}

            {isLoading ? <Loader/> : (analysis ? <ResultDisplay/> : <UploadPrompt/>)}
        </div>
    );
};