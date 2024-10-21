export const cosineSimilarity = (ratings1, ratings2) => {
  // Cosine = Adj/Hyp
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < ratings1.length; i++) {
    dotProduct += ratings1[i] * ratings2[i];
    normA += ratings1[i] ** 2;
    normB += ratings2[i] ** 2;
  }

  if (normA == 0 || normB == 0) {
    return 0
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
};
