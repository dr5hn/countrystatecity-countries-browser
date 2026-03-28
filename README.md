# @countrystatecity/countries-browser

Browser-native countries, states, and cities data with jsDelivr CDN and lazy loading. Same API as the server package — works in React, Vue, Svelte, Vite, and any browser environment.

## Installation

```bash
npm install @countrystatecity/countries-browser
```

## Quick Start

```typescript
import { getCountries, getStatesOfCountry, getCitiesOfState } from '@countrystatecity/countries-browser';

// Load all countries (~30KB gzipped)
const countries = await getCountries();

// Load states for a country (on-demand)
const states = await getStatesOfCountry('US');

// Load cities for a state (on-demand)
const cities = await getCitiesOfState('US', 'CA');
```

## Why This Package?

The server package (`@countrystatecity/countries`) requires Node.js file system access and cannot run in browsers. This package provides the **same API** using `fetch()` and jsDelivr CDN instead.

| | `countries` (server) | `countries-browser` |
|---|---|---|
| Environment | Node.js only | Browser + Node.js |
| Data loading | `fs.readFileSync` | `fetch()` from CDN |
| Initial bundle | ~5KB | ~5KB |
| Configuration | None needed | Optional CDN override |
| Lazy loading | Yes | Yes |

## API Reference

### Data Functions

```typescript
getCountries(): Promise<ICountry[]>
getCountryByCode(code: string): Promise<ICountryMeta | null>
getStatesOfCountry(countryCode: string): Promise<IState[]>
getStateByCode(countryCode: string, stateCode: string): Promise<IState | null>
getCitiesOfState(countryCode: string, stateCode: string): Promise<ICity[]>
getCityById(countryCode: string, stateCode: string, cityId: number): Promise<ICity | null>
getAllCitiesOfCountry(countryCode: string): Promise<ICity[]>
getAllCitiesInWorld(): Promise<ICity[]>
```

### Utility Functions

```typescript
isValidCountryCode(code: string): Promise<boolean>
isValidStateCode(countryCode: string, stateCode: string): Promise<boolean>
searchCitiesByName(countryCode: string, stateCode: string, term: string): Promise<ICity[]>
getCountryNameByCode(code: string): Promise<string | null>
getStateNameByCode(countryCode: string, stateCode: string): Promise<string | null>
getTimezoneForCity(countryCode: string, stateCode: string, cityName: string): Promise<string | null>
getCountryTimezones(countryCode: string): Promise<string[]>
```

### Configuration

```typescript
import { configure, resetConfiguration, clearCache } from '@countrystatecity/countries-browser';

// Self-host data instead of jsDelivr
configure({
  baseURL: 'https://my-cdn.com/data',
  timeout: 10000,
  cacheSize: 100,
});

// Reset to defaults
resetConfiguration();

// Clear in-memory cache
clearCache();
```

## React Example

```tsx
import { useState, useEffect } from 'react';
import { getCountries, getStatesOfCountry, getCitiesOfState } from '@countrystatecity/countries-browser';
import type { ICountry, IState, ICity } from '@countrystatecity/countries-browser';

export function LocationSelector() {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  useEffect(() => {
    if (!selectedCountry) { setStates([]); return; }
    getStatesOfCountry(selectedCountry).then(setStates);
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || !selectedState) { setCities([]); return; }
    getCitiesOfState(selectedCountry, selectedState).then(setCities);
  }, [selectedCountry, selectedState]);

  return (
    <div>
      <select value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setSelectedState(''); }}>
        <option value="">Select Country</option>
        {countries.map(c => <option key={c.iso2} value={c.iso2}>{c.name}</option>)}
      </select>
      <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} disabled={!selectedCountry}>
        <option value="">Select State</option>
        {states.map(s => <option key={s.iso2} value={s.iso2}>{s.name}</option>)}
      </select>
      <select disabled={!selectedState}>
        <option value="">Select City</option>
        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
    </div>
  );
}
```

## Error Handling

```typescript
import { getCountries, NetworkError } from '@countrystatecity/countries-browser';

try {
  const countries = await getCountries();
} catch (error) {
  if (error instanceof NetworkError) {
    console.error(`CDN request failed: ${error.statusCode} at ${error.url}`);
  }
}
```

Invalid codes return `null` or `[]` gracefully (no exceptions).

## Data

- 250 countries
- 5,000+ states/provinces
- 150,000+ cities
- Translations in 18+ languages
- Timezone data per location

Data sourced from [countries-states-cities-database](https://github.com/dr5hn/countries-states-cities-database) and updated weekly via automated PR.

## License

[ODbL-1.0](LICENSE)
