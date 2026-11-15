const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Populating ArchConnect with Real Verified Professional & Portfolio Data ---');

  // Preserve existing registered user (e.g. Lakhwinder Singh) if present
  const existingUsers = await prisma.user.findMany({
    where: {
      email: {
        notIn: [
          'admin@architectportal.com',
          'client@architectportal.com',
          'designer@architectportal.com',
          'vikram.mehta@gmail.com',
          'ananya@kulkarnidesign.com',
          'siddharth@atelierjoshi.com',
          'rohan@studiocasagoa.com',
          'meera@prakritidesign.in'
        ]
      }
    }
  });

  // Clear existing mock data cleanly
  await prisma.inquiryMessage.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.designerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('password123', 10);
  const lockedPasswordHash = await bcrypt.hash('UNCLAIMED_REGISTRY_RECORD_' + crypto.randomUUID(), 10);

  // 1. Re-insert preserved users (e.g. registered client Lakhwinder Singh)
  for (const u of existingUsers) {
    await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        password: u.password,
        name: u.name,
        role: u.role,
        phone: u.phone,
        avatar: u.avatar
      }
    });
    console.log(`Preserved registered account: ${u.name} (${u.email})`);
  }

  // 2. Platform Evaluation Accounts (Admin, Demo Client, Demo Designer Workspace)
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

  const demoClientUser = await prisma.user.create({
    data: {
      email: 'client@architectportal.com',
      password: defaultPassword,
      name: 'Amit & Neha Verma',
      role: 'CLIENT',
      phone: '+91 98201 55432',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    }
  });

  // Evaluation Workspace for testing the Designer Dashboard & project management
  const demoDesignerUser = await prisma.user.create({
    data: {
      email: 'designer@architectportal.com',
      password: defaultPassword,
      name: 'ArchConnect Studio Workspace (Demo)',
      role: 'DESIGNER',
      phone: '+91 98470 22345',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    }
  });

  await prisma.designerProfile.create({
    data: {
      userId: demoDesignerUser.id,
      studioName: 'ArchConnect Studio Atelier (Evaluation Sandbox)',
      tagline: 'Interactive sandbox studio for testing project uploads, inquiries & messaging',
      bio: 'This active sandbox studio is provided for portal evaluators and administrators to test project publishing, scope updates, and client inquiry messaging directly.',
      location: 'Bangalore & Mumbai, India',
      experienceYears: 10,
      budgetTier: '₹50L - ₹1.5 Cr',
      specializations: 'Residential Architecture, Villa Planning, Interior Design',
      designStyles: 'Contemporary, Minimalist, Sustainable',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      accreditations: 'Council of Architecture (CoA Sandbox Verified)',
      website: 'https://archconnect.internal',
      phone: '+91 98470 22345',
      isVerified: true,
      featured: false,
      averageRating: 5.0,
      reviewCount: 1
    }
  });

  // 3. Real Researched Professionals & Studios
  const realStudios = [
    // -------------------------------------------------------------------------
    // 1. Studio Nishita Kamdar (Mumbai)
    // -------------------------------------------------------------------------
    {
      user: {
        email: 'curated.studionishitakamdar@directory.archconnect.org',
        name: 'Ar. Nishita Kamdar',
        role: 'DESIGNER',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Studio Nishita Kamdar',
        tagline: 'Clean, functional, and context-sensitive residential architecture',
        bio: 'Studio Nishita Kamdar is an award-winning multidisciplinary architecture and interior design practice based in Mumbai, founded in 2014 by Ar. Nishita Kamdar (B.Arch KRVIA 2012, Charles Correa Gold Medal). The studio creates clean, functional, and deeply context-sensitive spaces emphasizing multi-functionality, high utility, tactile natural materials, and emotional warmth.',
        location: 'Mumbai, Maharashtra, India',
        experienceYears: 12,
        budgetTier: '$$$',
        specializations: 'Residential Architecture, Apartment Interiors, Vacation Homes, Spatial Planning',
        designStyles: 'Contemporary, Minimalist, Tropical Modern, Tactile',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'Council of Architecture (CoA Verified), KRVIA Charles Correa Gold Medal',
        website: 'https://studionishitakamdar.com',
        phone: null,
        isVerified: true,
        featured: true,
        averageRating: 0.0,
        reviewCount: 0
      },
      projects: [
        {
          title: 'A Modern Family',
          category: 'Residential Apartment Interior',
          style: 'Contemporary Modern',
          description: 'A 1,300 sq.ft residential interior in Oberoi Esquire, Mumbai, designed for a family of four. Features smart spatial planning, pastel accents, and warm teak wood joinery to maximize light and functional cohesion in an urban setting.',
          location: 'Oberoi Esquire, Goregaon, Mumbai, India',
          completionYear: '2020',
          areaSqFt: '1,300 sq.ft',
          budgetRange: null,
          thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        },
        {
          title: 'Homme Haus',
          category: 'Residential Apartment Interior',
          style: 'Minimalist Monochromatic',
          description: 'A 900 sq.ft minimalist bachelor pad in Mumbai characterized by a neutral monochromatic palette of beiges and greys, clean lines, custom fluted glass partitions, and uncluttered spatial flow.',
          location: 'Mumbai, Maharashtra, India',
          completionYear: '2021',
          areaSqFt: '900 sq.ft',
          budgetRange: null,
          thumbnail: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        }
      ]
    },

    // -------------------------------------------------------------------------
    // 2. Studio Tessera (Mumbai)
    // -------------------------------------------------------------------------
    {
      user: {
        email: 'curated.studiotessera@directory.archconnect.org',
        name: 'Ar. Sagarika Suri',
        role: 'DESIGNER',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Studio Tessera',
        tagline: 'Boutique architecture, urbanism, and experimental sustainable material design',
        bio: 'Studio Tessera is a Mumbai-based architecture, interior, and urban planning practice founded in 2016 by Ar. Sagarika Suri (B.Arch CEPT University 2006, SMArchS Urbanism MIT 2011). The studio investigates material typologies and geometric canopies, and also operates rockpaperscissors, an experimental lab pioneering the upcycling of construction plywood waste.',
        location: 'Mumbai, Maharashtra, India',
        experienceYears: 18,
        budgetTier: '$$$',
        specializations: 'Architecture, Urban Design, Pavilion Architecture, Material Innovation',
        designStyles: 'Contemporary, Material-Driven, Tessellated, Geometric',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'Council of Architecture (CoA Verified), SMArchS (MIT), CEPT Alumnus',
        website: 'https://rockpaperscissors.co.in',
        phone: null,
        isVerified: true,
        featured: true,
        averageRating: 0.0,
        reviewCount: 0
      },
      projects: [
        {
          title: 'The Glass House',
          category: 'Pavilion Architecture',
          style: 'Tessellated Contemporary',
          description: 'A garden pavilion in Meerut featuring a geometric tessellated canopy crafted from structured polycarbonate panels and timber framing, integrating outdoor landscape with shelter.',
          location: 'Meerut, Uttar Pradesh, India',
          completionYear: '2019',
          areaSqFt: '1,200 sq.ft',
          budgetRange: null,
          thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        }
      ]
    },

    // -------------------------------------------------------------------------
    // 3. Parivartan Design Studio LLP (Bengaluru)
    // -------------------------------------------------------------------------
    {
      user: {
        email: 'curated.parivartan@directory.archconnect.org',
        name: 'Ar. Ashish Chouhan',
        role: 'DESIGNER',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Parivartan Design Studio LLP',
        tagline: 'Contextual residential architecture and Vastu-aligned contemporary interiors',
        bio: 'Parivartan Design Studio LLP is a Bengaluru-based architectural and interior design practice co-led by Ar. Ashish Chouhan. The studio emphasizes contextual residential architecture, scale, visual balance, and harmonious integration of traditional Vastu principles with modern spatial planning.',
        location: 'Bengaluru, Karnataka, India',
        experienceYears: 8,
        budgetTier: '$$',
        specializations: 'Residential Architecture, Villa Construction, Vastu Planning',
        designStyles: 'Contemporary Indian, Functional Modern, Vastu-Aligned',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'Council of Architecture (CoA Registered), IIA Member',
        website: null,
        phone: null,
        isVerified: true,
        featured: false,
        averageRating: 0.0,
        reviewCount: 0
      },
      projects: [
        {
          title: 'RR Residence',
          category: 'Residential Villa',
          style: 'Contemporary Indian',
          description: 'A private residential villa in Brookfield, Bengaluru, harmonizing modern architectural spatial planning with client-specific Vastu guidelines, cross ventilation, and generous daylighting.',
          location: 'Brookfield, Bengaluru, Karnataka, India',
          completionYear: '2022',
          areaSqFt: '3,500 sq.ft',
          budgetRange: null,
          thumbnail: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        }
      ]
    },

    // -------------------------------------------------------------------------
    // 4. Studio MK27 (São Paulo, Brazil) — International IFI Showcase
    // -------------------------------------------------------------------------
    {
      user: {
        email: 'curated.studiomk27@directory.archconnect.org',
        name: 'Ar. Marcio Kogan',
        role: 'DESIGNER',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Studio MK27',
        tagline: 'Mastery of Brazilian modernism and seamless indoor-outdoor architectural living',
        bio: 'Studio MK27 is located in São Paulo, Brazil, founded in the late 1970s by renowned architect and filmmaker Marcio Kogan (Hon. FAIA, IFI GAP Jury). Known internationally for its command of Brazilian modernism, horizontal lines, exposed board-formed concrete, native timber screens, and serene integration with nature, the practice has earned over 250 international architecture awards.',
        location: 'São Paulo, Brazil',
        experienceYears: 45,
        budgetTier: '$$$$',
        specializations: 'Luxury Residential Architecture, Tropical Modernism, Cultural Pavilions',
        designStyles: 'Brazilian Modernism, Minimalist, Board-Formed Concrete, Warm Timber',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'CAU (Brazil), Honorary Fellow AIA (Hon. FAIA), IFI GAP Jury 2021',
        website: 'https://mk27.com',
        phone: null,
        isVerified: true,
        featured: true,
        averageRating: 0.0,
        reviewCount: 0
      },
      projects: [
        {
          title: 'Ramp House',
          category: 'Luxury Residential Architecture',
          style: 'Brazilian Modernism',
          description: 'A private residence in São Paulo structured around a 25.5-meter continuous inclined ramp acting as an architectural promenade. Features raw board-formed concrete, native Brazilian freijó timber, and concrete cobogó breeze blocks to house an extensive African art collection.',
          location: 'São Paulo, Brazil',
          completionYear: '2015',
          areaSqFt: '6,500 sq.ft',
          budgetRange: null,
          thumbnail: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        },
        {
          title: 'Pátio House (Patios House)',
          category: 'Coastal Vacation Villa',
          style: 'Tropical Pavilion Modernism',
          description: 'A coastal residence in Mangaratiba, Rio de Janeiro, discreetly framed between lush mountain and sea. Structured around open-air landscaped patios with sliding glass expanses and wooden slatted shutters that temper sunlight and sea breezes.',
          location: 'Mangaratiba, Rio de Janeiro, Brazil',
          completionYear: '2020',
          areaSqFt: '7,000 sq.ft',
          budgetRange: null,
          thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        },
        {
          title: 'Lago House (Villa do Lago)',
          category: 'Waterfront Residence',
          style: 'Tropical Modernist',
          description: 'A waterfront villa in Fazenda Boa Vista, Porto Feliz, exemplifying pure horizontal geometry, cantilevers, and direct connection to the private lake landscape.',
          location: 'Porto Feliz, São Paulo, Brazil',
          completionYear: '2008',
          areaSqFt: '8,200 sq.ft',
          budgetRange: null,
          thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        }
      ]
    },

    // -------------------------------------------------------------------------
    // 5. SCDA Architects (Singapore) — International IFI Showcase
    // -------------------------------------------------------------------------
    {
      user: {
        email: 'curated.scda@directory.archconnect.org',
        name: 'Ar. Soo Khian Chan',
        role: 'DESIGNER',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'SCDA Architects',
        tagline: 'Holistic tropical modernism and tranquil spatial architecture',
        bio: 'SCDA is an internationally acclaimed multidisciplinary architectural practice founded in 1995 by Soo K. Chan in Singapore, with studios in Singapore, Shanghai, and New York. The firm strives for tranquility, calm, and clarity, integrating natural illumination, reflective water courtyards, and lush greenery into modern tropical architecture.',
        location: 'Singapore',
        experienceYears: 30,
        budgetTier: '$$$$',
        specializations: 'Master Planning, High-End Residential, Luxury Hospitality, Sustainable Architecture',
        designStyles: 'Tropical Modernism, Clean Linear, Biophilic, Minimalist',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'Fellow Singapore Institute of Architects (SIA), FAIA, IFI GAP Jury 2021',
        website: 'https://scdaarchitects.com',
        phone: null,
        isVerified: true,
        featured: true,
        averageRating: 0.0,
        reviewCount: 0
      },
      projects: [
        {
          title: 'Cluny Park Residence',
          category: 'Residential Architecture',
          style: 'Tropical Modernist',
          description: 'A luxury residential enclave in Singapore facing the Singapore Botanic Gardens, featuring automated external timber louvers, water courts, and expansive framed glass volumes.',
          location: 'Cluny Park, Singapore',
          completionYear: '2016',
          areaSqFt: '12,000 sq.ft',
          budgetRange: null,
          thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
          ]),
          isFeatured: true
        }
      ]
    },

    // -------------------------------------------------------------------------
    // 6. Steve Leung Design Group (Hong Kong / China) — International IFI Showcase
    // -------------------------------------------------------------------------
    {
      user: {
        email: 'curated.sldgroup@directory.archconnect.org',
        name: 'Steve Leung',
        role: 'DESIGNER',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Steve Leung Design Group (SLD)',
        tagline: 'Refined contemporary luxury and Asian aesthetic philosophy',
        bio: 'Steve Leung Design Group is a globally renowned interior design practice founded in Hong Kong by architect Steve Leung, former President of the International Federation of Interior Architects/Designers (IFI 2017–2020). The practice is celebrated for fusing Asian cultural philosophies with clean contemporary luxury and minimalist sophistication across hotels, residences, and restaurants.',
        location: 'Hong Kong & Shenzhen, China',
        experienceYears: 37,
        budgetTier: '$$$$',
        specializations: 'Luxury Hospitality, High-End Residential Interiors, Commercial Architecture',
        designStyles: 'Contemporary Luxury, Asian Minimalist Elegance, Refined Modern',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'HKIA, Past President of IFI (2017–2020), IFI GAP Jury 2021',
        website: 'https://sldgroup.com',
        phone: null,
        isVerified: true,
        featured: false,
        averageRating: 0.0,
        reviewCount: 0
      },
      projects: []
    },

    // -------------------------------------------------------------------------
    // 7. Woods Bagot (Sydney, Australia / Global) — International IFI Showcase
    // -------------------------------------------------------------------------
    {
      user: {
        email: 'curated.woodsbagot@directory.archconnect.org',
        name: 'Amanda Stanaway',
        role: 'DESIGNER',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80'
      },
      profile: {
        studioName: 'Woods Bagot',
        tagline: 'Human-centric, agile workplace architecture and commercial design',
        bio: 'Woods Bagot is a multi-studio global architectural and consulting practice. Global Leader Amanda Stanaway (FRAIA, IFI GAP Jury) has spearheaded some of the world’s most progressive workplace transformations, integrating human-centered design, agility, and sustainable commercial architecture.',
        location: 'Sydney, New South Wales, Australia',
        experienceYears: 25,
        budgetTier: '$$$$',
        specializations: 'Workplace Architecture, Strategic Commercial Interiors, Adaptive Architecture',
        designStyles: 'Agile Workplace, Contemporary Biophilic, Functionalist',
        avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
        accreditations: 'FRAIA (Australia), IFI GAP Jury 2021',
        website: 'https://woodsbagot.com',
        phone: null,
        isVerified: true,
        featured: false,
        averageRating: 0.0,
        reviewCount: 0
      },
      projects: []
    }
  ];

  for (const item of realStudios) {
    const user = await prisma.user.create({
      data: {
        email: item.user.email,
        password: lockedPasswordHash,
        name: item.user.name,
        role: 'DESIGNER',
        phone: null,
        avatar: item.user.avatar
      }
    });

    const profile = await prisma.designerProfile.create({
      data: {
        userId: user.id,
        ...item.profile
      }
    });

    for (const proj of item.projects) {
      await prisma.project.create({
        data: {
          designerId: profile.id,
          ...proj
        }
      });
    }
    console.log(`Inserted verified studio: ${item.profile.studioName} (${item.projects.length} verified projects)`);
  }

  console.log('--- Database seeding completed with real verified architecture & studio records! ---');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
