export interface TimezoneOption {
  region: string
  value: string
  label: string
}

export const TIMEZONE_COUNTRY_MAP: Record<string, string> = {
  'Australia/Sydney': 'Australia',
  'Australia/Melbourne': 'Australia',
  'Australia/Brisbane': 'Australia',
  'Australia/Perth': 'Australia',
  'Australia/Adelaide': 'Australia',
  'Australia/Darwin': 'Australia',
  'Australia/Hobart': 'Australia',
  'America/Toronto': 'Canada',
  'America/Vancouver': 'Canada',
  'America/Montreal': 'Canada',
  'America/Edmonton': 'Canada',
  'America/Winnipeg': 'Canada',
  'America/Halifax': 'Canada',
  'America/St_Johns': 'Canada',
  'Asia/Kolkata': 'India',
  'Asia/Calcutta': 'India',
  'Europe/London': 'United Kingdom',
  'Europe/Belfast': 'United Kingdom',
  'Europe/Jersey': 'United Kingdom',
  'Europe/Guernsey': 'United Kingdom',
  'Europe/Isle_of_Man': 'United Kingdom',
  'America/New_York': 'United States',
  'America/Chicago': 'United States',
  'America/Denver': 'United States',
  'America/Los_Angeles': 'United States',
  'America/Phoenix': 'United States',
  'America/Detroit': 'United States',
  'America/Indianapolis': 'United States',
  'America/Anchorage': 'United States',
  'Pacific/Honolulu': 'United States',
  'Europe/Rome': 'Italy',
  'Europe/Vatican': 'Italy',
  'Europe/San_Marino': 'Italy',
  'America/Sao_Paulo': 'Brazil',
  'America/Rio_Branco': 'Brazil',
  'America/Fortaleza': 'Brazil',
  'America/Belem': 'Brazil',
  'America/Manaus': 'Brazil',
  'America/Recife': 'Brazil',
  'America/Cuiaba': 'Brazil',
  'Europe/Copenhagen': 'Denmark',
  'America/Danmarkshavn': 'Denmark',
  'Atlantic/Faroe': 'Denmark',
  'America/Scoresbysund': 'Denmark',
  'Europe/Oslo': 'Norway',
  'Arctic/Longyearbyen': 'Norway',
  'Europe/Berlin': 'Germany',
  'Europe/Frankfurt': 'Germany',
  'Europe/Busingen': 'Germany',
  'Europe/Paris': 'France',
  'Europe/Monaco': 'France',
  'Europe/Madrid': 'Spain',
  'Atlantic/Canary': 'Spain',
  'Europe/Ceuta': 'Spain',
  'Europe/Helsinki': 'Finland',
  'Europe/Mariehamn': 'Finland',
  'Europe/Stockholm': 'Sweden',
  'Pacific/Auckland': 'New Zealand',
  'Pacific/Chatham': 'New Zealand',
  'Europe/Dublin': 'Ireland',
  'Europe/Amsterdam': 'Netherlands',
}

export const COUNTRIES: string[] = [
  'Australia',
  'Brazil',
  'Canada',
  'Denmark',
  'Finland',
  'France',
  'Germany',
  'India',
  'Ireland',
  'Italy',
  'Netherlands',
  'New Zealand',
  'Norway',
  'Spain',
  'Sweden',
  'United Kingdom',
  'United States',
  'Other',
]

