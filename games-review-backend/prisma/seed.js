const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.review.deleteMany({});
  await prisma.game.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleaned');

  // Create users
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      username: 'user1',
      password: passwordHash,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      username: 'user2',
      password: passwordHash,
    },
  });

  console.log('Users created:', user1.id, user2.id);

  // Create games
  const game1 = await prisma.game.create({
    data: {
      title: 'The Witcher 3: Wild Hunt',
      description: 'An open-world RPG set in a fantasy universe with a compelling story.',
      author: 'CD Projekt Red',
      genre: ['RPG', 'Action', 'Open World'],
      userId: user1.id,
    },
  });

  const game2 = await prisma.game.create({
    data: {
      title: 'Elden Ring',
      description: 'An action RPG developed by FromSoftware and published by Bandai Namco Entertainment.',
      author: 'FromSoftware',
      genre: ['RPG', 'Action', 'Souls-like'],
      userId: user1.id,
    },
  });

  const game3 = await prisma.game.create({
    data: {
      title: 'Hades',
      description: 'A rogue-like dungeon crawler where you defy the god of the dead as you hack and slash out of the Underworld.',
      author: 'Supergiant Games',
      genre: ['Rogue-like', 'Action', 'Indie'],
      userId: user2.id,
    },
  });

  console.log('Games created:', game1.id, game2.id, game3.id);

  // Create reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'One of the best games ever made!',
      gameId: game1.id,
      userId: user2.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Amazing open world and story.',
      gameId: game1.id,
      userId: user1.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Incredibly challenging but rewarding gameplay.',
      gameId: game2.id,
      userId: user2.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Fantastic art style and addictive gameplay loop.',
      gameId: game3.id,
      userId: user1.id,
    },
  });

  console.log('Reviews created');
  
  console.log('Database seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });