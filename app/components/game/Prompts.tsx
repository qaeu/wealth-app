export const getOptionsPrompt = (item: string, category: string): string =>
  `Let's play a game where I trade with a variety of random items.
Give 4 items I can trade for with the stated item, given a rough category for creativity.

item: (🎙️ a studio mic).
category: (high-end consumer products).
Output in JSON:
{
    "items": [
        "🎧 wireless headphones",
        "📰 a small business blog",
        "🥃 2 bottles of aged whiskey",
        "🧣 a cashmere scarf"
        ]
}

item: (🏚️ an abandoned factory). 
category: (real estate and small business).
Output in JSON:
{
    "items": [
        "🚗 a classic car",
        "🏙️ an expensive highrise apartment",
        "📬 a local courier business",
        "🌱 200 acres of derelict farmland"
        ]
}

item: (${item}).
category: (${category}).
Output in JSON:`;

export const getValuePrompt = (item: string): string =>
  `Give an estimated value in USD for the given item.
Output only a single raw number.

(🍬 a jellybean):
0.1
(⚡ a brand new electric car):
35000
(🏚️ an abandoned factory):
400000
(🏬 luxury car dealership franchise):
200000000
(${item}):`;
