export const getOptionsPrompt = (item: string, category: string): string =>
  `Let's play a game where I trade with a variety of random items.
Give 4 items I can trade for with (a studio mic).
Rough category is (high-end consumer products).
Output in JSON:
{
    "items": [
        "wireless headphones",
        "a small business blog",
        "2 bottles of aged whiskey",
        "a cashmere scarf"
        ]
}

Give 4 items I can trade for with (an abandoned factory). 
Rough category is (real estate and small business).
Output in JSON:
{
    "items": [
        "a classic car",
        "an expensive highrise apartment",
        "a local courier business",
        "200 acres of derelict farmland"
        ]
}

Give 4 items I can trade for with (${item}).
Rough category is (${category}).
Output in JSON:`;

export const getValuePrompt = (item: string): string =>
  `Give a single number estimate in USD, for the value of (a jellybean):
0.1
Give a single number estimate in USD, for the value of (a brand new electric car):
35000
Give a single number estimate in USD, for the value of (an abandoned factory):
400000
Give a single number estimate in USD, for the value of (luxury car dealership franchise):
200000000
Give a single number estimate in USD, for the value of (${item}):`;
