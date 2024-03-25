export const getOptionsPrompt = (item: string, category: string): string =>
  `This is a game where we trade a variety of random items.
Offer 4 items to trade for with similar value, given a rough category for creativity.

item: 🎙️ a studio mic
category: high-end consumer products
JSON output:
{"items": ["🎧 wireless headphones", "📰 a small business blog", "🥃 2 bottles of aged whiskey", "🧣 a cashmere scarf"]}

item: 🏚️ an abandoned factory 
category: real estate and small business
JSON output:
{"items": ["🚗 a classic car", "🏙️ an expensive highrise apartment", "📬 a local courier business", "🌱 200 acres of derelict farmland"]}

item: ${item}
category: ${category}
JSON output:`;

export const getValuePrompt = (item: string): string =>
  `Estimate generous upper and lower bound values in USD for the given item.
Output only 2 raw numbers separated by a space.

⚡ 2 brand new electric cars:
30000 200000
🏚️ an abandoned factory:
200000 1000000
🏬 luxury car dealership franchise:
200000000 5000000000
${item}:`;
