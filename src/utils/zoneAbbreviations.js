// Manual overrides for common timezone abbreviations. Intl's 'short'
// timeZoneName reliably resolves these for US/UK/EU/AU zones, but falls
// back to a raw "GMT+X" style string for most of Asia, Africa, and South
// America - even when a widely-recognized abbreviation exists. This fills
// that gap for commonly-requested zones.
export const KNOWN_ZONE_CODES = {
  'Asia/Kolkata': 'IST',
  'Asia/Tokyo': 'JST',
  'Asia/Shanghai': 'CST',
  'Asia/Hong_Kong': 'HKT',
  'Asia/Singapore': 'SGT',
  'Asia/Seoul': 'KST',
  'Asia/Taipei': 'CST',
  'Asia/Dubai': 'GST',
  'Asia/Karachi': 'PKT',
  'Asia/Dhaka': 'BDT',
  'Asia/Bangkok': 'ICT',
  'Asia/Ho_Chi_Minh': 'ICT',
  'Asia/Jakarta': 'WIB',
  'Asia/Manila': 'PHT',
  'Asia/Kuala_Lumpur': 'MYT',
  'Asia/Kathmandu': 'NPT',
  'Asia/Yangon': 'MMT',
  'Asia/Colombo': 'SLST',
  'Asia/Jerusalem': 'IST',
  'Europe/Moscow': 'MSK',
  'Africa/Cairo': 'EET',
  'Africa/Johannesburg': 'SAST',
  'Africa/Lagos': 'WAT',
  'Africa/Nairobi': 'EAT',
  'Australia/Perth': 'AWST',
  'America/Sao_Paulo': 'BRT',
  'Atlantic/Azores': 'AZOT',
  'Pacific/Honolulu': 'HST',
  'Pacific/Auckland': 'NZST',
};