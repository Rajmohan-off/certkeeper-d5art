export interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  state: string;
  mobileNumber: string;
  dateOfBirth: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  description: string;
  skills: string[];
  verificationUrl: string;
  s3_url?: string;
  certificateKey?: string;
}
