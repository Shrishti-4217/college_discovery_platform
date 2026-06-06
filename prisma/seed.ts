import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const colleges = [
  { name: 'IIT Bombay', location: 'Mumbai', state: 'Maharashtra', type: 'engineering', fees: 250000, rating: 4.9, established: 1958, website: 'https://www.iitb.ac.in', description: 'Premier engineering institute known for research and industry connections.' },
  { name: 'IIT Delhi', location: 'New Delhi', state: 'Delhi', type: 'engineering', fees: 240000, rating: 4.8, established: 1961, website: 'https://www.iitd.ac.in', description: 'Top-ranked institute with strong placement record and research output.' },
  { name: 'IIT Madras', location: 'Chennai', state: 'Tamil Nadu', type: 'engineering', fees: 245000, rating: 4.8, established: 1959, description: 'Consistently ranked #1 in NIRF engineering category.' },
  { name: 'IIT Kanpur', location: 'Kanpur', state: 'Uttar Pradesh', type: 'engineering', fees: 230000, rating: 4.7, established: 1959, description: 'Known for strong computer science and aerospace programs.' },
  { name: 'IIT Kharagpur', location: 'Kharagpur', state: 'West Bengal', type: 'engineering', fees: 220000, rating: 4.7, established: 1951, description: 'Oldest IIT with the largest campus and widest course offering.' },
  { name: 'IIT Roorkee', location: 'Roorkee', state: 'Uttarakhand', type: 'engineering', fees: 225000, rating: 4.6, established: 1847, description: 'Oldest technical institution in Asia.' },
  { name: 'IIT Hyderabad', location: 'Hyderabad', state: 'Telangana', type: 'engineering', fees: 215000, rating: 4.5, established: 2008, description: 'New-age IIT with strong entrepreneurship culture.' },
  { name: 'IIT Guwahati', location: 'Guwahati', state: 'Assam', type: 'engineering', fees: 210000, rating: 4.5, established: 1994, description: 'Premier institute serving north-east India.' },
  { name: 'NIT Trichy', location: 'Tiruchirappalli', state: 'Tamil Nadu', type: 'engineering', fees: 150000, rating: 4.4, established: 1964, description: 'Top NIT with excellent placement record.' },
  { name: 'NIT Surathkal', location: 'Surathkal', state: 'Karnataka', type: 'engineering', fees: 140000, rating: 4.3, established: 1960, description: 'NITK known for strong industry tie-ups.' },
  { name: 'NIT Warangal', location: 'Warangal', state: 'Telangana', type: 'engineering', fees: 135000, rating: 4.3, established: 1959, description: 'One of the top NITs with diverse engineering programs.' },
  { name: 'NIT Calicut', location: 'Kozhikode', state: 'Kerala', type: 'engineering', fees: 130000, rating: 4.2, established: 1961, description: 'NIT with strong research output and campus life.' },
  { name: 'BITS Pilani', location: 'Pilani', state: 'Rajasthan', type: 'engineering', fees: 550000, rating: 4.6, established: 1964, description: 'Autonomous institute known for WILP and industry practice programs.' },
  { name: 'BITS Goa', location: 'Goa', state: 'Goa', type: 'engineering', fees: 530000, rating: 4.4, established: 2004, description: 'BITS campus with scenic location and strong placements.' },
  { name: 'BITS Hyderabad', location: 'Hyderabad', state: 'Telangana', type: 'engineering', fees: 520000, rating: 4.3, established: 2008, description: 'Youngest BITS campus with rapidly growing reputation.' },
  { name: 'VIT Vellore', location: 'Vellore', state: 'Tamil Nadu', type: 'engineering', fees: 200000, rating: 4.1, established: 1984, description: 'Large private engineering university with good placements.' },
  { name: 'SRM Institute of Science and Technology', location: 'Chennai', state: 'Tamil Nadu', type: 'engineering', fees: 180000, rating: 3.9, established: 1985, description: 'Popular private university with large intake.' },
  { name: 'Manipal Institute of Technology', location: 'Manipal', state: 'Karnataka', type: 'engineering', fees: 300000, rating: 4.0, established: 1957, description: 'Oldest private engineering college in Karnataka.' },
  { name: 'DTU Delhi', location: 'New Delhi', state: 'Delhi', type: 'engineering', fees: 90000, rating: 4.2, established: 1941, description: 'Formerly DCE, strong in CS and electronics.' },
  { name: 'NSUT Delhi', location: 'New Delhi', state: 'Delhi', type: 'engineering', fees: 85000, rating: 4.0, established: 1983, description: 'Delhi state university with good placements in CS.' },
  { name: 'AIIMS Delhi', location: 'New Delhi', state: 'Delhi', type: 'medical', fees: 7000, rating: 4.9, established: 1956, description: 'Premier medical institute of India.' },
  { name: 'AIIMS Jodhpur', location: 'Jodhpur', state: 'Rajasthan', type: 'medical', fees: 6500, rating: 4.5, established: 2012, description: 'New AIIMS with modern facilities.' },
  { name: 'JIPMER Puducherry', location: 'Puducherry', state: 'Puducherry', type: 'medical', fees: 5000, rating: 4.6, established: 1964, description: 'Jawaharlal Institute with strong clinical training.' },
  { name: 'Maulana Azad Medical College', location: 'New Delhi', state: 'Delhi', type: 'medical', fees: 15000, rating: 4.4, established: 1958, description: 'Top government medical college in Delhi.' },
  { name: 'Grant Medical College', location: 'Mumbai', state: 'Maharashtra', type: 'medical', fees: 20000, rating: 4.3, established: 1845, description: 'One of the oldest medical colleges in India.' },
  { name: 'IIM Ahmedabad', location: 'Ahmedabad', state: 'Gujarat', type: 'management', fees: 2300000, rating: 4.9, established: 1961, description: 'Top-ranked MBA institute, highest salary placements.' },
  { name: 'IIM Bangalore', location: 'Bangalore', state: 'Karnataka', type: 'management', fees: 2400000, rating: 4.9, established: 1973, description: 'Top management school with strong alumni network.' },
  { name: 'IIM Calcutta', location: 'Kolkata', state: 'West Bengal', type: 'management', fees: 2300000, rating: 4.8, established: 1961, description: 'Asia\'s first AACSB-accredited business school.' },
  { name: 'IIM Lucknow', location: 'Lucknow', state: 'Uttar Pradesh', type: 'management', fees: 1900000, rating: 4.6, established: 1984, description: 'Strong in agri-business and rural management.' },
  { name: 'FMS Delhi', location: 'New Delhi', state: 'Delhi', type: 'management', fees: 50000, rating: 4.5, established: 1954, description: 'Best ROI MBA in India, government-run, low fees.' },
  { name: 'IISc Bangalore', location: 'Bangalore', state: 'Karnataka', type: 'science', fees: 35000, rating: 4.9, established: 1909, description: 'India\'s top research institution, ranked globally.' },
  { name: 'TIFR Mumbai', location: 'Mumbai', state: 'Maharashtra', type: 'science', fees: 0, rating: 4.8, established: 1945, description: 'Tata Institute offering fully-funded PhD programs.' },
  { name: 'IMSc Chennai', location: 'Chennai', state: 'Tamil Nadu', type: 'science', fees: 0, rating: 4.6, established: 1962, description: 'Institute of Mathematical Sciences, top theoretical CS.' },
  { name: 'IISER Pune', location: 'Pune', state: 'Maharashtra', type: 'science', fees: 15000, rating: 4.5, established: 2006, description: 'Research-integrated science education.' },
  { name: 'IISER Kolkata', location: 'Kolkata', state: 'West Bengal', type: 'science', fees: 15000, rating: 4.4, established: 2006, description: 'Strong in physics and mathematics research.' },
  { name: 'Miranda House', location: 'New Delhi', state: 'Delhi', type: 'arts', fees: 30000, rating: 4.5, established: 1948, description: 'Top-ranked women\'s arts college in India.' },
  { name: 'Lady Shri Ram College', location: 'New Delhi', state: 'Delhi', type: 'arts', fees: 25000, rating: 4.4, established: 1956, description: 'Premier women\'s college under Delhi University.' },
  { name: 'St. Stephen\'s College', location: 'New Delhi', state: 'Delhi', type: 'arts', fees: 20000, rating: 4.4, established: 1881, description: 'Prestigious liberal arts college, oldest in Delhi.' },
  { name: 'Presidency University', location: 'Kolkata', state: 'West Bengal', type: 'arts', fees: 10000, rating: 4.2, established: 1817, description: 'Heritage university with strong arts tradition.' },
  { name: 'Loyola College', location: 'Chennai', state: 'Tamil Nadu', type: 'arts', fees: 35000, rating: 4.2, established: 1925, description: 'Autonomous arts and science college.' },
  { name: 'Christ University', location: 'Bangalore', state: 'Karnataka', type: 'arts', fees: 120000, rating: 4.0, established: 1969, description: 'Deemed university with wide program offering.' },
  { name: 'Symbiosis Institute of Technology', location: 'Pune', state: 'Maharashtra', type: 'engineering', fees: 380000, rating: 4.0, established: 2008, description: 'Part of Symbiosis group with good industry exposure.' },
  { name: 'Thapar Institute', location: 'Patiala', state: 'Punjab', type: 'engineering', fees: 420000, rating: 4.1, established: 1956, description: 'Deemed university with strong research focus.' },
  { name: 'PES University', location: 'Bangalore', state: 'Karnataka', type: 'engineering', fees: 350000, rating: 3.9, established: 1972, description: 'Good placements in core engineering branches.' },
  { name: 'Amrita School of Engineering', location: 'Coimbatore', state: 'Tamil Nadu', type: 'engineering', fees: 160000, rating: 3.8, established: 1994, description: 'Large private university with 7 campuses.' },
  { name: 'Kalinga Institute of Industrial Technology', location: 'Bhubaneswar', state: 'Odisha', type: 'engineering', fees: 170000, rating: 3.9, established: 1992, description: 'Deemed university with focus on tribal education.' },
  { name: 'Jamia Millia Islamia', location: 'New Delhi', state: 'Delhi', type: 'engineering', fees: 75000, rating: 4.0, established: 1920, description: 'Central university with strong engineering and arts programs.' },
  { name: 'NIT Rourkela', location: 'Rourkela', state: 'Odisha', type: 'engineering', fees: 125000, rating: 4.1, established: 1961, description: 'NIT with strong metallurgy and chemical engineering.' },
  { name: 'IIT BHU Varanasi', location: 'Varanasi', state: 'Uttar Pradesh', type: 'engineering', fees: 200000, rating: 4.3, established: 1919, description: 'Oldest IIT, part of BHU campus.' },
  { name: 'COEP Pune', location: 'Pune', state: 'Maharashtra', type: 'engineering', fees: 80000, rating: 4.0, established: 1854, description: 'Autonomous government institute with strong alumni.' },
]

