// src/lib/recommenderEngine.ts
import { UserPreferences, normalizeNutriScore, parseNova } from "./validations/product";

/**
 * Simple scoring engine that returns 0..100 (higher = healthier / more aligned with preferences)
 * Inputs:
 *  - product: OpenFoodFacts product object (partial)
 *  - prefs: user preferences from onboarding (optional)
 */
export function scoreProduct(product: any, prefs?: UserPreferences): number {
  // base score
  let score = 50;

  const nutri = product?.nutriscore_grade ? normalizeNutriScore(product.nutriscore_grade) : null;
  const nova = product?.nova_group != null ? parseNova(product.nova_group) : null;
  const nutriments = product?.nutriments || {};

  // Nutri-score influence
  if (nutri) {
    switch (nutri) {
      case "a": score += 30; break;
      case "b": score += 20; break;
      case "c": score += 5; break;
      case "d": score -= 15; break;
      case "e": score -= 30; break;
    }
  }

  // NOVA influence (higher NOVA -> more processed -> negative)
  if (nova != null) {
    if (nova <= 2) score += 10;
    else if (nova === 3) score -= 5;
    else if (nova >= 4) score -= 20;
  }

  // Nutriments influence (very naive checks)
  const sugar = Number(nutriments.sugars_100g ?? nutriments.sugars ?? 0);
  const saturated = Number(nutriments["saturated-fat_100g"] ?? nutriments.saturated_fat_100g ?? 0);
  const salt = Number(nutriments.salt_100g ?? nutriments.sodium_100g ?? 0);

  if (sugar > 15) score -= 10;
  else if (sugar > 5) score -= 2;

  if (saturated > 5) score -= 6;
  if (salt > 1) score -= 6;

  // Preferences: excluded ingredients
  if (prefs?.excludedIngredients?.length) {
    const labels = (product?.ingredients_text || "").toLowerCase();
    for (const ex of prefs.excludedIngredients) {
      if (labels.includes(ex.toLowerCase())) {
        score -= 40; // heavy penalty
      }
    }
  }

  // Preferences: max NOVA
  if (prefs?.maxNova != null && nova != null) {
    if (nova > prefs.maxNova) {
      score -= 25;
    }
  }

  // Clamp
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  return Math.round(score);
}
