export interface FormData {
  fullName: string;
  gender: string;
  birthDate: string;
  subscribeNews: boolean;
  plan: 'basic' | 'intermediate' | 'advanced' | '';
  pin: string;
  comments: string;
}

export interface FormErrors {
  fullName?: string;
  gender?: string;
  birthDate?: string;
  plan?: string;
  pin?: string;
}

export interface PreviewImage {
  id: string;
  name: string;
  dataUrl: string;
  timestamp: Date;
}

export interface FormElementStyle {
  width?: string;
  height?: string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: string;
}

export interface FormElementConfig {
  id: string;
  type: 'text' | 'select' | 'date' | 'checkbox' | 'radio' | 'password' | 'textarea';
  label: string;
  placeholder?: string;
  options?: string[];
  selectedOption?: string;
  format?: string;
  style: FormElementStyle;
}