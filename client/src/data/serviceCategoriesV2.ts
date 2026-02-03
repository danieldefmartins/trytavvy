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
          services: ['Weekly Pool Cleaning', 'Chemical Balancing', 'Filter Cleaning', 'Skimmer Basket Cleaning', 'Pool Vacuuming', 'Tile Brushing', 'Water Testing', 'Algae Treatment', 'Salt Cell Cleaning', 'Seasonal Opening', 'Seasonal Closing', 'Winterization']
        },
        {
          name: 'Pool Repair',
          icon: '🔧',
          services: ['Pump Repair', 'Pump Replacement', 'Heater Repair', 'Heater Replacement', 'Filter Repair', 'Filter Replacement', 'Leak Detection', 'Leak Repair', 'Tile Repair', 'Coping Repair', 'Plaster Repair', 'Light Repair', 'Valve Repair', 'Pipe Repair', 'Motor Repair', 'Control System Repair']
        },
        {
          name: 'Pool Construction',
          icon: '🏗️',
          services: ['New Pool Build', 'Pool Remodeling', 'Pool Resurfacing', 'Pool Replastering', 'Pool Tile Installation', 'Pool Deck Installation', 'Pool Deck Resurfacing', 'Pool Coping Installation', 'Pool Waterfall', 'Pool Fountain', 'Pool Lighting Installation', 'Pool Automation', 'Pool Cover Installation', 'Pool Fence Installation', 'Pool Safety Features']
        },
        {
          name: 'Hot Tub & Spa',
          icon: '♨️',
          services: ['Hot Tub Installation', 'Hot Tub Repair', 'Hot Tub Maintenance', 'Spa Cleaning', 'Spa Chemical Balancing', 'Spa Cover Replacement', 'Spa Pump Repair', 'Spa Heater Repair', 'Spa Jet Repair', 'Spa Electrical Repair']
        },
        {
          name: 'Pool Equipment',
          icon: '⚙️',
          services: ['Pool Pump Installation', 'Pool Heater Installation', 'Pool Filter Installation', 'Salt System Installation', 'Pool Cleaner Installation', 'Pool Automation System', 'Variable Speed Pump Upgrade', 'Energy Efficient Equipment', 'Pool Timer Installation', 'Pool Chlorinator Installation']
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
          services: ['Drain Cleaning', 'Drain Unclogging', 'Drain Snaking', 'Hydro Jetting', 'Drain Camera Inspection', 'Drain Repair', 'Drain Installation', 'Floor Drain Service', 'Shower Drain Service', 'Kitchen Drain Service']
        },
        {
          name: 'Water Heater',
          icon: '🔥',
          services: ['Water Heater Repair', 'Water Heater Installation', 'Water Heater Replacement', 'Tankless Water Heater Installation', 'Tankless Water Heater Repair', 'Water Heater Maintenance', 'Water Heater Flush', 'Anode Rod Replacement', 'Thermostat Repair', 'Gas Water Heater Service', 'Electric Water Heater Service']
        },
        {
          name: 'Pipe Services',
          icon: '🔩',
          services: ['Pipe Repair', 'Pipe Replacement', 'Pipe Rerouting', 'Pipe Insulation', 'Frozen Pipe Repair', 'Burst Pipe Repair', 'Pipe Leak Repair', 'Copper Pipe Installation', 'PEX Pipe Installation', 'Gas Pipe Installation', 'Gas Pipe Repair', 'Repiping']
        },
        {
          name: 'Fixture Services',
          icon: '🚰',
          services: ['Faucet Repair', 'Faucet Installation', 'Faucet Replacement', 'Toilet Repair', 'Toilet Installation', 'Toilet Replacement', 'Sink Repair', 'Sink Installation', 'Garbage Disposal Repair', 'Garbage Disposal Installation', 'Shower Valve Repair', 'Bathtub Repair']
        },
        {
          name: 'Sewer & Septic',
          icon: '🏠',
          services: ['Sewer Line Repair', 'Sewer Line Replacement', 'Sewer Line Cleaning', 'Sewer Camera Inspection', 'Septic Pumping', 'Septic Inspection', 'Septic Repair', 'Septic Installation', 'Backflow Prevention', 'Backflow Testing']
        },
        {
          name: 'Water Treatment',
          icon: '💧',
          services: ['Water Softener Installation', 'Water Softener Repair', 'Water Filtration Installation', 'Reverse Osmosis Installation', 'Water Testing', 'Well Pump Repair', 'Well Pump Installation', 'Sump Pump Repair', 'Sump Pump Installation']
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
          services: ['Electrical Wiring', 'Rewiring', 'Panel Upgrade', 'Panel Replacement', 'Circuit Breaker Repair', 'Circuit Breaker Replacement', 'Fuse Box Upgrade', 'Electrical Inspection', 'Code Compliance', 'Grounding', 'Surge Protection']
        },
        {
          name: 'Lighting',
          icon: '💡',
          services: ['Light Installation', 'Light Repair', 'Recessed Lighting', 'LED Lighting Upgrade', 'Chandelier Installation', 'Ceiling Fan Installation', 'Ceiling Fan Repair', 'Under Cabinet Lighting', 'Landscape Lighting', 'Security Lighting', 'Motion Sensor Lights', 'Dimmer Switch Installation']
        },
        {
          name: 'Outlets & Switches',
          icon: '🔘',
          services: ['Outlet Installation', 'Outlet Repair', 'Outlet Replacement', 'GFCI Outlet Installation', 'USB Outlet Installation', 'Switch Installation', 'Switch Repair', 'Smart Switch Installation', 'Dimmer Installation', '240V Outlet Installation']
        },
        {
          name: 'Specialty Electrical',
          icon: '🔋',
          services: ['EV Charger Installation', 'Generator Installation', 'Generator Repair', 'Generator Maintenance', 'Whole House Generator', 'Backup Power System', 'Solar Panel Wiring', 'Hot Tub Wiring', 'Pool Electrical', 'Spa Electrical']
        },
        {
          name: 'Smart Home',
          icon: '🏠',
          services: ['Smart Home Installation', 'Smart Thermostat Installation', 'Smart Lighting Setup', 'Smart Lock Installation', 'Home Automation', 'Whole Home Audio', 'Network Wiring', 'Structured Wiring', 'Security System Wiring']
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
          services: ['AC Repair', 'AC Installation', 'AC Replacement', 'AC Maintenance', 'AC Tune-Up', 'Refrigerant Recharge', 'AC Coil Cleaning', 'Compressor Repair', 'Compressor Replacement', 'Central AC Installation', 'Mini Split Installation', 'Mini Split Repair', 'Window AC Installation']
        },
        {
          name: 'Heating',
          icon: '🔥',
          services: ['Furnace Repair', 'Furnace Installation', 'Furnace Replacement', 'Furnace Maintenance', 'Heat Pump Repair', 'Heat Pump Installation', 'Boiler Repair', 'Boiler Installation', 'Radiant Heating', 'Baseboard Heater', 'Space Heater Installation', 'Gas Fireplace Installation']
        },
        {
          name: 'Ductwork',
          icon: '🌀',
          services: ['Duct Cleaning', 'Duct Repair', 'Duct Installation', 'Duct Sealing', 'Duct Insulation', 'Duct Replacement', 'Ductless System Installation', 'Air Balancing', 'Zoning System Installation']
        },
        {
          name: 'Indoor Air Quality',
          icon: '🌬️',
          services: ['Air Purifier Installation', 'Humidifier Installation', 'Dehumidifier Installation', 'UV Light Installation', 'Air Filter Replacement', 'Ventilation Installation', 'ERV Installation', 'HRV Installation', 'Dryer Vent Cleaning', 'Air Quality Testing']
        },
        {
          name: 'Thermostats',
          icon: '🌡️',
          services: ['Thermostat Installation', 'Thermostat Replacement', 'Smart Thermostat Installation', 'Programmable Thermostat', 'Thermostat Repair', 'Thermostat Calibration', 'Multi-Zone Thermostat']
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
          services: ['Roof Leak Repair', 'Shingle Repair', 'Shingle Replacement', 'Flashing Repair', 'Vent Repair', 'Skylight Repair', 'Chimney Repair', 'Ridge Cap Repair', 'Valley Repair', 'Emergency Roof Repair', 'Storm Damage Repair', 'Hail Damage Repair']
        },
        {
          name: 'Roof Installation',
          icon: '🏗️',
          services: ['New Roof Installation', 'Roof Replacement', 'Asphalt Shingle Roof', 'Metal Roof Installation', 'Tile Roof Installation', 'Slate Roof Installation', 'Flat Roof Installation', 'TPO Roofing', 'EPDM Roofing', 'Modified Bitumen', 'Cedar Shake Roof', 'Synthetic Roofing']
        },
        {
          name: 'Gutters',
          icon: '🌧️',
          services: ['Gutter Installation', 'Gutter Repair', 'Gutter Cleaning', 'Gutter Guard Installation', 'Seamless Gutter Installation', 'Downspout Installation', 'Downspout Repair', 'Gutter Replacement', 'Gutter Realignment']
        },
        {
          name: 'Roof Maintenance',
          icon: '🧹',
          services: ['Roof Inspection', 'Roof Cleaning', 'Moss Removal', 'Roof Coating', 'Roof Sealing', 'Preventive Maintenance', 'Annual Roof Checkup', 'Debris Removal']
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
          services: ['Lawn Mowing', 'Lawn Edging', 'Lawn Fertilization', 'Lawn Aeration', 'Lawn Seeding', 'Overseeding', 'Sod Installation', 'Lawn Dethatching', 'Weed Control', 'Grub Treatment', 'Lawn Disease Treatment', 'Seasonal Lawn Care']
        },
        {
          name: 'Tree & Shrub',
          icon: '🌲',
          services: ['Tree Trimming', 'Tree Pruning', 'Tree Removal', 'Stump Removal', 'Stump Grinding', 'Shrub Trimming', 'Hedge Trimming', 'Bush Removal', 'Tree Planting', 'Shrub Planting', 'Tree Health Assessment', 'Tree Cabling']
        },
        {
          name: 'Irrigation',
          icon: '💦',
          services: ['Sprinkler Installation', 'Sprinkler Repair', 'Irrigation System Design', 'Drip Irrigation', 'Sprinkler Head Replacement', 'Sprinkler Winterization', 'Sprinkler Startup', 'Smart Irrigation Controller', 'Rain Sensor Installation', 'Irrigation Audit']
        },
        {
          name: 'Landscape Design',
          icon: '🎨',
          services: ['Landscape Design', 'Garden Design', 'Planting Design', 'Flower Bed Installation', 'Mulching', 'Rock Garden', 'Xeriscaping', 'Native Plant Installation', 'Seasonal Planting', 'Container Gardening']
        },
        {
          name: 'Hardscaping',
          icon: '🧱',
          services: ['Patio Installation', 'Paver Installation', 'Walkway Installation', 'Retaining Wall', 'Stone Wall', 'Outdoor Steps', 'Driveway Pavers', 'Fire Pit Installation', 'Outdoor Fireplace', 'Water Feature Installation']
        },
        {
          name: 'Outdoor Structures',
          icon: '🏡',
          services: ['Deck Building', 'Deck Repair', 'Deck Staining', 'Pergola Installation', 'Gazebo Installation', 'Arbor Installation', 'Fence Installation', 'Fence Repair', 'Gate Installation', 'Outdoor Kitchen', 'Shed Installation']
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
          services: ['Regular House Cleaning', 'Deep Cleaning', 'Move-In Cleaning', 'Move-Out Cleaning', 'Spring Cleaning', 'One-Time Cleaning', 'Recurring Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning', 'Bedroom Cleaning']
        },
        {
          name: 'Specialty Cleaning',
          icon: '✨',
          services: ['Carpet Cleaning', 'Upholstery Cleaning', 'Window Cleaning', 'Pressure Washing', 'Power Washing', 'Tile & Grout Cleaning', 'Hardwood Floor Cleaning', 'Mattress Cleaning', 'Rug Cleaning', 'Blind Cleaning']
        },
        {
          name: 'Post-Construction',
          icon: '🏗️',
          services: ['Post-Construction Cleaning', 'Renovation Cleanup', 'Dust Removal', 'Debris Removal', 'Final Clean', 'Builder Clean', 'New Construction Cleaning']
        },
        {
          name: 'Commercial Cleaning',
          icon: '🏢',
          services: ['Office Cleaning', 'Commercial Cleaning', 'Janitorial Services', 'Retail Cleaning', 'Medical Office Cleaning', 'Restaurant Cleaning', 'Gym Cleaning', 'Church Cleaning', 'School Cleaning']
        },
        {
          name: 'Specialized Services',
          icon: '🧪',
          services: ['Disinfection Service', 'Sanitization', 'Hoarding Cleanup', 'Estate Cleanout', 'Biohazard Cleanup', 'Odor Removal', 'Air Duct Cleaning', 'Dryer Vent Cleaning', 'Gutter Cleaning']
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
          services: ['Interior Wall Painting', 'Ceiling Painting', 'Trim Painting', 'Door Painting', 'Cabinet Painting', 'Accent Wall', 'Faux Finish', 'Texture Painting', 'Color Consultation']
        },
        {
          name: 'Exterior Painting',
          icon: '🏡',
          services: ['Exterior House Painting', 'Siding Painting', 'Trim Painting', 'Door Painting', 'Garage Door Painting', 'Fence Painting', 'Deck Staining', 'Fence Staining', 'Pressure Washing Before Paint']
        },
        {
          name: 'Specialty Finishes',
          icon: '✨',
          services: ['Cabinet Refinishing', 'Furniture Painting', 'Wallpaper Installation', 'Wallpaper Removal', 'Epoxy Flooring', 'Garage Floor Coating', 'Decorative Painting', 'Murals']
        },
        {
          name: 'Prep & Repair',
          icon: '🔧',
          services: ['Drywall Repair', 'Drywall Patching', 'Drywall Texture', 'Popcorn Ceiling Removal', 'Caulking', 'Sanding', 'Priming', 'Surface Preparation', 'Lead Paint Removal']
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
          services: ['Door Repair', 'Window Repair', 'Drywall Repair', 'Caulking', 'Weatherstripping', 'Screen Repair', 'Lock Repair', 'Hinge Repair', 'Handle Replacement', 'Minor Plumbing Repairs', 'Minor Electrical Repairs']
        },
        {
          name: 'Installation',
          icon: '🔩',
          services: ['TV Mounting', 'Shelf Installation', 'Picture Hanging', 'Mirror Hanging', 'Curtain Rod Installation', 'Blind Installation', 'Door Installation', 'Pet Door Installation', 'Mailbox Installation', 'House Number Installation']
        },
        {
          name: 'Assembly',
          icon: '📦',
          services: ['Furniture Assembly', 'IKEA Assembly', 'Desk Assembly', 'Bed Frame Assembly', 'Bookshelf Assembly', 'Outdoor Furniture Assembly', 'Gym Equipment Assembly', 'Grill Assembly', 'Playground Assembly']
        },
        {
          name: 'Carpentry',
          icon: '🪚',
          services: ['Trim Work', 'Crown Molding', 'Baseboard Installation', 'Door Trim', 'Window Trim', 'Wainscoting', 'Built-in Shelving', 'Custom Closets', 'Deck Repair', 'Fence Repair', 'Gate Repair']
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
          services: ['Full Kitchen Remodel', 'Kitchen Design', 'Cabinet Installation', 'Cabinet Refacing', 'Countertop Installation', 'Backsplash Installation', 'Kitchen Island', 'Kitchen Flooring', 'Kitchen Lighting', 'Appliance Installation']
        },
        {
          name: 'Bathroom Remodeling',
          icon: '🚿',
          services: ['Full Bathroom Remodel', 'Bathroom Design', 'Shower Installation', 'Bathtub Installation', 'Vanity Installation', 'Tile Installation', 'Bathroom Flooring', 'Bathroom Lighting', 'Accessibility Modifications']
        },
        {
          name: 'Additions & Conversions',
          icon: '🏠',
          services: ['Room Addition', 'Home Addition', 'Second Story Addition', 'Garage Conversion', 'Basement Finishing', 'Attic Conversion', 'ADU Construction', 'In-Law Suite', 'Sunroom Addition']
        },
        {
          name: 'Whole Home',
          icon: '🏡',
          services: ['Whole Home Remodel', 'New Construction', 'Custom Home Build', 'Historic Renovation', 'Structural Repair', 'Foundation Repair', 'Demolition', 'Permit Services', 'Project Management']
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
          services: ['Hardwood Installation', 'Hardwood Refinishing', 'Hardwood Repair', 'Hardwood Sanding', 'Hardwood Staining', 'Engineered Hardwood Installation', 'Hardwood Floor Cleaning', 'Hardwood Restoration']
        },
        {
          name: 'Tile',
          icon: '🧱',
          services: ['Tile Installation', 'Tile Repair', 'Tile Replacement', 'Grout Repair', 'Grout Cleaning', 'Grout Sealing', 'Backsplash Tile', 'Shower Tile', 'Floor Tile', 'Mosaic Tile']
        },
        {
          name: 'Carpet',
          icon: '🧶',
          services: ['Carpet Installation', 'Carpet Repair', 'Carpet Stretching', 'Carpet Cleaning', 'Carpet Removal', 'Stair Carpet Installation', 'Carpet Padding']
        },
        {
          name: 'Vinyl & Laminate',
          icon: '📋',
          services: ['Vinyl Installation', 'LVP Installation', 'LVT Installation', 'Laminate Installation', 'Vinyl Plank Flooring', 'Sheet Vinyl', 'Vinyl Repair', 'Laminate Repair']
        },
        {
          name: 'Specialty Flooring',
          icon: '✨',
          services: ['Epoxy Flooring', 'Concrete Polishing', 'Concrete Staining', 'Cork Flooring', 'Bamboo Flooring', 'Linoleum Installation', 'Rubber Flooring', 'Subfloor Repair', 'Floor Leveling']
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
