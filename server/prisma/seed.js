const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding realistic Indian architecture & interior design portal data...');

  // Clear existing data cleanly
  await prisma.inquiryMessage.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.designerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@architectportal.com',
      password: defaultPassword,
      name: 'Pooja Sharma',
      role: 'ADMIN',
      phone: '+91 98200 11223',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    }
  });

  // 2. Clients
  const clientUser1 = await prisma.user.create({
    data: {
      email: 'client@architectportal.com',
      password: defaultPassword,
      name: 'Amit & Neha Verma',
      role: 'CLIENT',
      phone: '+91 98201 55432',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    }
  });

  const clientUser2 = await prisma.user.create({
    data: {
      email: 'vikram.mehta@gmail.com',
      password: defaultPassword,
      name: 'Vikram Mehta',
      role: 'CLIENT',
      phone: '+91 98190 44321',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    }
  });

  // 3. Designers / Architects
  const designersData = [
    {
      user: {
        email: 'designer@architectportal.com',
        name: 'Ar. Rajesh Nair',
        phone: '+91 98470 22345',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Studio Vismaya Architects',
        tagline: 'Climate-responsive residential architecture and sustainable homes',
        bio: 'Established in 2011, Studio Vismaya specializes in contemporary residential architecture that balances tropical climate needs with clean minimalist aesthetics. Our work highlights courtyard ventilation, local laterite stone, teak woodwork, and open indoor-outdoor living spaces.',
        location: 'Bangalore & Kochi',
        experienceYears: 15,
        budgetTier: '₹50L - ₹1.5 Cr',
        specializations: 'Residential Architecture, Villa Construction, Landscape Planning',
        designStyles: 'Contemporary, Tropical Modern, Minimalist',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'Council of Architecture (CA/2009/44120), IIA Fellow',
        website: 'https://studiovismaya.in',
        phone: '+91 98470 22345',
        featured: true,
        averageRating: 4.9,
        reviewCount: 16
      },
      projects: [
        {
          title: 'The Courtyard Residence at Whitefield',
          category: 'Residential Villa',
          style: 'Tropical Modern',
          description: 'A 3,800 sq.ft independent villa centered around a skylit courtyard with an indoor fishpond and vertical green wall. Built using wire-cut exposed brickwork, Kota stone flooring, and energy-efficient cross ventilation.',
          location: 'Whitefield, Bangalore',
          completionYear: '2024',
          areaSqFt: '3,800 sq.ft',
          budgetRange: '₹85 Lakhs',
          thumbnail: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        },
        {
          title: 'Periyar Riverfront Villa',
          category: 'Vacation Home',
          style: 'Contemporary',
          description: 'A 4,500 sq.ft riverfront home with double-height glass living areas, cantilevered verandahs, and laterite stone retaining walls. Features locally sourced teakwood ceiling paneling and rain-harvesting retention ponds.',
          location: 'Aluva, Kochi',
          completionYear: '2023',
          areaSqFt: '4,500 sq.ft',
          budgetRange: '₹1.2 Crore',
          thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        }
      ]
    },
    {
      user: {
        email: 'ananya@kulkarnidesign.com',
        name: 'Ar. Ananya Kulkarni',
        phone: '+91 98205 33411',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Kulkarni Interior Design Studio',
        tagline: 'Modern residential interiors and apartment transformations',
        bio: 'Based in Bandra, we deliver turn-key residential interior design for apartments, duplexes, and penthouses. We manage space planning, modular kitchen design, lighting layouts, and custom carpentry with full execution supervision.',
        location: 'Bandra West, Mumbai',
        experienceYears: 10,
        budgetTier: '₹25L - ₹75L',
        specializations: 'Apartment Interiors, Modular Kitchens, Turn-key Renovation',
        designStyles: 'Modern Minimalist, Warm Contemporary',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'Council of Architecture (CA/2014/62891), IIID Member (LM-4180)',
        website: 'https://kulkarnidesign.in',
        phone: '+91 98205 33411',
        featured: true,
        averageRating: 4.8,
        reviewCount: 22
      },
      projects: [
        {
          title: 'Sea-Facing 3BHK Apartment Overhaul',
          category: 'Apartment Interior',
          style: 'Modern Minimalist',
          description: 'Complete interior renovation of a 2,200 sq.ft sea-facing apartment at Worli. Included Italian Statuario marble floors, fluted oak wall paneling, automated profile lighting, and a customized acrylic-finish island kitchen.',
          location: 'Worli Sea Face, Mumbai',
          completionYear: '2024',
          areaSqFt: '2,200 sq.ft',
          budgetRange: '₹42 Lakhs',
          thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        },
        {
          title: 'Bandra Duplex Penthouse',
          category: 'Penthouse Interior',
          style: 'Warm Contemporary',
          description: 'A 3,100 sq.ft duplex penthouse featuring smoked veneer paneling, brass inlay details, a custom wooden floating staircase, and an open terrace lounge with weather-resistant deck flooring.',
          location: 'Pali Hill, Bandra, Mumbai',
          completionYear: '2023',
          areaSqFt: '3,100 sq.ft',
          budgetRange: '₹65 Lakhs',
          thumbnail: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        }
      ]
    },
    {
      user: {
        email: 'siddharth@atelierjoshi.com',
        name: 'Ar. Siddharth Joshi',
        phone: '+91 98450 77123',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Atelier Joshi Architects',
        tagline: 'Commercial offices, creative studios and adaptive building reuse',
        bio: 'Focuses on functional modern office architecture and retail interiors. We create healthy workspaces with natural illumination, sound acoustics, and durable industrial materials like steel, glass, and concrete.',
        location: 'Indiranagar, Bangalore',
        experienceYears: 12,
        budgetTier: '₹40L - ₹1.8 Cr',
        specializations: 'Commercial Offices, Studio Spaces, Retail Architecture',
        designStyles: 'Industrial, Modern Functional, Scandinavian',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'Council of Architecture (CA/2012/55320), IGBC AP',
        website: 'https://atelierjoshi.com',
        phone: '+91 98450 77123',
        featured: true,
        averageRating: 4.7,
        reviewCount: 14
      },
      projects: [
        {
          title: 'Koramangala Tech Hub',
          category: 'Commercial Office',
          style: 'Industrial',
          description: 'A 6,500 sq.ft office floor designed for 70 workstations. Features exposed black ceiling cable trays, micro-concrete floors, modular glass meeting pods, and ergonomic lighting.',
          location: 'Koramangala, Bangalore',
          completionYear: '2024',
          areaSqFt: '6,500 sq.ft',
          budgetRange: '₹75 Lakhs',
          thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        }
      ]
    },
    {
      user: {
        email: 'rohan@studiocasagoa.com',
        name: 'Ar. Rohan Deshmukh',
        phone: '+91 98221 44090',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Studio Casa Goa',
        tagline: 'Goan Portuguese villas, holiday homes and heritage restorations',
        bio: 'Specialists in restoring ancestral Goan homes and constructing contemporary holiday villas. We retain classical arched verandahs and Mangalore roof tiles while adding modern infinity pools and open-plan kitchen lounges.',
        location: 'Assagao & Panaji, Goa',
        experienceYears: 11,
        budgetTier: '₹60L - ₹2.5 Cr',
        specializations: 'Holiday Villas, Heritage Restoration, Vernacular Architecture',
        designStyles: 'Goan Vernacular, Mediterranean, Contemporary',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'Council of Architecture (CA/2013/59480)',
        website: 'https://studiocasagoa.com',
        phone: '+91 98221 44090',
        featured: true,
        averageRating: 4.9,
        reviewCount: 19
      },
      projects: [
        {
          title: 'Villa de Palma at Assagao',
          category: 'Holiday Villa',
          style: 'Goan Vernacular',
          description: 'A 4,200 sq.ft restored 4-bedroom villa with red oxide flooring, exposed basalt stone masonry, teakwood rafters, and an attached outdoor plunge pool flanked by frangipani trees.',
          location: 'Assagao, North Goa',
          completionYear: '2024',
          areaSqFt: '4,200 sq.ft',
          budgetRange: '₹1.1 Crore',
          thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        }
      ]
    },
    {
      user: {
        email: 'meera@prakritidesign.in',
        name: 'Ar. Meera Sengupta',
        phone: '+91 98110 99432',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Prakriti Design Collaborative',
        tagline: 'Sustainable farmhouses and energy-efficient homes',
        bio: 'Working out of Hauz Khas, Delhi. We design courtyard homes, organic farmhouses, and net-zero energy residences with natural earth cooling, rainwater collection, and solar orientation.',
        location: 'Hauz Khas, New Delhi & Gurgaon',
        experienceYears: 9,
        budgetTier: '₹50L - ₹2 Cr',
        specializations: 'Sustainable Architecture, Farmhouses, Villa Planning',
        designStyles: 'Modern Minimalist, Biophilic, Traditional Indian',
        avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'Council of Architecture (CA/2015/71204), IGBC Member',
        website: 'https://prakritidesign.in',
        phone: '+91 98110 99432',
        featured: false,
        averageRating: 4.9,
        reviewCount: 15
      },
      projects: [
        {
          title: 'The Terracotta Courtyard House',
          category: 'Residential Villa',
          style: 'Biophilic',
          description: 'A 5,000 sq.ft residence in Gurgaon with brick jali exterior screens, internal courtyards, solar water heaters, and double-insulated cavity walls for summer heat resistance.',
          location: 'Sohna Road, Gurgaon',
          completionYear: '2024',
          areaSqFt: '5,000 sq.ft',
          budgetRange: '₹95 Lakhs',
          thumbnail: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        }
      ]
    }
  ];

  let primaryDesigner = null;

  for (const item of designersData) {
    const user = await prisma.user.create({
      data: {
        email: item.user.email,
        password: defaultPassword,
        name: item.user.name,
        role: 'DESIGNER',
        phone: item.user.phone,
        avatar: item.user.avatar
      }
    });

    const profile = await prisma.designerProfile.create({
      data: {
        userId: user.id,
        ...item.profile
      }
    });

    if (item.user.email === 'designer@architectportal.com') {
      primaryDesigner = profile;
    }

    for (const proj of item.projects) {
      await prisma.project.create({
        data: {
          designerId: profile.id,
          ...proj
        }
      });
    }
  }

  // 4. Inquiries
  if (primaryDesigner) {
    const inquiry1 = await prisma.inquiry.create({
      data: {
        clientId: clientUser1.id,
        designerId: primaryDesigner.id,
        projectTitle: 'Construction of 4BHK Villa in Whitefield Extension',
        projectCategory: 'Residential Architecture',
        location: 'Whitefield, Bangalore',
        budgetRange: '₹75 Lakhs - ₹1 Crore',
        targetTimeline: '8 - 10 Months',
        scopeDescription: 'We have a 40x60 plot (2,400 sq.ft land) in Whitefield Extension. We are looking for an architectural firm to handle complete architectural drawings, structural engineering consultancy, and site supervision. We prefer an open courtyard concept with ample natural daylight and cross-ventilation.',
        status: 'ACCEPTED',
        messages: {
          create: [
            {
              senderId: clientUser1.id,
              messageText: 'Hello Ar. Rajesh, we saw your Courtyard Residence project in Whitefield and liked the plan. We have a 40x60 plot nearby and want to discuss architectural planning.'
            },
            {
              senderId: primaryDesigner.userId,
              messageText: 'Hello Amit and Neha. Thank you for getting in touch. 40x60 gives good frontage for a central courtyard layout. Can you share the site survey map and setback requirements so we can prepare a preliminary zoning sketch?'
            },
            {
              senderId: clientUser1.id,
              messageText: 'Yes, we will email the plot deed and survey coordinates today. Can we meet this Saturday at your studio to discuss room layouts?'
            }
          ]
        }
      }
    });

    const inquiry2 = await prisma.inquiry.create({
      data: {
        clientId: clientUser2.id,
        designerId: primaryDesigner.id,
        projectTitle: 'Holiday Cottage Architecture in Wayanad',
        projectCategory: 'Vacation Home',
        location: 'Wayanad, Kerala',
        budgetRange: '₹40 Lakhs - ₹60 Lakhs',
        targetTimeline: '6 Months',
        scopeDescription: 'Looking to build a 2-bedroom eco-cottage on a 1-acre coffee plantation. Slope terrain with hill views. Looking for low-impact stone and timber construction.',
        status: 'UNDER_REVIEW',
        messages: {
          create: [
            {
              senderId: clientUser2.id,
              messageText: 'Hi Rajesh, are you taking up hillside cottage projects in Wayanad this season? Looking for passive cooling and minimal earth cutting.'
            }
          ]
        }
      }
    });

    // 5. Reviews
    await prisma.review.create({
      data: {
        designerId: primaryDesigner.id,
        clientId: clientUser1.id,
        rating: 5,
        reviewTitle: 'Thorough architectural drawings and site coordination',
        comment: 'Ar. Rajesh and his team were very systematic with the municipal sanction drawings, structural details, and material selection. The courtyard keeps the entire ground floor cool throughout the summer.',
        projectCategory: 'Residential Villa'
      }
    });

    await prisma.review.create({
      data: {
        designerId: primaryDesigner.id,
        clientId: clientUser2.id,
        rating: 5,
        reviewTitle: 'Transparent estimates and excellent spatial planning',
        comment: 'No hidden costs. Every drawing revision was delivered on schedule and the 3D renders matched the final site execution accurately.',
        projectCategory: 'Residential Architecture'
      }
    });
  }

  console.log('Seeding finished successfully with realistic data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