export function getCountryFromTimezone(tz: string): string {
  return TIMEZONE_COUNTRY_MAP[tz] || 'Other'
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { region: 'US', value: 'US/Pacific', label: 'UTC -08:00 Pacific Time' },
  { region: 'US', value: 'US/Mountain', label: 'UTC -07:00 Mountain Time' },
  { region: 'US', value: 'US/Central', label: 'UTC -06:00 Central Time' },
  { region: 'US', value: 'US/East-Indiana', label: 'UTC -05:00 Eastern Time' },
  { region: 'Europe', value: 'Europe/Belfast', label: 'UTC +00:00 Dublin, London, Lisbon' },
  { region: 'Europe', value: 'Europe/Amsterdam', label: 'UTC +01:00 Central European Time' },
  { region: 'Europe', value: 'Europe/Athens', label: 'UTC +02:00 Eastern European Time' },
  { region: 'Europe', value: 'Europe/Istanbul', label: 'UTC +03:00 Istanbul, Minsk, Moscow' },
  { region: 'Canada', value: 'Canada/Pacific', label: 'UTC -08:00 Pacific' },
  { region: 'Canada', value: 'Canada/Mountain', label: 'UTC -07:00 Mountain' },
  { region: 'Canada', value: 'Canada/Central', label: 'UTC -06:00 Central' },
  { region: 'Canada', value: 'Canada/Eastern', label: 'UTC -05:00 Eastern' },
  { region: 'Canada', value: 'Canada/Atlantic', label: 'UTC -04:00 Atlantic Time' },
  { region: 'Canada', value: 'Canada/Newfoundland', label: 'UTC -03:30 Newfoundland' },
  { region: 'Africa', value: 'Africa/Abidjan', label: 'UTC +00:00 Greenwich Mean Time' },
  { region: 'Africa', value: 'Africa/Algiers', label: 'UTC +01:00 Central European Time' },
  { region: 'Africa', value: 'Africa/Casablanca', label: 'UTC +01:00 Casablanca' },
  { region: 'Africa', value: 'Africa/Blantyre', label: 'UTC +02:00 South Africa Time' },
  { region: 'Africa', value: 'Africa/Cairo', label: 'UTC +02:00 Cairo' },
  { region: 'Africa', value: 'Africa/Addis_Ababa', label: 'UTC +03:00 East Africa Time' },
  { region: 'America', value: 'America/Adak', label: 'UTC -10:00 Adak' },
  { region: 'America', value: 'America/Anchorage', label: 'UTC -09:00 Anchorage, Juneau' },
  { region: 'America', value: 'America/Los_Angeles', label: 'UTC -08:00 Los Angeles' },
  { region: 'America', value: 'America/Denver', label: 'UTC -07:00 Denver' },
  { region: 'America', value: 'America/Chicago', label: 'UTC -06:00 Chicago' },
  { region: 'America', value: 'America/New_York', label: 'UTC -05:00 New York' },
  { region: 'America', value: 'America/Havana', label: 'UTC -05:00 Havana' },
  { region: 'America', value: 'America/Halifax', label: 'UTC -04:00 Halifax, Moncton' },
  { region: 'America', value: 'America/Araguaina', label: 'UTC -03:00 Argentina, Brazil' },
  { region: 'America', value: 'America/Santiago', label: 'UTC -03:00 Santiago' },
  { region: 'America', value: 'America/St_Johns', label: 'UTC -03:30 St Johns' },
  { region: 'Asia', value: 'Asia/Jerusalem', label: 'UTC +02:00 Jerusalem, Tel Aviv' },
  { region: 'Asia', value: 'Asia/Aden', label: 'UTC +03:00 Baghdad, Bahrain, Qatar' },
  { region: 'Asia', value: 'Asia/Tehran', label: 'UTC +03:30 Tehran' },
  { region: 'Asia', value: 'Asia/Baku', label: 'UTC +04:00 Baku, Dubai, Muscat' },
  { region: 'Asia', value: 'Asia/Kabul', label: 'UTC +04:30 Kabul' },
  { region: 'Asia', value: 'Asia/Almaty', label: 'UTC +05:00 Almaty, Ashgabat' },
  { region: 'Asia', value: 'Asia/Calcutta', label: 'UTC +05:30 New Delhi, Mumbai, Calcutta' },
  { region: 'Asia', value: 'Asia/Kathmandu', label: 'UTC +05:45 Kathmandu' },
  { region: 'Asia', value: 'Asia/Dhaka', label: 'UTC +06:00 Dhaka' },
  { region: 'Asia', value: 'Asia/Rangoon', label: 'UTC +06:30 Yangon' },
  { region: 'Asia', value: 'Asia/Bangkok', label: 'UTC +07:00 Indochina Time' },
  { region: 'Asia', value: 'Asia/Singapore', label: 'UTC +08:00 China, Hong Kong, Singapore' },
  { region: 'Asia', value: 'Asia/Tokyo', label: 'UTC +09:00 Seoul, Tokyo' },
  { region: 'Australia', value: 'Australia/Perth', label: 'UTC +08:00 Perth' },
  { region: 'Australia', value: 'Australia/Darwin', label: 'UTC +09:30 Darwin' },
  { region: 'Australia', value: 'Australia/Adelaide', label: 'UTC +10:30 Adelaide' },
  { region: 'Australia', value: 'Australia/Brisbane', label: 'UTC +10:00 Brisbane' },
  { region: 'Australia', value: 'Australia/Sydney', label: 'UTC +11:00 Sydney, Melbourne' },
  { region: 'Pacific', value: 'Pacific/Honolulu', label: 'UTC -10:00 Honolulu' },
  { region: 'Pacific', value: 'Pacific/Auckland', label: 'UTC +13:00 Auckland' },
  { region: 'Pacific', value: 'Pacific/Fiji', label: 'UTC +12:00 Fiji' },
]

export function getUserTimezone(): string {
  return Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone || 'UTC'
}

export function getBestMatchTimezone(tz: string): TimezoneOption {
  const direct = TIMEZONE_OPTIONS.find(t => t.value === tz)
  if (direct) return direct
  const aliases: Record<string, string> = {
    'Asia/Kolkata': 'Asia/Calcutta',
    'America/Indianapolis': 'America/New_York',
    'Europe/London': 'Europe/Belfast',
  }
  const alias = aliases[tz]
  if (alias) {
    const match = TIMEZONE_OPTIONS.find(t => t.value === alias)
    if (match) return match
  }
  const fallback = TIMEZONE_OPTIONS.find(t => t.value === 'US/East-Indiana') || TIMEZONE_OPTIONS[0]
  return fallback as TimezoneOption
}
