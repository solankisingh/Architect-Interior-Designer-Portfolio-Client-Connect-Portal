const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Architect & Interior Designer Portal database...');

  // Clear existing records in correct relation order
  await prisma.inquiryMessage.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.designerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Create Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@atelier.com',
      password: defaultPassword,
      name: 'Elena Vance (Curator)',
      role: 'ADMIN',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    }
  });

  // 2. Create Primary Client
  const clientUser = await prisma.user.create({
    data: {
      email: 'client@atelier.com',
      password: defaultPassword,
      name: 'Aarav & Meera Kapoor',
      role: 'CLIENT',
      phone: '+91 98201 44521',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    }
  });

  // Additional Client
  const clientUser2 = await prisma.user.create({
    data: {
      email: 'rohan.tech@urbanliving.com',
      password: defaultPassword,
      name: 'Rohan Malhotra',
      role: 'CLIENT',
      phone: '+91 98112 88471',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    }
  });

  // 3. Create Featured Designers
  const designersData = [
    {
      user: {
        email: 'designer@atelier.com',
        name: 'Ar. Vikramaditya Singhania',
        phone: '+91 99204 18274',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Singhania & Partners Atelier',
        tagline: 'Sculptural Modernism & Harmonious Living',
        bio: 'Council of Architecture (COA) certified firm with 14 years of mastery in bespoke residential villas, cliffside retreats, and sustainable luxury interiors. We sculpt spaces where natural daylight, textured travertine, and warm cedar wood coalesce.',
        location: 'Mumbai & Goa, India',
        experienceYears: 14,
        budgetTier: '$$$$',
        specializations: 'Residential Architecture, Luxury Penthouse Interiors, Landscape Architecture',
        designStyles: 'Modern Minimalist, Biophilic Contemporary, Mediterranean Warmth',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'Council of Architecture (CA/2010/48211), Fellow IIID, IFI Gold Member',
        website: 'https://singhaniapartners.design',
        phone: '+91 99204 18274',
        featured: true,
        averageRating: 4.9,
        reviewCount: 18
      },
      projects: [
        {
          title: 'The Solarium Cliff Villa',
          category: 'Residential',
          style: 'Modern Minimalist',
          description: 'A cantilevered 6,800 sq ft oceanfront sanctuary in North Goa. Features floor-to-ceiling glass pavilions, floating concrete slabs, an infinity saltwater pool, and native laterite stone walls that seamlessly merge indoor and outdoor realms.',
          location: 'Vagator, Goa',
          completionYear: '2025',
          areaSqFt: '6,800 sq ft',
          budgetRange: '$450,000 - $600,000',
          thumbnail: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        },
        {
          title: 'Sky Pavilion Penthouse',
          category: 'Residential',
          style: 'Biophilic Contemporary',
          description: 'A 4,200 sq ft duplex penthouse designed around internal courtyards, fluted travertine columns, custom brass joinery, and an integrated indoor Zen garden with automated microclimate misting.',
          location: 'Worli Sea Face, Mumbai',
          completionYear: '2024',
          areaSqFt: '4,200 sq ft',
          budgetRange: '$280,000 - $350,000',
          thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        },
        {
          title: 'Sirocco Courtyard Residence',
          category: 'Residential',
          style: 'Mediterranean Warmth',
          description: 'Earth-toned lime plaster finishes, terracotta brick archways, sunken living lounges, and olive tree centerpieces that bring European riviera tranquility to contemporary urban living.',
          location: 'Alibaug',
          completionYear: '2023',
          areaSqFt: '5,100 sq ft',
          budgetRange: '$320,000 - $400,000',
          thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: false
        }
      ]
    },
    {
      user: {
        email: 'maya@studiokhora.com',
        name: 'Maya Lin-Fernandez',
        phone: '+1 (415) 892-1049',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Studio Khora Interiors',
        tagline: 'Japandi & Scandinavian Spatial Calm',
        bio: 'Focusing on reductionist spatial aesthetics, tactile natural materials, and biophilic ergonomics. We craft timeless residential spaces rooted in Japanese Wabi-Sabi and Scandinavian Hygge principles.',
        location: 'San Francisco, CA & Kyoto',
        experienceYears: 10,
        budgetTier: '$$$',
        specializations: 'Interior Design, Space Planning, Custom Bespoke Furniture, Lighting Design',
        designStyles: 'Scandinavian, Modern Minimalist, Japandi',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'AIA Allied Member, ASID Certified, IFI Registered',
        website: 'https://studiokhoradesign.com',
        phone: '+1 (415) 892-1049',
        featured: true,
        averageRating: 5.0,
        reviewCount: 24
      },
      projects: [
        {
          title: 'Kyoto Echoes Residence',
          category: 'Residential',
          style: 'Scandinavian',
          description: 'A complete interior overhaul featuring Hinoki wood partitions, paper washi lanterns, microcement floors, and custom low-slung oak banquettes designed for serene daily contemplation.',
          location: 'Presidio Heights, SF',
          completionYear: '2025',
          areaSqFt: '3,200 sq ft',
          budgetRange: '$180,000 - $240,000',
          thumbnail: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        },
        {
          title: 'The Linen & Timber Loft',
          category: 'Residential',
          style: 'Modern Minimalist',
          description: 'Open-concept urban loft balancing raw exposed concrete ceilings with soft Belgian linen drapery, boucle upholstery, and smoked oak kitchen cabinetry.',
          location: 'SoMa, San Francisco',
          completionYear: '2024',
          areaSqFt: '2,400 sq ft',
          budgetRange: '$140,000 - $190,000',
          thumbnail: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        }
      ]
    },
    {
      user: {
        email: 'siddharth@bruttimber.com',
        name: 'Ar. Siddharth Joshi',
        phone: '+91 97693 55219',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Brut & Timber Architects',
        tagline: 'Honest Textures & Industrial Elegance',
        bio: 'Specialists in adaptive reuse, steel-and-glass structural extensions, and warm industrial workspaces. We celebrate board-formed concrete, reclaimed teak, and blackened architectural steel.',
        location: 'Bengaluru, India',
        experienceYears: 12,
        budgetTier: '$$$',
        specializations: 'Commercial Offices, Adaptive Reuse, Creative Studios, Architectural Renovation',
        designStyles: 'Industrial Loft, Modern Minimalist, Neo-Classical',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'Council of Architecture (CA/2012/51930), IIID Karnataka Chapter',
        website: 'https://bruttimber.in',
        phone: '+91 97693 55219',
        featured: true,
        averageRating: 4.8,
        reviewCount: 15
      },
      projects: [
        {
          title: 'The Foundry Creative Headquarters',
          category: 'Commercial',
          style: 'Industrial Loft',
          description: 'A 14,000 sq ft former textile warehouse reimagined into a sunlight-drenched collaborative design hub with mezzanine catwalks, acoustic cork pods, and steel crittall glazed meeting suites.',
          location: 'Indiranagar, Bengaluru',
          completionYear: '2024',
          areaSqFt: '14,000 sq ft',
          budgetRange: '$380,000 - $500,000',
          thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        }
      ]
    },
    {
      user: {
        email: 'ananya@verdantstudio.com',
        name: 'Ar. Ananya Sen',
        phone: '+91 98450 33118',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Verdant Earth & Architecture',
        tagline: 'Climate-Responsive Courtyard Sanctuaries',
        bio: 'Pioneers in passive cooling, rainwater harvesting courtyards, and rammed-earth construction. Winner of National Green Building Excellence Award 2024. Every design connects inhabitants with wind, water, and local flora.',
        location: 'New Delhi & Auroville',
        experienceYears: 9,
        budgetTier: '$$',
        specializations: 'Sustainable Architecture, Courtyard Homes, Landscape Integration, Net-Zero Living',
        designStyles: 'Biophilic Contemporary, Modern Minimalist',
        avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'Council of Architecture (CA/2015/64390), IGBC Accredited Faculty',
        website: 'https://verdantdesign.org',
        phone: '+91 98450 33118',
        featured: true,
        averageRating: 4.9,
        reviewCount: 20
      },
      projects: [
        {
          title: 'The Terracotta Breeze House',
          category: 'Residential',
          style: 'Biophilic Contemporary',
          description: 'Designed around three microclimate internal courtyards with perforated jali screens that reduce indoor temperatures by 6 degrees Celsius without mechanical air conditioning.',
          location: 'Gurugram',
          completionYear: '2025',
          areaSqFt: '5,400 sq ft',
          budgetRange: '$220,000 - $310,000',
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
        email: 'julian@hauteliving.design',
        name: 'Julian Beaumont',
        phone: '+44 20 7946 0912',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Beaumont Fine Interiors',
        tagline: 'Timeless Haute Couture Residential Living',
        bio: 'Bespoke European interiors marrying classical proportion with contemporary flair. Specialized in luxury manor restorations, private art collectors residences, and Michelin-starred dining atmospheres.',
        location: 'London & Dubai',
        experienceYears: 16,
        budgetTier: '$$$$',
        specializations: 'Luxury Residential, Penthouse Design, Fine Art Curation, Hospitality',
        designStyles: 'Neo-Classical, Modern Minimalist',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'BIID Registered Interior Designer, SBID Fellow, IFI',
        website: 'https://beaumontfineinteriors.co.uk',
        phone: '+44 20 7946 0912',
        featured: false,
        averageRating: 4.9,
        reviewCount: 31
      },
      projects: [
        {
          title: 'Kensington Townhouse Restoration',
          category: 'Residential',
          style: 'Neo-Classical',
          description: 'A Grade II listed Victorian residence restored with chevron French oak parquetry, Calacatta Viola marble fireplaces, and sculptural contemporary Italian furniture.',
          location: 'Kensington, London',
          completionYear: '2024',
          areaSqFt: '4,800 sq ft',
          budgetRange: '$550,000 - $750,000',
          thumbnail: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        }
      ]
    }
  ];

  let primaryDesignerProfile = null;

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

    if (item.user.email === 'designer@atelier.com') {
      primaryDesignerProfile = profile;
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

  // 4. Create Inquiries & Communication Threads
  if (primaryDesignerProfile) {
    // Inquiry 1: Accepted & Active
    const inquiry1 = await prisma.inquiry.create({
      data: {
        clientId: clientUser.id,
        designerId: primaryDesignerProfile.id,
        projectTitle: 'Coastal Modern Villa in North Goa',
        projectCategory: 'Residential Architecture',
        location: 'Assagao, Goa',
        budgetRange: '$350,000 - $500,000',
        targetTimeline: '6-9 Months',
        scopeDescription: 'We recently acquired a 15,000 sq ft plot overlooking the paddy fields in Assagao. We are looking for an architectural vision that respects Goa vernacular traditions while maintaining sharp minimalist cantilevered lines, double-height ceilings, and an infinity pool.',
        status: 'ACCEPTED',
        messages: {
          create: [
            {
              senderId: clientUser.id,
              messageText: 'Hello Ar. Vikramaditya, we were thoroughly inspired by your Solarium Cliff Villa project. We would love to discuss developing our vacation home in Assagao.'
            },
            {
              senderId: primaryDesignerProfile.userId,
              messageText: 'Greetings Aarav and Meera. Thank you for reaching out! Assagao has an extraordinary microclimate and landscape. We have reviewed your plot specs and would be thrilled to schedule a site analysis consultation this coming Friday.'
            },
            {
              senderId: clientUser.id,
              messageText: 'Friday at 3:00 PM works perfectly for us! We will send over the topographical survey document beforehand.'
            }
          ]
        }
      }
    });

    // Inquiry 2: Under Review
    const inquiry2 = await prisma.inquiry.create({
      data: {
        clientId: clientUser2.id,
        designerId: primaryDesignerProfile.id,
        projectTitle: 'Penthouse Living Space & Terrace Redesign',
        projectCategory: 'Penthouse Interior',
        location: 'Bandra West, Mumbai',
        budgetRange: '$120,000 - $180,000',
        targetTimeline: '3-4 Months',
        scopeDescription: 'Renovating an existing 3,000 sq ft duplex apartment with emphasis on acoustic treatments, open entertaining kitchen, and a rooftop plunge pool with sunset views.',
        status: 'UNDER_REVIEW',
        messages: {
          create: [
            {
              senderId: clientUser2.id,
              messageText: 'Hi Vikramaditya, looking for a bespoke overhaul of my duplex terrace in Bandra. Would love to know if your studio has capacity starting Q2.'
            }
          ]
        }
      }
    });

    // 5. Create Reviews
    await prisma.review.create({
      data: {
        designerId: primaryDesignerProfile.id,
        clientId: clientUser.id,
        rating: 5,
        reviewTitle: 'Exemplary architectural vision and execution',
        comment: 'Working with Ar. Vikramaditya Singhania was an absolute pleasure. Their attention to natural lighting patterns, choice of local stones, and transparency with cost engineering made our villa dream a reality.',
        projectCategory: 'Residential Architecture'
      }
    });

    await prisma.review.create({
      data: {
        designerId: primaryDesignerProfile.id,
        clientId: clientUser2.id,
        rating: 5,
        reviewTitle: 'Masterclass in modern minimalism',
        comment: 'Every square foot was planned with intention. The bespoke joinery and cantilevered terrace created spaces we never want to leave. Highly recommended for discerning homeowners.',
        projectCategory: 'Luxury Penthouse'
      }
    });
  }

  console.log('✅ Seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials:');
  console.log('  👑 Admin:    admin@atelier.com / password123');
  console.log('  🏛 Designer: designer@atelier.com / password123');
  console.log('  🏡 Client:   client@atelier.com / password123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
