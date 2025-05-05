


// // 1. Fetch paginated stories
// const stories = await prisma.story.findMany({
//     take: 100,
//     orderBy: { createdAt: 'desc' },
//     // ... any filters
// });
  
// // 2. Fetch all bookmarks for this user
// const bookmarks = await prisma.bookmark.findMany({
//     where: { userId },
//     select: { storyId: true },
// });
  
// // 3. Create a Set of bookmarked story IDs
// const bookmarkedStoryIds = new Set(bookmarks.map(b => b.storyId));

// // 4. Map the stories and add a `bookmarked` flag
// const storiesWithBookmarks = stories.map(story => ({
//     ...story,
//     bookmarked: bookmarkedStoryIds.has(story.id),
// }));
  


// await prisma.bookmark.delete({
//     where: {
//       userId_storyId: {
//         userId: userId,
//         storyId: storyId,
//       },
//     },
//   });