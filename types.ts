
export interface UsageData {
  name: string;
  usage: number; // in kWh
  carbon: number; // in kg CO2
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export interface Tip {
    tip: string;
    description: string;
}

export interface Challenge {
    title: string;
    description: string;
}

export interface ApplianceAnalysis {
    applianceName: string;
    estimatedConsumption: string;
    tips: string[];
}