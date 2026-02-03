// Service Categories with 3-level hierarchy: Category → Subcategory → Services
// This allows pros to select their category, then subcategories, then specific services

export interface Service {
  name: string;
  description?: string;
}

export interface Subcategory {
  name: string;
  icon: string;
  services: string[];
}

export interface Category {
  name: string;
  icon: string;
  subcategories: Subcategory[];
  keywords?: string[];
}

export interface AllCategoriesV2 {
  pro: Category[];
  realtor: Category[];
  on_the_go: Category[];
}

// Full comprehensive category list with 3 levels
export const SERVICE_CATEGORIES_V2: AllCategoriesV2 = {
  pro: [
    // Pool & Spa
    {
      name: 'Pool & Spa',
      icon: '🏊',
      keywords: ['swimming', 'spa', 'hot tub', 'jacuzzi', 'pool'],
      subcategories: [
        {
          name: 'Pool Maintenance',
          icon: '🧹',
          services: ['Weekly Pool Service', 'Pool Opening', 'Pool Closing', 'Green Pool Cleanup', 'Algae Removal', 'Pool Winterization', 'Salt Cell Replacement', 'Filter Cartridge Replacement', 'Pool Inspection']
        },
        {
          name: 'Pool Repair',
          icon: '🔧',
          services: ['Pump Replacement', 'Heater Replacement', 'Filter Replacement', 'Leak Detection', 'Leak Repair', 'Crack Repair', 'Tile Replacement', 'Coping Replacement', 'Plaster Repair', 'Pool Light Replacement', 'Skimmer Replacement', 'Motor Replacement', 'Valve Replacement', 'Pool Pipe Repair']
        },
        {
          name: 'Pool Construction',
          icon: '🏗️',
          services: ['New Pool Construction', 'Pool Renovation', 'Pool Resurfacing', 'Pool Replastering', 'Pool Tile Installation', 'Pool Deck Construction', 'Pool Deck Resurfacing', 'Coping Installation', 'Pool Waterfall Installation', 'Pool Fountain Installation', 'Pool Fence Installation', 'Pool Enclosure', 'Pebble Finish', 'Diamond Brite']
        },
        {
          name: 'Hot Tub & Spa',
          icon: '♨️',
          services: ['Hot Tub Installation', 'Hot Tub Repair', 'Spa Installation', 'Spa Repair', 'Hot Tub Cover Replacement', 'Spa Pump Replacement', 'Spa Heater Replacement', 'Jet Replacement', 'Hot Tub Electrical']
        },
        {
          name: 'Pool Equipment',
          icon: '⚙️',
          services: ['Pump Installation', 'Heater Installation', 'Filter Installation', 'Salt System Installation', 'Pool Cleaner Installation', 'Automation System Installation', 'Variable Speed Pump', 'Heat Pump Installation', 'Gas Heater Installation', 'Solar Heater Installation', 'LED Pool Lights', 'Pool Timer Installation']
        }
      ]
    },
    
    // Plumbing
    {
      name: 'Plumbing',
      icon: '🔧',
      keywords: ['plumber', 'pipes', 'water', 'drain', 'leak'],
      subcategories: [
        {
          name: 'Drain Services',
          icon: '🚿',
          services: ['Clogged Drain', 'Drain Cleaning', 'Hydro Jetting', 'Drain Camera Inspection', 'Main Line Cleaning', 'Kitchen Drain Repair', 'Shower Drain Repair', 'Floor Drain Installation']
        },
        {
          name: 'Water Heater',
          icon: '🔥',
          services: ['Water Heater Installation', 'Water Heater Replacement', 'Tankless Water Heater Installation', 'Water Heater Repair', 'Gas Water Heater Installation', 'Electric Water Heater Installation', 'Hot Water Recirculation Pump']
        },
        {
          name: 'Pipe Services',
          icon: '🔩',
          services: ['Pipe Repair', 'Pipe Replacement', 'Whole House Repiping', 'Frozen Pipe Repair', 'Burst Pipe Repair', 'Water Leak Repair', 'Gas Line Installation', 'Gas Line Repair', 'PEX Repiping', 'Copper Repiping']
        },
        {
          name: 'Fixture Services',
          icon: '🚰',
          services: ['Faucet Installation', 'Faucet Replacement', 'Toilet Installation', 'Toilet Replacement', 'Sink Installation', 'Garbage Disposal Installation', 'Shower Installation', 'Bathtub Installation', 'Bidet Installation']
        },
        {
          name: 'Sewer & Septic',
          icon: '🏠',
          services: ['Sewer Line Repair', 'Sewer Line Replacement', 'Sewer Camera Inspection', 'Septic Tank Pumping', 'Septic System Installation', 'Septic Repair', 'Backflow Preventer Installation', 'Backflow Testing']
        },
        {
          name: 'Water Treatment',
          icon: '💧',
          services: ['Water Softener Installation', 'Water Filtration System', 'Reverse Osmosis System', 'Well Pump Installation', 'Well Pump Replacement', 'Sump Pump Installation', 'Sump Pump Replacement']
        }
      ]
    },
    
    // Electrical
    {
      name: 'Electrical',
      icon: '⚡',
      keywords: ['electrician', 'power', 'lights', 'wires'],
      subcategories: [
        {
          name: 'Wiring & Panels',
          icon: '🔌',
          services: ['Electrical Panel Upgrade', 'Panel Replacement', 'Circuit Breaker Replacement', 'Whole House Rewiring', 'Electrical Inspection', 'Surge Protector Installation', '200 Amp Service Upgrade', 'Subpanel Installation']
        },
        {
          name: 'Lighting',
          icon: '💡',
          services: ['Recessed Lighting Installation', 'LED Lighting Installation', 'Chandelier Installation', 'Ceiling Fan Installation', 'Landscape Lighting', 'Security Lighting', 'Under Cabinet Lighting', 'Track Lighting Installation']
        },
        {
          name: 'Outlets & Switches',
          icon: '🔘',
          services: ['Outlet Installation', 'GFCI Outlet Installation', '240V Outlet Installation', 'USB Outlet Installation', 'Dimmer Switch Installation', 'Smart Switch Installation', 'Outlet Repair']
        },
        {
          name: 'Specialty Electrical',
          icon: '🔋',
          services: ['EV Charger Installation', 'Tesla Charger Installation', 'Generator Installation', 'Whole House Generator', 'Hot Tub Wiring', 'Pool Electrical', 'Spa Electrical', 'Solar Panel Installation']
        },
        {
          name: 'Smart Home',
          icon: '🏠',
          services: ['Smart Home Setup', 'Smart Thermostat Installation', 'Smart Lock Installation', 'Home Automation', 'Security Camera Installation', 'Doorbell Camera Installation', 'Whole Home Audio']
        }
      ]
    },
    
    // HVAC
    {
      name: 'HVAC',
      icon: '❄️',
      keywords: ['air conditioning', 'heating', 'cooling', 'furnace', 'ventilation'],
      subcategories: [
        {
          name: 'Air Conditioning',
          icon: '❄️',
          services: ['AC Installation', 'AC Replacement', 'AC Repair', 'Central AC Installation', 'Mini Split Installation', 'Mini Split Repair', 'AC Not Cooling', 'Refrigerant Recharge', 'Compressor Replacement']
        },
        {
          name: 'Heating',
          icon: '🔥',
          services: ['Furnace Installation', 'Furnace Replacement', 'Furnace Repair', 'Heat Pump Installation', 'Heat Pump Replacement', 'Boiler Installation', 'Boiler Repair', 'Gas Fireplace Installation', 'Radiant Floor Heating']
        },
        {
          name: 'Ductwork',
          icon: '🌀',
          services: ['Duct Cleaning', 'Duct Installation', 'Duct Replacement', 'Duct Sealing', 'Ductless System Installation', 'Zoning System Installation', 'Air Balancing']
        },
        {
          name: 'Indoor Air Quality',
          icon: '🌬️',
          services: ['Air Purifier Installation', 'Whole House Humidifier', 'Dehumidifier Installation', 'UV Light Installation', 'Dryer Vent Cleaning', 'Ventilation Installation']
        },
        {
          name: 'Thermostats',
          icon: '🌡️',
          services: ['Smart Thermostat Installation', 'Nest Thermostat Installation', 'Ecobee Installation', 'Thermostat Replacement', 'Multi-Zone Thermostat']
        }
      ]
    },
    
    // Roofing
    {
      name: 'Roofing',
      icon: '🏠',
      keywords: ['roofer', 'shingles', 'gutters', 'leak'],
      subcategories: [
        {
          name: 'Roof Repair',
          icon: '🔧',
          services: ['Roof Leak Repair', 'Shingle Replacement', 'Flashing Repair', 'Skylight Repair', 'Emergency Roof Repair', 'Storm Damage Repair', 'Hail Damage Repair', 'Chimney Flashing']
        },
        {
          name: 'Roof Installation',
          icon: '🏗️',
          services: ['New Roof Installation', 'Roof Replacement', 'Asphalt Shingle Roof', 'Metal Roof Installation', 'Tile Roof Installation', 'Flat Roof Installation', 'TPO Roofing', 'Standing Seam Metal Roof']
        },
        {
          name: 'Gutters',
          icon: '🌧️',
          services: ['Gutter Installation', 'Seamless Gutter Installation', 'Gutter Replacement', 'Gutter Guard Installation', 'Downspout Installation', 'Gutter Repair']
        },
        {
          name: 'Roof Maintenance',
          icon: '🧹',
          services: ['Roof Inspection', 'Roof Cleaning', 'Roof Coating', 'Moss Removal', 'Roof Sealing']
        }
      ]
    },
    
    // Landscaping
    {
      name: 'Landscaping',
      icon: '🌳',
      keywords: ['lawn', 'yard', 'garden', 'trees', 'grass'],
      subcategories: [
        {
          name: 'Lawn Care',
          icon: '🌱',
          services: ['Lawn Mowing Service', 'Lawn Fertilization', 'Lawn Aeration', 'Sod Installation', 'Overseeding', 'Weed Control', 'Grub Treatment']
        },
        {
          name: 'Tree & Shrub',
          icon: '🌲',
          services: ['Tree Trimming', 'Tree Removal', 'Stump Removal', 'Stump Grinding', 'Hedge Trimming', 'Tree Planting', 'Palm Tree Trimming']
        },
        {
          name: 'Irrigation',
          icon: '💦',
          services: ['Sprinkler Installation', 'Sprinkler Repair', 'Irrigation System Installation', 'Drip Irrigation Installation', 'Sprinkler Winterization', 'Smart Irrigation Controller']
        },
        {
          name: 'Landscape Design',
          icon: '🎨',
          services: ['Landscape Design', 'Flower Bed Installation', 'Mulch Installation', 'Rock Garden', 'Xeriscaping', 'Sod Installation']
        },
        {
          name: 'Hardscaping',
          icon: '🧱',
          services: ['Patio Installation', 'Paver Installation', 'Walkway Installation', 'Retaining Wall', 'Fire Pit Installation', 'Outdoor Fireplace', 'Driveway Pavers']
        },
        {
          name: 'Outdoor Structures',
          icon: '🏡',
          services: ['Deck Building', 'Deck Repair', 'Pergola Installation', 'Fence Installation', 'Fence Repair', 'Gate Installation', 'Outdoor Kitchen', 'Aluminum Pergola']
        }
      ]
    },
    
    // Cleaning
    {
      name: 'Cleaning',
      icon: '🧹',
      keywords: ['cleaner', 'maid', 'janitorial', 'housekeeping'],
      subcategories: [
        {
          name: 'Residential Cleaning',
          icon: '🏠',
          services: ['House Cleaning', 'Deep Cleaning', 'Move-In Cleaning', 'Move-Out Cleaning', 'Recurring Cleaning', 'One-Time Cleaning']
        },
        {
          name: 'Specialty Cleaning',
          icon: '✨',
          services: ['Carpet Cleaning', 'Upholstery Cleaning', 'Window Cleaning', 'Pressure Washing', 'Tile & Grout Cleaning', 'Hardwood Floor Cleaning']
        },
        {
          name: 'Post-Construction',
          icon: '🏗️',
          services: ['Post-Construction Cleaning', 'Renovation Cleanup', 'New Construction Cleaning']
        },
        {
          name: 'Commercial Cleaning',
          icon: '🏢',
          services: ['Office Cleaning', 'Commercial Cleaning', 'Janitorial Services', 'Restaurant Cleaning', 'Medical Office Cleaning']
        },
        {
          name: 'Specialized Services',
          icon: '🧪',
          services: ['Disinfection Service', 'Hoarding Cleanup', 'Estate Cleanout', 'Odor Removal', 'Air Duct Cleaning']
        }
      ]
    },
    
    // Painting
    {
      name: 'Painting',
      icon: '🎨',
      keywords: ['painter', 'staining', 'wallpaper', 'drywall'],
      subcategories: [
        {
          name: 'Interior Painting',
          icon: '🏠',
          services: ['Interior Painting', 'Ceiling Painting', 'Trim Painting', 'Cabinet Painting', 'Accent Wall']
        },
        {
          name: 'Exterior Painting',
          icon: '🏡',
          services: ['Exterior Painting', 'House Painting', 'Deck Staining', 'Fence Staining', 'Garage Door Painting']
        },
        {
          name: 'Specialty Finishes',
          icon: '✨',
          services: ['Cabinet Refinishing', 'Wallpaper Installation', 'Wallpaper Removal', 'Epoxy Flooring', 'Garage Floor Coating']
        },
        {
          name: 'Prep & Repair',
          icon: '🔧',
          services: ['Drywall Repair', 'Drywall Installation', 'Popcorn Ceiling Removal', 'Texture Repair']
        }
      ]
    },
    
    // Handyman
    {
      name: 'Handyman',
      icon: '🔨',
      keywords: ['repairs', 'fix', 'install', 'mount'],
      subcategories: [
        {
          name: 'General Repairs',
          icon: '🔧',
          services: ['Door Repair', 'Window Repair', 'Drywall Repair', 'Screen Repair', 'Lock Repair']
        },
        {
          name: 'Installation',
          icon: '🔩',
          services: ['TV Mounting', 'Shelf Installation', 'Blind Installation', 'Door Installation', 'Pet Door Installation']
        },
        {
          name: 'Assembly',
          icon: '📦',
          services: ['Furniture Assembly', 'IKEA Assembly', 'Gym Equipment Assembly', 'Grill Assembly', 'Playground Assembly']
        },
        {
          name: 'Carpentry',
          icon: '🪚',
          services: ['Crown Molding Installation', 'Baseboard Installation', 'Built-in Shelving', 'Custom Closets', 'Deck Repair', 'Fence Repair']
        }
      ]
    },
    
    // General Contractor
    {
      name: 'General Contractor',
      icon: '🏗️',
      keywords: ['contractor', 'remodel', 'renovation', 'construction'],
      subcategories: [
        {
          name: 'Kitchen Remodeling',
          icon: '🍳',
          services: ['Kitchen Remodel', 'Cabinet Installation', 'Cabinet Refacing', 'Countertop Installation', 'Backsplash Installation', 'Kitchen Island Installation']
        },
        {
          name: 'Bathroom Remodeling',
          icon: '🚿',
          services: ['Bathroom Remodel', 'Shower Installation', 'Bathtub Installation', 'Vanity Installation', 'Tile Installation', 'Walk-In Shower Conversion']
        },
        {
          name: 'Additions & Conversions',
          icon: '🏠',
          services: ['Room Addition', 'Home Addition', 'Garage Conversion', 'Basement Finishing', 'ADU Construction', 'Sunroom Addition']
        },
        {
          name: 'Whole Home',
          icon: '🏡',
          services: ['Whole Home Remodel', 'New Home Construction', 'Foundation Repair', 'Structural Repair', 'Demolition']
        }
      ]
    },
    
    // Flooring
    {
      name: 'Flooring',
      icon: '🪵',
      keywords: ['floors', 'hardwood', 'tile', 'carpet', 'vinyl'],
      subcategories: [
        {
          name: 'Hardwood',
          icon: '🪵',
          services: ['Hardwood Installation', 'Hardwood Refinishing', 'Hardwood Repair', 'Engineered Hardwood Installation']
        },
        {
          name: 'Tile',
          icon: '🧱',
          services: ['Tile Installation', 'Tile Repair', 'Grout Repair', 'Backsplash Installation', 'Shower Tile Installation']
        },
        {
          name: 'Carpet',
          icon: '🧶',
          services: ['Carpet Installation', 'Carpet Repair', 'Carpet Stretching', 'Carpet Removal']
        },
        {
          name: 'Vinyl & Laminate',
          icon: '📋',
          services: ['LVP Installation', 'Laminate Installation', 'Vinyl Plank Flooring', 'Sheet Vinyl Installation']
        },
        {
          name: 'Specialty Flooring',
          icon: '✨',
          services: ['Epoxy Flooring', 'Concrete Polishing', 'Concrete Staining', 'Floor Leveling']
        }
      ]
    }
  ],
  
  realtor: [
    {
      name: 'Residential Sales',
      icon: '🏠',
      keywords: ['home', 'house', 'buy', 'sell'],
      subcategories: [
        {
          name: 'Buyer Services',
          icon: '🔑',
          services: ['Buyer Representation', 'Home Search', 'Property Tours', 'Offer Negotiation', 'Contract Review', 'Closing Coordination', 'First-Time Buyer Guidance', 'Investment Property Search']
        },
        {
          name: 'Seller Services',
          icon: '🏷️',
          services: ['Listing Services', 'Home Valuation', 'Market Analysis', 'Staging Consultation', 'Professional Photography', 'Virtual Tours', 'Open Houses', 'Marketing & Advertising', 'Offer Review', 'Closing Coordination']
        },
        {
          name: 'Specialty Residential',
          icon: '🏡',
          services: ['Luxury Homes', 'Waterfront Properties', 'Historic Homes', 'New Construction', 'Condos & Townhomes', 'Senior Living', 'Relocation Services', 'Estate Sales']
        }
      ]
    },
    {
      name: 'Commercial',
      icon: '🏢',
      keywords: ['business', 'office', 'retail', 'industrial'],
      subcategories: [
        {
          name: 'Commercial Sales',
          icon: '💼',
          services: ['Office Buildings', 'Retail Properties', 'Industrial Properties', 'Warehouse', 'Mixed-Use Properties', 'Land Sales', 'Investment Properties', 'Business Sales']
        },
        {
          name: 'Commercial Leasing',
          icon: '📝',
          services: ['Office Leasing', 'Retail Leasing', 'Industrial Leasing', 'Warehouse Leasing', 'Lease Negotiation', 'Tenant Representation', 'Landlord Representation']
        }
      ]
    },
    {
      name: 'Property Management',
      icon: '🔑',
      keywords: ['rental', 'landlord', 'tenant', 'management'],
      subcategories: [
        {
          name: 'Residential Management',
          icon: '🏠',
          services: ['Tenant Screening', 'Rent Collection', 'Property Maintenance', 'Lease Management', 'Move-In/Move-Out Inspections', 'Eviction Services', 'Financial Reporting', 'Vendor Management']
        },
        {
          name: 'Commercial Management',
          icon: '🏢',
          services: ['Commercial Tenant Management', 'CAM Reconciliation', 'Lease Administration', 'Building Maintenance', 'Vendor Coordination', 'Financial Reporting']
        }
      ]
    }
  ],
  
  on_the_go: [
    {
      name: 'Mobile Auto Services',
      icon: '🚗',
      keywords: ['car', 'auto', 'vehicle', 'mobile mechanic'],
      subcategories: [
        {
          name: 'Mobile Detailing',
          icon: '✨',
          services: ['Exterior Wash', 'Interior Cleaning', 'Full Detail', 'Wax & Polish', 'Clay Bar Treatment', 'Ceramic Coating', 'Paint Correction', 'Headlight Restoration', 'Engine Cleaning', 'Leather Conditioning']
        },
        {
          name: 'Mobile Mechanic',
          icon: '🔧',
          services: ['Oil Change', 'Brake Service', 'Battery Replacement', 'Tire Service', 'Belt Replacement', 'Fluid Top-Off', 'Filter Replacement', 'Spark Plug Replacement', 'Diagnostic Service', 'Pre-Purchase Inspection']
        },
        {
          name: 'Mobile Windshield',
          icon: '🪟',
          services: ['Windshield Repair', 'Windshield Replacement', 'Chip Repair', 'Crack Repair', 'Window Tinting', 'Side Window Replacement', 'Rear Window Replacement']
        }
      ]
    },
    {
      name: 'Mobile Pet Services',
      icon: '🐕',
      keywords: ['pet', 'dog', 'cat', 'grooming'],
      subcategories: [
        {
          name: 'Mobile Grooming',
          icon: '✂️',
          services: ['Full Grooming', 'Bath & Brush', 'Haircut & Styling', 'Nail Trimming', 'Ear Cleaning', 'Teeth Brushing', 'De-Shedding Treatment', 'Flea Treatment', 'Puppy Grooming', 'Senior Pet Grooming']
        },
        {
          name: 'Mobile Vet',
          icon: '🏥',
          services: ['Wellness Exams', 'Vaccinations', 'Microchipping', 'Blood Work', 'Prescription Refills', 'End of Life Care', 'Pet Hospice']
        }
      ]
    },
    {
      name: 'Mobile Beauty',
      icon: '💅',
      keywords: ['beauty', 'hair', 'makeup', 'nails'],
      subcategories: [
        {
          name: 'Mobile Hair',
          icon: '💇',
          services: ['Haircut', 'Hair Coloring', 'Highlights', 'Blowout', 'Styling', 'Bridal Hair', 'Event Hair', 'Extensions', 'Treatments']
        },
        {
          name: 'Mobile Makeup',
          icon: '💄',
          services: ['Makeup Application', 'Bridal Makeup', 'Event Makeup', 'Photoshoot Makeup', 'Makeup Lessons', 'Airbrush Makeup', 'Special Effects Makeup']
        },
        {
          name: 'Mobile Nails',
          icon: '💅',
          services: ['Manicure', 'Pedicure', 'Gel Nails', 'Acrylic Nails', 'Nail Art', 'Nail Repair', 'Paraffin Treatment']
        },
        {
          name: 'Mobile Spa',
          icon: '🧖',
          services: ['Mobile Massage', 'Facial', 'Body Treatment', 'Waxing', 'Lash Extensions', 'Brow Services', 'Spray Tan']
        }
      ]
    },
    {
      name: 'Food Truck',
      icon: '🚚',
      keywords: ['food', 'catering', 'mobile food', 'truck'],
      subcategories: [
        {
          name: 'Event Catering',
          icon: '🎉',
          services: ['Private Events', 'Corporate Events', 'Weddings', 'Birthday Parties', 'Graduation Parties', 'Holiday Parties', 'Office Lunch', 'Festival Vending']
        },
        {
          name: 'Cuisine Types',
          icon: '🍽️',
          services: ['American', 'Mexican', 'Asian', 'BBQ', 'Pizza', 'Seafood', 'Vegan/Vegetarian', 'Desserts', 'Coffee & Beverages', 'Breakfast']
        }
      ]
    }
  ]
};

