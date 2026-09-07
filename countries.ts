export interface Country {
  name: string;
  code: string; // ISO 2-letter
  dialCode: string;
  flag: string;
  format?: string;
}

export const COUNTRIES: Country[] = [
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬', format: '802 123 4567' },
  { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪', format: '712 345 678' },
  { name: 'Ghana', code: 'GH', dialCode: '+233', flag: '🇬🇭', format: '24 123 4567' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦', format: '82 123 4567' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬', format: '10 1234 5678' },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', format: '(555) 123-4567' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', format: '7911 123456' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', format: '6 12 34 56 78' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', format: '151 12345678' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', format: '98765 43210' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪', format: '50 123 4567' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷', format: '11 91234-5678' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', format: '(555) 123-4567' },
  { name: 'Rwanda', code: 'RW', dialCode: '+250', flag: '🇷🇼', format: '788 123 456' },
  { name: 'Uganda', code: 'UG', dialCode: '+256', flag: '🇺🇬', format: '772 123 456' },
  { name: 'Tanzania', code: 'TZ', dialCode: '+255', flag: '🇹🇿', format: '754 123 456' },
  { name: 'Senegal', code: 'SN', dialCode: '+221', flag: '🇸🇳', format: '77 123 45 67' },
  { name: 'Ivory Coast', code: 'CI', dialCode: '+225', flag: '🇨🇮', format: '07 12 34 56' },
  { name: 'Ethiopia', code: 'ET', dialCode: '+251', flag: '🇪🇹', format: '91 123 4567' },
  { name: 'Morocco', code: 'MA', dialCode: '+212', flag: '🇲🇦', format: '6 12 34 56 78' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵', format: '90 1234 5678' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', format: '412 345 678' },
];

export const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
];

export const STATUS_PRESETS = [
  'Available',
  'Busy',
  'At work',
  'In a meeting',
  'At school',
  'Only urgent calls',
  'Sleeping',
  'Building decentralized systems',
];
