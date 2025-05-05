const { PrismaClient } = require('@prisma/client');
// const { storyGenres } = require('../src/shared/data');
const { v4 } = require("uuid");

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
];

const blogCategories = [
  { title: "Fashion", description: "Focuses on the latest trends, clothing styles, accessories, and industry insights. Includes outfit ideas, brand reviews, and seasonal fashion tips." },
  { title: "Beauty", description: "Covers skincare, makeup tutorials, product reviews, beauty hacks, and self-care routines." },
  { title: "Travel", description: "Shares travel guides, destination reviews, packing tips, and cultural insights from around the world." },
  { title: "Lifestyle", description: "A broad category that blends daily living topics such as home decor, self-care, work-life balance, and more." },
  { title: "Personal", description: "Reflective blogs sharing personal experiences, stories, thoughts, and perspectives on life." },
  { title: "Tech", description: "Discusses gadgets, software, programming, tech trends, and reviews of the latest devices or tools." },
  { title: "Health", description: "Provides advice on physical and mental well-being, including disease prevention, healthy eating, and medical research updates." },
  { title: "Fitness", description: "Focuses on workout routines, exercise tips, gym reviews, and personal fitness journeys." },
  { title: "Wellness", description: "Explores holistic approaches to health, including mindfulness, stress management, and mental health practices." },
  { title: "SaaS", description: "Blogs about Software-as-a-Service products, including reviews, tutorials, and industry updates." },
  { title: "Business", description: "Offers entrepreneurial advice, business strategy, market insights, and leadership tips." },
  { title: "Education", description: "Discusses learning resources, study tips, teaching methods, and developments in education." },
  { title: "Food and Recipe", description: "Shares recipes, cooking tips, restaurant reviews, and culinary traditions." },
  { title: "Love and Relationships", description: "Focuses on dating tips, marriage advice, family relationships, and emotional well-being." },
  { title: "Alternative Topics", description: "Covers unconventional or niche subjects, such as metaphysics, spirituality, or fringe science." },
  { title: "Green Living", description: "Discusses eco-friendly practices, sustainable living, and renewable energy solutions." },
  { title: "Music", description: "Shares music reviews, artist spotlights, playlists, and updates on the music industry." },
  { title: "Automotive", description: "Covers car reviews, automotive technology, industry trends, and maintenance tips." },
  { title: "Marketing", description: "Focuses on digital marketing strategies, branding, advertising, and social media tips." },
  { title: "Internet Services", description: "Explores topics like web hosting, SEO, online tools, and internet-related innovations." },
  { title: "Finance", description: "Provides advice on personal finance, investments, saving strategies, and market analysis." },
  { title: "Sports", description: "Shares match updates, player profiles, sports history, and training tips." },
  { title: "Entertainment", description: "Discusses movies, TV shows, celebrity news, and pop culture." },
  { title: "Productivity", description: "Focuses on time management, work organization, and productivity tools or habits." },
  { title: "Hobbies", description: "Covers activities like crafting, collecting, painting, and other recreational interests." },
  { title: "Parenting", description: "Offers advice on raising children, family dynamics, and educational activities for kids." },
  { title: "Pets", description: "Shares tips on pet care, training, and health, as well as stories of pet ownership." },
  { title: "Photography", description: "Discusses camera gear, photography techniques, and editing tips for photographers." },
  { title: "Agriculture", description: "Covers farming practices, crop management, and developments in agricultural technology." },
  { title: "Art", description: "Explores painting, sculpture, digital art, and art history or critique." },
  { title: "DIY", description: "Offers how-to guides for crafting, home improvement, and building projects." },
  { title: "Science", description: "Explores scientific discoveries, research updates, and popular science topics." },
  { title: "Gaming", description: "Shares game reviews, industry news, tutorials, and walkthroughs." },
  { title: "History", description: "Discusses historical events, biographies, and cultural heritage." },
  { title: "Self-Improvement", description: "Offers tips on personal growth, habits, goal-setting, and self-motivation." },
  { title: "News and Current Affairs", description: "Provides timely updates on politics, global events, and local news." },
  { title: "Spirituality", description: "Explores practices like meditation, mindfulness, and spiritual philosophies." },
  { title: "Real Estate", description: "Discusses buying, selling, and investing in property, along with market trends." },
  { title: "Technology and Innovation", description: "Focuses on emerging tech, startups, and futuristic advancements." },
  { title: "Career Development", description: "Offers guidance on job hunting, professional growth, and workplace strategies." },
  { title: "Travel Hacks", description: "Provides budget travel tips, hidden gems, and ways to enhance travel experiences." },
  { title: "Urban Living", description: "Focuses on city lifestyles, urban development, and local cultural insights." },
  { title: "Luxury Lifestyle", description: "Covers high-end living, luxury brands, and exclusive travel experiences." },
  { title: "Adventure and Outdoors", description: "Discusses camping, hiking, extreme sports, and exploring nature." },
  { title: "Culture", description: "Explores traditions, cultural events, and societal trends worldwide." },
  { title: "Book Reviews", description: "Shares reviews of fiction, non-fiction, and niche literature." },
  { title: "Social Issues", description: "Discusses topics like inequality, activism, and societal challenges." },
  { title: "Mental Health", description: "Focuses on coping mechanisms, therapy, and psychological well-being." },
  { title: "Cryptocurrency and Blockchain", description: "Explores blockchain technology, cryptocurrency trading, and decentralized finance." },
  { title: "Interior Design", description: "Provides ideas for decorating homes and designing spaces." },
  { title: "Nonprofit and Charity", description: "Discusses volunteering, fundraising, and nonprofit organization management." },
  { title: "Event Planning", description: "Shares tips for organizing weddings, parties, and corporate events." },
  { title: "Tech Reviews", description: "Offers in-depth reviews of gadgets, software, and online platforms." },
  { title: "Language Learning", description: "Guides for learning new languages and exploring linguistic diversity." }
];


const targetAudienceOptions = [
  { label: "Early Readers (5-8)", value: "Early Readers (5-8)" },
  { label: "Middle Grade (8-12)", value: "Middle Grade (8-12)" },
  { label: "Young Adult (12-18)", value: "Young Adult (12-18)" },
  { label: "18+", value: "18+" },
];


async function main() {
  
  for (const genre of storyGenres) {
    await prisma.storyGenre.upsert({
      where: { name: genre },
      update: {},
      create: { name: genre },
    });
  }

  for (const category of blogCategories) {
    await prisma.tag.upsert({
      where: { title: category.title },
      update: {},
      create: { title: category.title, description: category.description },
    });
  }

  for (const targetAudience of targetAudienceOptions) {
    await prisma.targetAudience.upsert({
      where: { name: targetAudience.value },
      update: {},
      create: { name: targetAudience.value, publicId: v4() },
    });
  }

  console.log('Genres, categories & target-audiences seeded successfully');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
