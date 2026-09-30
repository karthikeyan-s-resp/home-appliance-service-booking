const User = require('../models/User');
const Appliance = require('../models/Appliance');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

const seedHelper = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return; // already seeded

    console.log('[Seed] Database is empty. Seeding initial accounts and catalog...');

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'Admin@123',
      phone: '+1 555-0100',
      address: 'Appliance Hub HQ, Suite 100',
      role: 'admin'
    });

    const tech1 = await User.create({
      name: 'John Miller (Senior HVAC Tech)',
      email: 'technician1@example.com',
      password: 'Admin@123',
      phone: '+1 555-0101',
      address: 'North District Service Station',
      role: 'technician'
    });

    const tech2 = await User.create({
      name: 'Sarah Davis (Appliance Specialist)',
      email: 'technician2@example.com',
      password: 'Admin@123',
      phone: '+1 555-0102',
      address: 'South Bay Operations',
      role: 'technician'
    });

    const customer = await User.create({
      name: 'David Johnson',
      email: 'customer@example.com',
      password: 'Customer@123',
      phone: '+1 555-0199',
      address: '742 Evergreen Terrace, Springfield',
      role: 'customer'
    });

    const appliancesData = [
      {
        name: 'Air Conditioner',
        description: 'Split and window AC cooling, gas filling, coil servicing, and installation.',
        icon: 'Wind',
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80',
        services: [
          { name: 'AC General Service', description: 'Deep foam cleaning of indoor & outdoor units, filter wash, and performance check.', price: 59, estimatedDuration: '1.5 hours' },
          { name: 'AC Repair & Diagnostics', description: 'Fix cooling issues, water leakage, sensor errors, and electrical circuit problems.', price: 79, estimatedDuration: '2 hours' },
          { name: 'AC Gas Filling', description: 'Complete refrigerant top-up/refill with leak testing for R32/R410A/R22.', price: 99, estimatedDuration: '1.5 hours' }
        ]
      },
      {
        name: 'Refrigerator',
        description: 'Single, double door, and side-by-side refrigerator repair, compressor, and thermostat fix.',
        icon: 'Refrigerator',
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80',
        services: [
          { name: 'Refrigerator Repair', description: 'Repair cooling coil, thermostat issue, compressor troubleshooting, or door seal repair.', price: 69, estimatedDuration: '2 hours' },
          { name: 'Refrigerator General Service', description: 'Condenser coil cleaning, drainage clearing, temperature calibration, and defroster check.', price: 49, estimatedDuration: '1 hour' }
        ]
      },
      {
        name: 'Washing Machine',
        description: 'Top-load and front-load washing machine repairs, drum replacement, and motor maintenance.',
        icon: 'RotateCw',
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
        services: [
          { name: 'Washing Machine Repair', description: 'Fix spinning failure, water drainage blockage, loud noise, and control board issues.', price: 65, estimatedDuration: '2 hours' },
          { name: 'Washing Machine Installation', description: 'Unboxing, inlet/outlet hose connection, leveling, and initial test spin cycle.', price: 45, estimatedDuration: '1 hour' }
        ]
      },
      {
        name: 'Television',
        description: 'Smart LED, OLED, 4K TV wall-mounting, display repair, sound faults, and motherboard fix.',
        icon: 'Tv',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
        services: [
          { name: 'TV Repair', description: 'Troubleshoot screen flickering, back-light issues, audio problems, or HDMI ports repair.', price: 75, estimatedDuration: '2 hours' },
          { name: 'TV Installation & Wall Mounting', description: 'Secure wall bracket mounting, cable management, and smart TV connectivity setup.', price: 39, estimatedDuration: '1 hour' }
        ]
      },
      {
        name: 'Microwave Oven',
        description: 'Convection and grill microwave repair, magnetron, heating, and keypad repairs.',
        icon: 'Flame',
        image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=600&q=80',
        services: [
          { name: 'Microwave Repair', description: 'Fix non-heating issue, spark issues, rotating plate motor, and touch pad buttons.', price: 49, estimatedDuration: '1.5 hours' }
        ]
      },
      {
        name: 'Water Heater',
        description: 'Instant and storage geyser repairs, heating element replacement, thermostat and leak fix.',
        icon: 'Droplets',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
        services: [
          { name: 'Water Heater Repair', description: 'Replacement of burned heating elements, thermostat check, valve leak repairs.', price: 55, estimatedDuration: '1.5 hours' }
        ]
      },
      {
        name: 'Other Appliances',
        description: 'Chimney, air purifier, dishwashers, and miscellaneous domestic electrical appliances.',
        icon: 'Cpu',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        services: [
          { name: 'General Appliance Inspection & Tune-up', description: 'Comprehensive electrical diagnostics and component testing for household equipment.', price: 40, estimatedDuration: '1 hour' }
        ]
      }
    ];

    let createdServices = [];

    for (const appItem of appliancesData) {
      const appliance = await Appliance.create({
        name: appItem.name,
        description: appItem.description,
        icon: appItem.icon,
        image: appItem.image,
        isActive: true
      });

      for (const srvItem of appItem.services) {
        const service = await Service.create({
          appliance: appliance._id,
          name: srvItem.name,
          description: srvItem.description,
          price: srvItem.price,
          estimatedDuration: srvItem.estimatedDuration,
          isActive: true
        });
        createdServices.push({ service, appliance });
      }
    }

    // Bookings
    await Booking.create({
      customer: customer._id,
      technician: null,
      appliance: createdServices[0].appliance._id,
      service: createdServices[0].service._id,
      problemDescription: 'AC blowing room-temperature air instead of cold air. Filter cleaned already.',
      preferredDate: '2026-10-05',
      preferredTime: '10:00 AM - 12:00 PM',
      address: '742 Evergreen Terrace, Springfield',
      phone: '+1 555-0199',
      status: 'Pending'
    });

    await Booking.create({
      customer: customer._id,
      technician: tech1._id,
      appliance: createdServices[3].appliance._id,
      service: createdServices[3].service._id,
      problemDescription: 'Freezer is working fine but lower fridge compartment is warm.',
      preferredDate: '2026-10-06',
      preferredTime: '02:00 PM - 04:00 PM',
      address: '742 Evergreen Terrace, Springfield',
      phone: '+1 555-0199',
      status: 'Assigned'
    });

    await Booking.create({
      customer: customer._id,
      technician: tech2._id,
      appliance: createdServices[5].appliance._id,
      service: createdServices[5].service._id,
      problemDescription: 'Front loader makes loud rumbling sounds during high speed spin.',
      preferredDate: '2026-10-02',
      preferredTime: '11:00 AM - 01:00 PM',
      address: '742 Evergreen Terrace, Springfield',
      phone: '+1 555-0199',
      status: 'In Progress',
      serviceNotes: 'Inspected drum bearings. Drum pulley and belt replacement underway.'
    });

    await Booking.create({
      customer: customer._id,
      technician: tech1._id,
      appliance: createdServices[7].appliance._id,
      service: createdServices[7].service._id,
      problemDescription: 'New 65-inch Smart TV needs secure bracket wall mounting and wiring.',
      preferredDate: '2026-09-25',
      preferredTime: '04:00 PM - 06:00 PM',
      address: '742 Evergreen Terrace, Springfield',
      phone: '+1 555-0199',
      status: 'Completed',
      serviceNotes: 'Successfully installed with heavy duty wall mount. All HDMI ports and Wi-Fi tested.'
    });

    console.log('[Seed] Auto-seeding finished successfully!');
  } catch (error) {
    console.error('[Seed] Auto-seed error:', error);
  }
};

module.exports = seedHelper;
