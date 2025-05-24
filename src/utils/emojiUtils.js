export const emojiCategories = {
  animals: ["🐶", "🐱", "🐵", "🐰", "🦊", "🐼", "🐨", "🦁"],
  food: ["🍕", "🍔", "🍟", "🍩", "🍦", "🍭", "🍫", "🍿"],
  sports: ["⚽️", "🏀", "🏈", "🎾", "🏐", "⚾️", "🏓", "🏸"],
  nature: ["🌞", "🌈", "🌸", "🌵", "🍄", "🌊", "🌴", "🍁"],
  space: ["🚀", "🌙", "⭐️", "🪐", "☄️", "🌠", "👽", "🛸"],
  music: ["🎸", "🥁", "🎹", "🎷", "🎺", "🎻", "🎤", "🎵"],
}

export const getRandomEmoji = (category) => {
  if (!category || !emojiCategories[category]) return "❓"

  const categoryEmojis = emojiCategories[category]
  const randomIndex = Math.floor(Math.random() * categoryEmojis.length)
  return categoryEmojis[randomIndex]
}
