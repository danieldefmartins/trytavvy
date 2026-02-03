// Comprehensive service categories for Tavvy Pros
// Organized by provider type with subcategories for detailed service selection

export interface ServiceCategory {
  name: string;
  icon: string;
  subcategories: string[];
  keywords?: string[]; // Additional search keywords
}

export interface AllCategories {
  pro: ServiceCategory[];
  realtor: ServiceCategory[];
  on_the_go: ServiceCategory[];
}

// Popular/Featured categories shown as tiles
export const FEATURED_CATEGORIES = {
  pro: ['Plumbing', 'Electrical', 'HVAC', 'Roofing', 'Landscaping', 'Cleaning', 'Painting', 'Handyman'],
  realtor: ['Residential Sales', 'Commercial', 'Property Management', 'Rentals'],
  on_the_go: ['Food Truck', 'Mobile Grooming', 'Mobile Detailing', 'Mobile Mechanic'],
};

// Full comprehensive category list
export const SERVICE_CATEGORIES: AllCategories = {
  pro: [
    // Home Repair & Maintenance
    { name: 'Plumbing', icon: '🔧', subcategories: ['Drain Cleaning', 'Water Heater Repair', 'Water Heater Installation', 'Pipe Repair', 'Pipe Replacement', 'Bathroom Remodel', 'Kitchen Plumbing', 'Sewer Line Repair', 'Sewer Line Replacement', 'Faucet Repair', 'Faucet Installation', 'Toilet Repair', 'Toilet Installation', 'Garbage Disposal', 'Water Softener', 'Sump Pump', 'Gas Line', 'Leak Detection', 'Backflow Prevention', 'Emergency Plumbing'], keywords: ['plumber', 'pipes', 'water', 'drain', 'leak'] },
    { name: 'Electrical', icon: '⚡', subcategories: ['Wiring', 'Rewiring', 'Panel Upgrade', 'Circuit Breaker', 'Lighting Installation', 'Ceiling Fan Installation', 'Outlet Installation', 'Outlet Repair', 'Switch Installation', 'Generator Installation', 'Generator Repair', 'EV Charger Installation', 'Smoke Detector', 'Security Lighting', 'Landscape Lighting', 'Recessed Lighting', 'Chandelier Installation', 'Electrical Inspection', 'Emergency Electrical'], keywords: ['electrician', 'power', 'lights', 'wires'] },
    { name: 'HVAC', icon: '❄️', subcategories: ['AC Repair', 'AC Installation', 'AC Maintenance', 'Heating Repair', 'Heating Installation', 'Furnace Repair', 'Furnace Installation', 'Heat Pump', 'Duct Cleaning', 'Duct Repair', 'Duct Installation', 'Thermostat Installation', 'Smart Thermostat', 'Mini Split', 'Central Air', 'Boiler Repair', 'Boiler Installation', 'Radiant Heating', 'Ventilation', 'Indoor Air Quality', 'Emergency HVAC'], keywords: ['air conditioning', 'heating', 'cooling', 'furnace', 'ventilation'] },
    { name: 'Roofing', icon: '🏠', subcategories: ['Roof Repair', 'Roof Replacement', 'Roof Installation', 'Roof Inspection', 'Shingle Repair', 'Shingle Replacement', 'Metal Roofing', 'Flat Roof', 'Tile Roofing', 'Slate Roofing', 'Gutter Installation', 'Gutter Repair', 'Gutter Cleaning', 'Downspout', 'Skylight Installation', 'Skylight Repair', 'Chimney Repair', 'Flashing Repair', 'Roof Coating', 'Emergency Roofing'], keywords: ['roofer', 'shingles', 'gutters', 'leak'] },
    { name: 'Landscaping', icon: '🌳', subcategories: ['Lawn Care', 'Lawn Mowing', 'Lawn Fertilization', 'Lawn Aeration', 'Lawn Seeding', 'Sod Installation', 'Tree Trimming', 'Tree Removal', 'Stump Removal', 'Shrub Trimming', 'Hedge Trimming', 'Mulching', 'Irrigation Installation', 'Irrigation Repair', 'Sprinkler System', 'Landscape Design', 'Hardscaping', 'Patio Installation', 'Retaining Wall', 'Outdoor Lighting', 'Drainage', 'Snow Removal', 'Leaf Removal'], keywords: ['lawn', 'yard', 'garden', 'trees', 'grass'] },
    { name: 'Cleaning', icon: '🧹', subcategories: ['House Cleaning', 'Deep Cleaning', 'Move-in Cleaning', 'Move-out Cleaning', 'Post-Construction Cleaning', 'Commercial Cleaning', 'Office Cleaning', 'Carpet Cleaning', 'Upholstery Cleaning', 'Window Cleaning', 'Pressure Washing', 'Power Washing', 'Gutter Cleaning', 'Dryer Vent Cleaning', 'Air Duct Cleaning', 'Tile & Grout Cleaning', 'Hardwood Floor Cleaning', 'Maid Service', 'Janitorial', 'Disinfection', 'Hoarding Cleanup'], keywords: ['cleaner', 'maid', 'janitorial', 'housekeeping'] },
    { name: 'Painting', icon: '🎨', subcategories: ['Interior Painting', 'Exterior Painting', 'Cabinet Painting', 'Cabinet Refinishing', 'Deck Staining', 'Fence Staining', 'Wallpaper Installation', 'Wallpaper Removal', 'Drywall Repair', 'Drywall Texture', 'Popcorn Ceiling Removal', 'Trim Painting', 'Door Painting', 'Garage Floor Coating', 'Epoxy Flooring', 'Commercial Painting', 'Pressure Washing', 'Color Consultation'], keywords: ['painter', 'staining', 'wallpaper', 'drywall'] },
    { name: 'Handyman', icon: '🔨', subcategories: ['General Repairs', 'Furniture Assembly', 'TV Mounting', 'Shelf Installation', 'Picture Hanging', 'Drywall Repair', 'Drywall Patching', 'Door Repair', 'Door Installation', 'Window Repair', 'Caulking', 'Weatherstripping', 'Minor Plumbing', 'Minor Electrical', 'Deck Repair', 'Fence Repair', 'Gate Repair', 'Tile Repair', 'Grout Repair', 'Carpentry', 'Trim Work', 'Crown Molding', 'Baseboard Installation'], keywords: ['repairs', 'fix', 'install', 'mount'] },
    { name: 'Flooring', icon: '🪵', subcategories: ['Hardwood Installation', 'Hardwood Refinishing', 'Hardwood Repair', 'Laminate Installation', 'Vinyl Installation', 'LVP Installation', 'Tile Installation', 'Tile Repair', 'Carpet Installation', 'Carpet Repair', 'Carpet Stretching', 'Concrete Polishing', 'Epoxy Flooring', 'Stair Refinishing', 'Subfloor Repair', 'Floor Leveling', 'Baseboard Installation', 'Transition Installation'], keywords: ['floors', 'hardwood', 'tile', 'carpet', 'vinyl'] },
    
    // Specialty Trades
    { name: 'Pest Control', icon: '🐜', subcategories: ['Termite Treatment', 'Termite Inspection', 'Rodent Control', 'Mouse Control', 'Rat Control', 'Ant Control', 'Cockroach Control', 'Bed Bug Treatment', 'Mosquito Control', 'Wasp Removal', 'Bee Removal', 'Spider Control', 'Flea Treatment', 'Wildlife Removal', 'Bird Control', 'Fumigation', 'Preventive Treatment', 'Commercial Pest Control'], keywords: ['exterminator', 'bugs', 'insects', 'rodents'] },
    { name: 'Pool & Spa', icon: '🏊', subcategories: ['Pool Cleaning', 'Pool Maintenance', 'Pool Repair', 'Pool Installation', 'Pool Remodeling', 'Pool Resurfacing', 'Pool Equipment Repair', 'Pool Pump Repair', 'Pool Heater Repair', 'Pool Filter', 'Pool Opening', 'Pool Closing', 'Hot Tub Repair', 'Hot Tub Installation', 'Spa Maintenance', 'Pool Deck', 'Pool Fence', 'Pool Safety Cover'], keywords: ['swimming', 'spa', 'hot tub', 'jacuzzi'] },
    { name: 'Appliance Repair', icon: '🔌', subcategories: ['Washer Repair', 'Dryer Repair', 'Refrigerator Repair', 'Freezer Repair', 'Dishwasher Repair', 'Oven Repair', 'Stove Repair', 'Range Repair', 'Microwave Repair', 'Garbage Disposal Repair', 'Ice Maker Repair', 'Wine Cooler Repair', 'Trash Compactor', 'Range Hood Repair', 'Commercial Appliance'], keywords: ['appliances', 'washer', 'dryer', 'refrigerator'] },
    { name: 'Garage Door', icon: '🚗', subcategories: ['Garage Door Repair', 'Garage Door Installation', 'Garage Door Replacement', 'Garage Door Opener Repair', 'Garage Door Opener Installation', 'Spring Replacement', 'Cable Repair', 'Panel Replacement', 'Garage Door Maintenance', 'Commercial Garage Door', 'Emergency Garage Door'], keywords: ['garage', 'opener', 'spring'] },
    { name: 'Locksmith', icon: '🔐', subcategories: ['Lockout Service', 'Lock Rekey', 'Lock Installation', 'Lock Repair', 'Lock Replacement', 'Deadbolt Installation', 'Smart Lock Installation', 'Safe Opening', 'Safe Installation', 'Key Duplication', 'Master Key System', 'Commercial Locksmith', 'Auto Locksmith', 'Car Key Replacement', 'Transponder Key', 'Emergency Locksmith'], keywords: ['locks', 'keys', 'lockout', 'security'] },
    { name: 'Moving & Storage', icon: '📦', subcategories: ['Local Moving', 'Long Distance Moving', 'Interstate Moving', 'Commercial Moving', 'Office Moving', 'Packing Services', 'Unpacking Services', 'Furniture Moving', 'Piano Moving', 'Appliance Moving', 'Loading & Unloading', 'Storage', 'Junk Removal', 'Donation Pickup', 'Estate Cleanout'], keywords: ['movers', 'relocation', 'packing', 'storage'] },
    { name: 'Windows & Doors', icon: '🪟', subcategories: ['Window Installation', 'Window Replacement', 'Window Repair', 'Window Glass Repair', 'Window Screen Repair', 'Door Installation', 'Door Replacement', 'Door Repair', 'Storm Door', 'Screen Door', 'Patio Door', 'French Door', 'Sliding Door', 'Entry Door', 'Interior Door', 'Window Tinting', 'Window Film'], keywords: ['windows', 'doors', 'glass', 'screens'] },
    
    // Construction & Remodeling
    { name: 'General Contractor', icon: '🏗️', subcategories: ['Home Remodeling', 'Kitchen Remodel', 'Bathroom Remodel', 'Basement Finishing', 'Basement Remodel', 'Attic Conversion', 'Room Addition', 'Home Addition', 'Garage Conversion', 'ADU Construction', 'New Construction', 'Commercial Construction', 'Tenant Improvement', 'Demolition', 'Structural Repair'], keywords: ['contractor', 'remodel', 'renovation', 'construction'] },
    { name: 'Kitchen & Bath', icon: '🚿', subcategories: ['Kitchen Remodel', 'Kitchen Design', 'Cabinet Installation', 'Cabinet Refacing', 'Countertop Installation', 'Granite Countertops', 'Quartz Countertops', 'Backsplash Installation', 'Kitchen Island', 'Bathroom Remodel', 'Bathroom Design', 'Shower Installation', 'Bathtub Installation', 'Vanity Installation', 'Tile Installation', 'Bathroom Flooring'], keywords: ['kitchen', 'bathroom', 'cabinets', 'countertops'] },
    { name: 'Carpentry', icon: '🪚', subcategories: ['Custom Carpentry', 'Finish Carpentry', 'Rough Carpentry', 'Trim Work', 'Crown Molding', 'Baseboard Installation', 'Wainscoting', 'Built-in Shelving', 'Custom Closets', 'Deck Building', 'Deck Repair', 'Fence Building', 'Fence Repair', 'Pergola', 'Gazebo', 'Shed Building', 'Framing'], keywords: ['carpenter', 'woodwork', 'trim', 'deck'] },
    { name: 'Concrete & Masonry', icon: '🧱', subcategories: ['Concrete Pouring', 'Concrete Repair', 'Concrete Resurfacing', 'Stamped Concrete', 'Decorative Concrete', 'Driveway Installation', 'Driveway Repair', 'Sidewalk Installation', 'Sidewalk Repair', 'Patio Installation', 'Foundation Repair', 'Brick Work', 'Block Work', 'Stone Work', 'Retaining Wall', 'Chimney Repair', 'Tuckpointing', 'Stucco'], keywords: ['concrete', 'masonry', 'brick', 'stone', 'driveway'] },
    { name: 'Fencing', icon: '🏡', subcategories: ['Wood Fence', 'Vinyl Fence', 'Chain Link Fence', 'Aluminum Fence', 'Wrought Iron Fence', 'Privacy Fence', 'Fence Repair', 'Fence Staining', 'Gate Installation', 'Gate Repair', 'Automatic Gate', 'Commercial Fencing'], keywords: ['fence', 'gate', 'privacy'] },
    { name: 'Drywall', icon: '🏠', subcategories: ['Drywall Installation', 'Drywall Repair', 'Drywall Finishing', 'Drywall Taping', 'Drywall Texture', 'Popcorn Ceiling Removal', 'Ceiling Repair', 'Water Damage Repair', 'Hole Repair', 'Crack Repair'], keywords: ['drywall', 'sheetrock', 'plaster', 'ceiling'] },
    { name: 'Insulation', icon: '🏠', subcategories: ['Attic Insulation', 'Wall Insulation', 'Blown-in Insulation', 'Spray Foam Insulation', 'Batt Insulation', 'Crawl Space Insulation', 'Basement Insulation', 'Insulation Removal', 'Radiant Barrier', 'Weatherization'], keywords: ['insulation', 'energy efficiency', 'weatherization'] },
    
    // Specialty Services
    { name: 'Solar', icon: '☀️', subcategories: ['Solar Panel Installation', 'Solar Panel Repair', 'Solar Panel Cleaning', 'Solar Battery', 'Solar Inverter', 'Solar Consultation', 'Solar Financing', 'Commercial Solar'], keywords: ['solar', 'renewable', 'energy', 'panels'] },
    { name: 'Security Systems', icon: '🔒', subcategories: ['Security Camera Installation', 'Security System Installation', 'Alarm System', 'Smart Home Security', 'Access Control', 'Intercom System', 'Video Doorbell', 'Motion Sensors', 'Security Monitoring', 'Commercial Security'], keywords: ['security', 'cameras', 'alarm', 'surveillance'] },
    { name: 'Home Automation', icon: '🏠', subcategories: ['Smart Home Installation', 'Smart Thermostat', 'Smart Lighting', 'Smart Locks', 'Smart Speakers', 'Home Theater', 'Whole Home Audio', 'Network Setup', 'WiFi Installation', 'Structured Wiring'], keywords: ['smart home', 'automation', 'technology'] },
    { name: 'Chimney & Fireplace', icon: '🔥', subcategories: ['Chimney Cleaning', 'Chimney Inspection', 'Chimney Repair', 'Chimney Cap', 'Chimney Liner', 'Fireplace Repair', 'Fireplace Installation', 'Gas Fireplace', 'Wood Stove', 'Fireplace Insert'], keywords: ['chimney', 'fireplace', 'wood stove'] },
    { name: 'Septic & Sewer', icon: '🚽', subcategories: ['Septic Pumping', 'Septic Inspection', 'Septic Repair', 'Septic Installation', 'Septic Tank Replacement', 'Drain Field Repair', 'Sewer Line Repair', 'Sewer Line Replacement', 'Sewer Camera Inspection', 'Grease Trap'], keywords: ['septic', 'sewer', 'drain field'] },
    { name: 'Water Treatment', icon: '💧', subcategories: ['Water Softener', 'Water Filtration', 'Reverse Osmosis', 'Well Water Treatment', 'Water Testing', 'Water Heater', 'Tankless Water Heater', 'Water Purification'], keywords: ['water', 'filtration', 'softener', 'purification'] },
    { name: 'Foundation', icon: '🏠', subcategories: ['Foundation Repair', 'Foundation Inspection', 'Foundation Waterproofing', 'Basement Waterproofing', 'Crawl Space Repair', 'Crawl Space Encapsulation', 'Sump Pump', 'French Drain', 'Pier Installation', 'Underpinning'], keywords: ['foundation', 'basement', 'waterproofing', 'crawl space'] },
    { name: 'Mold & Asbestos', icon: '⚠️', subcategories: ['Mold Inspection', 'Mold Testing', 'Mold Remediation', 'Mold Removal', 'Asbestos Testing', 'Asbestos Removal', 'Lead Paint Testing', 'Lead Paint Removal', 'Air Quality Testing'], keywords: ['mold', 'asbestos', 'lead', 'remediation'] },
    { name: 'Restoration', icon: '🔧', subcategories: ['Water Damage Restoration', 'Fire Damage Restoration', 'Smoke Damage', 'Storm Damage', 'Flood Cleanup', 'Sewage Cleanup', 'Biohazard Cleanup', 'Odor Removal', 'Contents Restoration', 'Emergency Board Up'], keywords: ['restoration', 'damage', 'cleanup', 'emergency'] },
    
    // Outdoor & Exterior
    { name: 'Outdoor Living', icon: '🌳', subcategories: ['Deck Building', 'Patio Installation', 'Pergola', 'Gazebo', 'Outdoor Kitchen', 'Fire Pit', 'Outdoor Fireplace', 'Screened Porch', 'Sunroom', 'Awning', 'Shade Structure', 'Outdoor Lighting'], keywords: ['outdoor', 'patio', 'deck', 'pergola'] },
    { name: 'Siding', icon: '🏠', subcategories: ['Vinyl Siding', 'Fiber Cement Siding', 'Wood Siding', 'Aluminum Siding', 'Stucco', 'Stone Veneer', 'Brick Veneer', 'Siding Repair', 'Siding Painting', 'Soffit & Fascia'], keywords: ['siding', 'exterior', 'stucco'] },
    { name: 'Paving', icon: '🛣️', subcategories: ['Asphalt Paving', 'Asphalt Repair', 'Asphalt Sealing', 'Concrete Paving', 'Paver Installation', 'Paver Repair', 'Driveway Paving', 'Parking Lot', 'Striping'], keywords: ['paving', 'asphalt', 'driveway', 'parking lot'] },
    
    // Specialty Home Services
    { name: 'Interior Design', icon: '🎨', subcategories: ['Interior Design', 'Space Planning', 'Color Consultation', 'Furniture Selection', 'Window Treatments', 'Staging', 'Home Staging', 'Commercial Design', 'Kitchen Design', 'Bathroom Design'], keywords: ['design', 'decorator', 'staging'] },
    { name: 'Closet & Organization', icon: '👔', subcategories: ['Custom Closets', 'Closet Design', 'Closet Installation', 'Garage Organization', 'Pantry Organization', 'Home Organization', 'Professional Organizing', 'Shelving Systems'], keywords: ['closet', 'organization', 'storage'] },
    { name: 'Home Inspection', icon: '🔍', subcategories: ['Home Inspection', 'Pre-Purchase Inspection', 'Pre-Listing Inspection', 'New Construction Inspection', 'Radon Testing', 'Mold Inspection', 'Termite Inspection', 'Roof Inspection', 'Foundation Inspection', 'Sewer Scope'], keywords: ['inspection', 'inspector', 'home buyer'] },
    { name: 'Home Warranty', icon: '📋', subcategories: ['Home Warranty', 'Appliance Warranty', 'HVAC Warranty', 'Plumbing Warranty', 'Electrical Warranty'], keywords: ['warranty', 'protection', 'coverage'] },
  ],
  
  realtor: [
    { name: 'Residential Sales', icon: '🏡', subcategories: ['Single Family Homes', 'Condos', 'Townhouses', 'Luxury Homes', 'First-time Buyers', 'Move-up Buyers', 'Downsizing', 'Relocation', 'New Construction', 'Foreclosures', 'Short Sales', 'Estate Sales'], keywords: ['homes', 'houses', 'buying', 'selling'] },
    { name: 'Commercial Real Estate', icon: '🏢', subcategories: ['Office Space', 'Retail Space', 'Industrial', 'Warehouse', 'Multi-family', 'Investment Properties', 'Land', 'Development', 'Leasing', '1031 Exchange'], keywords: ['commercial', 'office', 'retail', 'investment'] },
    { name: 'Property Management', icon: '🔑', subcategories: ['Residential Management', 'Commercial Management', 'HOA Management', 'Vacation Rental Management', 'Tenant Screening', 'Rent Collection', 'Maintenance Coordination', 'Eviction Services', 'Property Inspections'], keywords: ['management', 'landlord', 'rental'] },
    { name: 'Rentals', icon: '📋', subcategories: ['Apartment Rentals', 'House Rentals', 'Condo Rentals', 'Townhouse Rentals', 'Short-term Rentals', 'Corporate Housing', 'Student Housing', 'Senior Housing', 'Luxury Rentals'], keywords: ['rent', 'lease', 'apartment'] },
    { name: 'Mortgage & Lending', icon: '🏦', subcategories: ['Mortgage Broker', 'Mortgage Lender', 'Refinancing', 'Home Equity', 'FHA Loans', 'VA Loans', 'Jumbo Loans', 'Investment Loans', 'Construction Loans'], keywords: ['mortgage', 'loan', 'financing'] },
    { name: 'Title & Escrow', icon: '📄', subcategories: ['Title Insurance', 'Title Search', 'Escrow Services', 'Closing Services', 'Settlement Services'], keywords: ['title', 'escrow', 'closing'] },
    { name: 'Appraisal', icon: '📊', subcategories: ['Residential Appraisal', 'Commercial Appraisal', 'Land Appraisal', 'Estate Appraisal', 'Divorce Appraisal', 'Tax Appeal', 'Pre-listing Appraisal'], keywords: ['appraisal', 'valuation', 'value'] },
  ],
  
  on_the_go: [
    { name: 'Food Truck', icon: '🚚', subcategories: ['Tacos', 'Mexican', 'BBQ', 'Asian Fusion', 'Thai', 'Chinese', 'Japanese', 'Korean', 'Mediterranean', 'Greek', 'Italian', 'Pizza', 'Burgers', 'Hot Dogs', 'Sandwiches', 'Seafood', 'Vegan', 'Desserts', 'Ice Cream', 'Coffee', 'Smoothies', 'Catering'], keywords: ['food', 'catering', 'events'] },
    { name: 'Mobile Pet Grooming', icon: '🐕', subcategories: ['Dog Grooming', 'Cat Grooming', 'Full Service Grooming', 'Bath & Brush', 'Nail Trimming', 'Ear Cleaning', 'Teeth Cleaning', 'De-shedding', 'Flea Treatment', 'Specialty Cuts', 'Show Grooming'], keywords: ['grooming', 'pets', 'dogs', 'cats'] },
    { name: 'Mobile Auto Detailing', icon: '🚗', subcategories: ['Full Detail', 'Interior Detail', 'Exterior Detail', 'Hand Wash', 'Wax & Polish', 'Ceramic Coating', 'Paint Correction', 'Headlight Restoration', 'Engine Cleaning', 'Odor Removal', 'Leather Conditioning', 'Boat Detailing', 'RV Detailing', 'Motorcycle Detailing'], keywords: ['detailing', 'car wash', 'auto'] },
    { name: 'Mobile Mechanic', icon: '🔧', subcategories: ['Oil Change', 'Brake Service', 'Battery Replacement', 'Tire Service', 'Diagnostics', 'Check Engine Light', 'AC Service', 'Tune Up', 'Belt Replacement', 'Starter Repair', 'Alternator Repair', 'Fuel System', 'Cooling System', 'Pre-purchase Inspection'], keywords: ['mechanic', 'auto repair', 'car'] },
    { name: 'Mobile Notary', icon: '📝', subcategories: ['Loan Signing', 'General Notary', 'Apostille', 'I-9 Verification', 'Wills & Trusts', 'Power of Attorney', 'Real Estate Documents', 'Medical Documents', 'Immigration Documents', 'Corporate Documents'], keywords: ['notary', 'signing', 'documents'] },
    { name: 'Mobile Car Wash', icon: '🚿', subcategories: ['Exterior Wash', 'Interior Cleaning', 'Full Service Wash', 'Waterless Wash', 'Eco-Friendly Wash', 'Fleet Washing', 'Pressure Washing'], keywords: ['car wash', 'cleaning', 'auto'] },
    { name: 'Mobile Tire Service', icon: '🛞', subcategories: ['Tire Change', 'Flat Repair', 'Tire Rotation', 'Tire Balancing', 'Tire Installation', 'Emergency Tire Service', 'Fleet Service'], keywords: ['tires', 'flat', 'roadside'] },
    { name: 'Mobile Windshield Repair', icon: '🚗', subcategories: ['Chip Repair', 'Crack Repair', 'Windshield Replacement', 'Side Window Replacement', 'Rear Window Replacement'], keywords: ['windshield', 'glass', 'auto glass'] },
    { name: 'Mobile Massage', icon: '💆', subcategories: ['Swedish Massage', 'Deep Tissue', 'Sports Massage', 'Prenatal Massage', 'Couples Massage', 'Chair Massage', 'Corporate Massage', 'Event Massage'], keywords: ['massage', 'spa', 'wellness'] },
    { name: 'Mobile Beauty', icon: '💅', subcategories: ['Hair Styling', 'Makeup', 'Bridal Hair & Makeup', 'Manicure', 'Pedicure', 'Waxing', 'Lash Extensions', 'Spray Tan', 'Airbrush Makeup'], keywords: ['beauty', 'hair', 'makeup', 'nails'] },
    { name: 'Mobile Photography', icon: '📸', subcategories: ['Portrait Photography', 'Family Photography', 'Event Photography', 'Wedding Photography', 'Real Estate Photography', 'Product Photography', 'Headshots', 'Pet Photography'], keywords: ['photography', 'photos', 'photographer'] },
    { name: 'Mobile DJ', icon: '🎵', subcategories: ['Wedding DJ', 'Party DJ', 'Corporate Events', 'School Events', 'Club Events', 'Karaoke', 'MC Services', 'Lighting'], keywords: ['DJ', 'music', 'entertainment'] },
    { name: 'Mobile Fitness', icon: '💪', subcategories: ['Personal Training', 'Group Fitness', 'Yoga', 'Pilates', 'Boot Camp', 'Senior Fitness', 'Post-Rehab', 'Sports Training', 'Weight Loss'], keywords: ['fitness', 'trainer', 'workout'] },
    { name: 'Mobile Tutoring', icon: '📚', subcategories: ['Math Tutoring', 'Science Tutoring', 'English Tutoring', 'Test Prep', 'SAT/ACT Prep', 'College Counseling', 'Music Lessons', 'Language Lessons', 'Special Needs'], keywords: ['tutoring', 'education', 'lessons'] },
    { name: 'Mobile Tech Support', icon: '💻', subcategories: ['Computer Repair', 'Phone Repair', 'Tablet Repair', 'Virus Removal', 'Data Recovery', 'Network Setup', 'Smart Home Setup', 'Tech Training'], keywords: ['tech', 'computer', 'IT', 'repair'] },
  ],
};

// Flatten all categories for search
export function getAllCategories(providerType: string): ServiceCategory[] {
  return SERVICE_CATEGORIES[providerType as keyof AllCategories] || [];
}

// Search categories by name, subcategory, or keyword
export function searchCategories(providerType: string, query: string): ServiceCategory[] {
  const categories = getAllCategories(providerType);
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) return categories;
  
  return categories.filter(cat => {
    // Match category name
    if (cat.name.toLowerCase().includes(lowerQuery)) return true;
    
    // Match subcategories
    if (cat.subcategories.some(sub => sub.toLowerCase().includes(lowerQuery))) return true;
    
    // Match keywords
    if (cat.keywords?.some(kw => kw.toLowerCase().includes(lowerQuery))) return true;
    
    return false;
  });
}

// Get featured categories for a provider type
export function getFeaturedCategories(providerType: string): ServiceCategory[] {
  const allCats = getAllCategories(providerType);
  const featured = FEATURED_CATEGORIES[providerType as keyof typeof FEATURED_CATEGORIES] || [];
  
  return allCats.filter(cat => featured.includes(cat.name));
}
