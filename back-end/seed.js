// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const User = require('./models/User');
const Job  = require('./models/Job');

mongoose.set('strictQuery', false);

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  await User.deleteMany({ role: 'employer' });
  await Job.deleteMany({});
  console.log('🧹 Cleared old employers & jobs');

  const passwordHash = await bcrypt.hash('password123', 10);
  const employer = await User.create({
    name:     'Seed Employer',
    email:    'employer@seed.com',
    password: passwordHash,
    role:     'employer'
  });
  console.log('👤 Created employer:', employer.email);

  const types       = ['Full-Time','Part-Time','Contract','Internship'];
  const exps        = ['Junior','Mid','Senior'];
  const salaries    = ['$40k–$60k','$60k–$80k','$80k–$100k'];
  const skillsPool  = ['JavaScript','Node.js','React','TypeScript','MongoDB','HTML','CSS','AWS'];
  const locations   = ['New York, USA','London, UK','Berlin, Germany','Remote','Mumbai, India','Tokyo, Japan'];

  const jobs = Array.from({ length: 100 }).map(() => ({
    employer:        employer._id,
    title:           faker.person.jobTitle(),
    company:         faker.company.name(),
    location:        faker.helpers.arrayElement(locations),
    employmentType:  faker.helpers.arrayElement(types),
    postedAt:        faker.date.recent({ days: 30 }),
    deadline:        faker.date.soon({ days: 60 }),
    experienceLevel: faker.helpers.arrayElement(exps),
    salaryRange:     faker.helpers.arrayElement(salaries),
    skills:          faker.helpers.uniqueArray(() => faker.helpers.arrayElement(skillsPool), 3),
    responsibilities: faker.helpers.uniqueArray(() => faker.lorem.sentence(), 3),
    qualifications:   faker.helpers.uniqueArray(() => faker.lorem.words(), 2),
    benefits:         faker.helpers.uniqueArray(() => faker.lorem.words(), 2),
    description:     faker.lorem.paragraphs(2),       // <-- fix here
  }));

  await Job.insertMany(jobs);
  console.log('📦 Inserted 100 jobs');

  await mongoose.disconnect();
  console.log('🔌 Disconnected, seed complete ✅');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
