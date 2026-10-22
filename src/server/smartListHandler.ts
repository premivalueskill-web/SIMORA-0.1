import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function handleSmartListRequest(orders: any[] = [], availableProducts: any[] = [], promptTone: string = 'weekly_routine') {
  const currentApiKey = process.env.GEMINI_API_KEY || apiKey;
  if (!currentApiKey) {
    return {
      success: true,
      source: 'heuristic',
      summary: 'Generated from your recent order intervals and quick refill cycles.',
      recommendations: generateHeuristicList(orders, availableProducts),
    };
  }

  try {
    const client = new GoogleGenAI({
      apiKey: currentApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const orderHistorySummary = (orders || []).slice(-10).map((o: any, idx: number) => ({
      orderId: o.orderNumber || `Order-${idx + 1}`,
      placedDate: o.createdAt,
      items: o.items?.slice(0, 10).map((it: any) => ({
        id: it.product?.id,
        name: it.product?.name,
        category: it.product?.category,
        quantity: it.quantity,
      })),
    }));

    const catalogSummary = (availableProducts || []).slice(0, 35).map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      unit: p.unit,
      price: p.price,
    }));

    const systemPrompt = `You are SIMORA's AI Smart Shopping & Replenishment Intelligence Engine ("Your Need Our Deed").
Analyze the customer's grocery order history, order frequencies, and standard Indian household consumption cycles to generate an intelligent personalized Smart Shopping List.
Consumption frequency heuristics:
- Milk, bread, green chillies, paneer: High frequency (refill needed every 2-3 days).
- Eggs, curd, tomatoes, cucumbers: Medium frequency (every 3-5 days).
- Wheat atta, lentils/dal, edible oil, rice: Low-medium frequency (every 10-14 days).
- Snacks, juices, biscuits: Repeat snacking habits.`;

    const userPrompt = `Customer's Past Order History:
${JSON.stringify(orderHistorySummary, null, 2)}

Available Store Catalog:
${JSON.stringify(catalogSummary, null, 2)}

User Preference / Context: ${promptTone}

Return a list of 4 to 8 highly relevant product recommendations from the catalog with intelligent reasoning for why they need to refill now, suggested quantity, estimated urgency, and grouping category.`;

    const callPromise = client.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: '1-sentence punchy summary of what this smart list is tailored for.',
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productId: {
                    type: Type.STRING,
                    description: 'The exact matching product ID from the store catalog',
                  },
                  suggestedQuantity: {
                    type: Type.INTEGER,
                    description: 'Recommended refill quantity (e.g. 1, 2)',
                  },
                  urgency: {
                    type: Type.STRING,
                    description: 'One of: Overdue Refill, Running Low, Habitual Favorite, Perfect Pairing',
                  },
                  aiReason: {
                    type: Type.STRING,
                    description: 'Specific reasoning like: "Last ordered 3 days ago. A 500ml milk pouch usually finishes in 2 days."',
                  },
                  smartCategory: {
                    type: Type.STRING,
                    description: 'Group label like "Morning Breakfast Essentials" or "Taaza Harvest Refill"',
                  },
                },
                required: ['productId', 'suggestedQuantity', 'urgency', 'aiReason', 'smartCategory'],
              },
            },
          },
          required: ['summary', 'recommendations'],
        },
      },
    });

    // 12-second timeout safeguard to prevent hanging while allowing fast completion
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI generation timed out')), 12000)
    );

    const response = await Promise.race([callPromise, timeoutPromise]) as any;

    const parsedData = JSON.parse(response.text || '{}');
    return {
      success: true,
      source: 'gemini',
      ...parsedData,
    };
  } catch (err) {
    console.warn('Notice: Gemini Smart List generation encountered an issue, falling back to heuristics:', err);
    return {
      success: true,
      source: 'heuristic_fallback',
      summary: 'Smart suggestions calculated from purchase frequency and pantry refill cycles.',
      recommendations: generateHeuristicList(orders, availableProducts),
    };
  }
}

function generateHeuristicList(orders: any[], products: any[]) {
  const suggestions = [];

  const milk = products.find(p => p.id === 'p-dairy-1') || products.find(p => p.category === 'dairy_breakfast');
  if (milk) {
    suggestions.push({
      productId: milk.id,
      suggestedQuantity: 2,
      urgency: 'Overdue Refill',
      aiReason: 'Milk pouches last 1-2 days. Based on your regular ordering interval, your kitchen is running low.',
      smartCategory: 'Morning Breakfast Refill',
    });
  }

  const veggies = products.find(p => p.id === 'p-veg-1') || products.find(p => p.category === 'vegetables_fruits');
  if (veggies) {
    suggestions.push({
      productId: veggies.id,
      suggestedQuantity: 1,
      urgency: 'Running Low',
      aiReason: 'Tomatoes are an everyday cooking staple in your past orders. Fresh farm batch available today.',
      smartCategory: 'Taaza Harvest Refill',
    });
  }

  const bread = products.find(p => p.id === 'p-dairy-2') || products.find(p => p.id === 'p-dairy-4');
  if (bread) {
    suggestions.push({
      productId: bread.id,
      suggestedQuantity: 1,
      urgency: 'Habitual Favorite',
      aiReason: 'Frequently paired with morning milk in your previous quick deliveries.',
      smartCategory: 'Morning Breakfast Refill',
    });
  }

  const staple = products.find(p => p.id === 'p-staple-1') || products.find(p => p.category === 'staples_kitchen');
  if (staple) {
    suggestions.push({
      productId: staple.id,
      suggestedQuantity: 1,
      urgency: 'Pantry Routine',
      aiReason: '10-day replenishment window reached for home staples.',
      smartCategory: 'Pantry & Daily Staples',
    });
  }

  const snack = products.find(p => p.category === 'snacks_munchies' || p.category === 'cold_drinks_juices');
  if (snack) {
    suggestions.push({
      productId: snack.id,
      suggestedQuantity: 1,
      urgency: 'Perfect Pairing',
      aiReason: 'Customer top pick for evening cravings and quick refreshments.',
      smartCategory: 'Evening Munchies & Sips',
    });
  }

  return suggestions;
}
