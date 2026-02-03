import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

declare global {
  interface Window {
    google?: typeof google;
  }
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

interface AddressComponents {
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

interface AddressAutocompleteProps {
  value: AddressComponents;
  onChange: (address: AddressComponents) => void;
  placeholder?: string;
  className?: string;
  inputStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}

// Load Google Maps script
let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks: (() => void)[] = [];

function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve) => {
    if (scriptLoaded && window.google) {
      resolve();
      return;
    }

    loadCallbacks.push(() => resolve());

    if (scriptLoading) {
      return;
    }

    scriptLoading = true;
    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=places`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      scriptLoaded = true;
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      scriptLoading = false;
    };
    document.head.appendChild(script);
  });
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Start typing your address...",
  inputStyle,
  labelStyle,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState(value.address || "");

  useEffect(() => {
    let mounted = true;

    async function initAutocomplete() {
      await loadGoogleMapsScript();
      
      if (!mounted || !inputRef.current || !window.google) {
        return;
      }

      setIsLoading(false);

      // Create autocomplete instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "us" },
          fields: ["address_components", "formatted_address", "geometry"],
        }
      );

      // Handle place selection
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        
        if (!place || !place.address_components) {
          return;
        }

        // Parse address components
        let streetNumber = "";
        let route = "";
        let city = "";
        let state = "";
        let zipCode = "";
        let country = "";

        for (const component of place.address_components) {
          const type = component.types[0];
          
          switch (type) {
            case "street_number":
              streetNumber = component.long_name;
              break;
            case "route":
              route = component.long_name;
              break;
            case "locality":
              city = component.long_name;
              break;
            case "administrative_area_level_1":
              state = component.short_name;
              break;
            case "postal_code":
              zipCode = component.long_name;
              break;
            case "country":
              country = component.short_name;
              break;
          }
        }

        const address = streetNumber ? `${streetNumber} ${route}` : route;
        setInputValue(address);

        onChange({
          address,
          address2: value.address2 || "",
          city,
          state,
          zipCode,
          country,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
        });
      });
    }

    initAutocomplete();

    return () => {
      mounted = false;
    };
  }, []);

  // Update input value when external value changes
  useEffect(() => {
    if (value.address !== inputValue) {
      setInputValue(value.address || "");
    }
  }, [value.address]);

  const handleAddress2Change = (e: React.FocusEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      address2: e.target.value,
    });
  };

  const defaultInputStyle: React.CSSProperties = {
    backgroundColor: "#111111",
    borderColor: "#1F1F1F",
    color: "#FFFFFF",
  };

  const defaultLabelStyle: React.CSSProperties = {
    color: "#9CA3AF",
  };

  return (
    <div className="space-y-4">
      {/* Address Line 1 - Autocomplete */}
      <div className="space-y-2">
        <label className="text-sm font-medium" style={labelStyle || defaultLabelStyle}>
          Street Address *
        </label>
        <div className="relative">
          <MapPin 
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" 
            style={{ color: "#00CED1" }} 
          />
          <input
            ref={inputRef}
            type="text"
            className="flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm"
            placeholder={isLoading ? "Loading..." : placeholder}
            defaultValue={inputValue}
            disabled={isLoading}
            style={inputStyle || defaultInputStyle}
          />
          {isLoading && (
            <Loader2 
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" 
              style={{ color: "#00CED1" }} 
            />
          )}
        </div>
      </div>

      {/* Address Line 2 - Apt/Suite/Unit */}
      <div className="space-y-2">
        <label className="text-sm font-medium" style={labelStyle || defaultLabelStyle}>
          Apt, Suite, Unit (optional)
        </label>
        <input
          type="text"
          className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Apt 4B, Suite 200, Unit 5..."
          defaultValue={value.address2}
          onBlur={handleAddress2Change}
          style={inputStyle || defaultInputStyle}
        />
      </div>

      {/* City, State, ZIP - Auto-filled but editable */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium" style={labelStyle || defaultLabelStyle}>
            City
          </label>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="City"
            defaultValue={value.city}
            onBlur={(e) => onChange({ ...value, city: e.target.value })}
            style={inputStyle || defaultInputStyle}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" style={labelStyle || defaultLabelStyle}>
            State
          </label>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="FL"
            defaultValue={value.state}
            onBlur={(e) => onChange({ ...value, state: e.target.value })}
            style={inputStyle || defaultInputStyle}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" style={labelStyle || defaultLabelStyle}>
            ZIP Code
          </label>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="33101"
            defaultValue={value.zipCode}
            onBlur={(e) => onChange({ ...value, zipCode: e.target.value })}
            style={inputStyle || defaultInputStyle}
          />
        </div>
      </div>
    </div>
  );
}
