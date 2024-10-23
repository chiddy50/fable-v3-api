const { PrismaClient } = require('@prisma/client');
// const { storyGenres } = require('../src/shared/data');

const prisma = new PrismaClient();

const storyGenres = [
    "Action", 
    "Adventure", 
    "Alternate History", 
    "Anthology", 
    "Apocalyptic", 
    "Bildungsroman", 
    "Biographical", 
    "Chick Lit", 
    "Children's", 
    "Coming-of-Age", 
    "Comedy", 
    "Crime", 
    "Cyberpunk", 
    "Drama", 
    "Dystopian", 
    "Erotic", 
    "Experimental", 
    "Fantasy", 
    "Feminist", 
    "Folktale", 
    "Ghost Story", 
    "Gothic", 
    "Historical", 
    "Humor", 
    "Juvenile", 
    "Legal Thriller", 
    "Literary Fiction", 
    "Mystery", 
    "Mythology", 
    "Nautical", 
    "New Adult", 
    "Non-Fiction", 
    "Philosophical", 
    "Picture Book", 
    "Poetry", 
    "Political Thriller", 
    "Psychological Thriller", 
    "Realistic Fiction", 
    "Romance", 
    "Satire", 
    "Science Fiction", 
    "Self-Help", 
    "Short Story", 
    "Slipstream", 
    "Social Commentary", 
    "Speculative Fiction", 
    "Steampunk", 
    "Superhero", 
    "Suspense", 
    "Thriller", 
    "Time Travel",
    "Tragedy", 
    "Urban Fantasy", 
    "Utopian", 
    "War", 
    "Western", 
    "Young Adult"
]

async function main() {
  
  for (const genre of storyGenres) {
    await prisma.storyGenre.upsert({
      where: { name: genre },
      update: {},
      create: { name: genre },
    })
  }

  console.log('Genres seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