const coursesMap: Record<string, { name: string; duration: number; fees: number; seats: number }[]> = {
  engineering: [
    { name: 'B.Tech Computer Science', duration: 4, fees: 0, seats: 60 },
    { name: 'B.Tech Electronics & Communication', duration: 4, fees: 0, seats: 60 },
    { name: 'B.Tech Mechanical Engineering', duration: 4, fees: 0, seats: 60 },
    { name: 'M.Tech Computer Science', duration: 2, fees: 0, seats: 30 },
  ],
  medical: [
    { name: 'MBBS', duration: 5, fees: 0, seats: 100 },
    { name: 'MD General Medicine', duration: 3, fees: 0, seats: 20 },
    { name: 'MS Surgery', duration: 3, fees: 0, seats: 20 },
  ],
  management: [
    { name: 'MBA', duration: 2, fees: 0, seats: 120 },
    { name: 'Executive MBA', duration: 1, fees: 0, seats: 60 },
    { name: 'Ph.D Management', duration: 4, fees: 0, seats: 15 },
  ],
  science: [
    { name: 'B.Sc Research', duration: 4, fees: 0, seats: 60 },
    { name: 'M.Sc Physics', duration: 2, fees: 0, seats: 30 },
    { name: 'Ph.D Science', duration: 5, fees: 0, seats: 20 },
  ],
  arts: [
    { name: 'B.A Honours English', duration: 3, fees: 0, seats: 50 },
    { name: 'B.A Honours History', duration: 3, fees: 0, seats: 50 },
    { name: 'M.A Political Science', duration: 2, fees: 0, seats: 30 },
  ],
}