// Helper function to get all categories for a provider type
export function getCategoriesForProviderType(providerType: string): Category[] {
  return SERVICE_CATEGORIES_V2[providerType as keyof typeof SERVICE_CATEGORIES_V2] || [];
}

// Helper function to get subcategories for a category
export function getSubcategoriesForCategory(providerType: string, categoryName: string): Subcategory[] {
  const categories = getCategoriesForProviderType(providerType);
  const category = categories.find(c => c.name === categoryName);
  return category?.subcategories || [];
}

// Helper function to get services for a subcategory
export function getServicesForSubcategory(providerType: string, categoryName: string, subcategoryName: string): string[] {
  const subcategories = getSubcategoriesForCategory(providerType, categoryName);
  const subcategory = subcategories.find(s => s.name === subcategoryName);
  return subcategory?.services || [];
}

// Helper function to search across all categories
export function searchCategoriesV2(providerType: string, query: string): Category[] {
  if (!query.trim()) return [];
  
  const categories = getCategoriesForProviderType(providerType);
  const lowerQuery = query.toLowerCase();
  
  return categories.filter(cat => {
    // Match category name
    if (cat.name.toLowerCase().includes(lowerQuery)) return true;
    // Match keywords
    if (cat.keywords?.some(k => k.toLowerCase().includes(lowerQuery))) return true;
    // Match subcategory names
    if (cat.subcategories.some(sub => sub.name.toLowerCase().includes(lowerQuery))) return true;
    // Match service names
    if (cat.subcategories.some(sub => sub.services.some(svc => svc.toLowerCase().includes(lowerQuery)))) return true;
    return false;
  });
}

// Featured categories for quick selection
export const FEATURED_CATEGORIES_V2 = {
  pro: ['Pool & Spa', 'Plumbing', 'Electrical', 'HVAC', 'Roofing', 'Landscaping', 'Cleaning', 'Painting'],
  realtor: ['Residential Sales', 'Commercial', 'Property Management'],
  on_the_go: ['Mobile Auto Services', 'Mobile Pet Services', 'Mobile Beauty', 'Food Truck'],
};