const examMap: Record<string, string> = {
  engineering: 'JEE_MAIN',
  medical: 'NEET',
  management: 'CAT',
  science: 'JAM',
  arts: 'CUET',
}

const categories = ['general', 'obc', 'sc', 'st', 'ews']

function getCutoffsForCollege(rating: number, type: string, index: number) {
  const exam = examMap[type] || 'JEE_MAIN'
  const baseRank = Math.round((5 - rating) * 5000 + index * 200)
  const cutoffs = []

  for (const category of categories) {
    const multiplier = category === 'general' ? 1 : category === 'obc' ? 1.5 : category === 'ews' ? 1.3 : 2.5
    const from = Math.round(baseRank * multiplier)
    const to = Math.round(from + 800 * multiplier)
    cutoffs.push({ exam, category, rankFrom: from, rankTo: to, year: 2023 })
    cutoffs.push({ exam, category, rankFrom: Math.round(from * 1.05), rankTo: Math.round(to * 1.05), year: 2022 })
  }

  // Also add JEE_ADVANCED for top engineering colleges
  if (type === 'engineering' && rating >= 4.5) {
    const advBase = Math.round(baseRank / 10)
    for (const category of categories) {
      const multiplier = category === 'general' ? 1 : category === 'obc' ? 1.5 : 2.5
      const from = Math.round(advBase * multiplier)
      const to = Math.round(from + 200 * multiplier)
      cutoffs.push({ exam: 'JEE_ADVANCED', category, rankFrom: from, rankTo: to, year: 2023 })
    }
  }

  return cutoffs
}

async function main() {
  console.log('Seeding database...')

  await prisma.savedItem.deleteMany()
  await prisma.cutoff.deleteMany()
  await prisma.course.deleteMany()
  await prisma.college.deleteMany()
  await prisma.user.deleteMany()

  for (let i = 0; i < colleges.length; i++) {
    const c = colleges[i]
    const courseTemplates = coursesMap[c.type] || coursesMap['engineering']

    await prisma.college.create({
      data: {
        name: c.name,
        location: c.location,
        state: c.state,
        type: c.type,
        fees: c.fees,
        rating: c.rating,
        established: c.established,
        website: c.website,
        description: c.description,
        courses: {
          create: courseTemplates.map(course => ({
            ...course,
            fees: course.fees === 0 ? c.fees : course.fees,
          })),
        },
        cutoffs: {
          create: getCutoffsForCollege(c.rating, c.type, i),
        },
      },
    })
  }

  // Demo user
  const bcrypt = require('bcryptjs')
  await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: await bcrypt.hash('demo1234', 12),
    },
  })

  console.log(`Seeded ${colleges.length} colleges + 1 demo user`)
  console.log('Demo login: demo@example.com / demo1234')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
