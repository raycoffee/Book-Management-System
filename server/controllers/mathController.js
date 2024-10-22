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
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const pearsonCorrelation = (ratings1, ratings2) => {
  // Ensure both arrays have the same length
  if (ratings1.length !== ratings2.length) {
    throw new Error("Ratings arrays must have the same length");
  }

  const ratingsLen = ratings1.length;

  // Check for sufficient data
  if (ratingsLen < 2) {
    // Not enough data to compute correlation
    return 0;
  }

  // Normal summing of ratings
  let sum1 = 0;
  let sum2 = 0;

  // Summing of the squares of ratings
  let sum1Sq = 0;
  let sum2Sq = 0;

  // Summing of the products of ratings
  let pSum = 0;

  for (let i = 0; i < ratingsLen; i++) {
    sum1 += ratings1[i];
    sum2 += ratings2[i];

    sum1Sq += ratings1[i] ** 2;
    sum2Sq += ratings2[i] ** 2;

    pSum += ratings1[i] * ratings2[i];
  }

  // Calculate numerator
  const numerator = pSum - (sum1 * sum2) / ratingsLen;

  // Calculate denominator
  const denominator = Math.sqrt(
    (sum1Sq - sum1 ** 2 / ratingsLen) * (sum2Sq - sum2 ** 2 / ratingsLen)
  );

  // Avoid division by zero
  if (denominator === 0) return 0;

  // Return Pearson correlation coefficient
  return numerator / denominator;
};

export const cosineSimilarityDistance = (ratings1, ratings2) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  let ratingDistanceSum = 0;

  for (let i = 0; i < ratings1.length; i++) {
    dotProduct += ratings1[i] * ratings2[i];
    normA += ratings1[i] ** 2;
    normB += ratings2[i] ** 2;
    ratingDistanceSum += Math.abs(ratings1[i] - ratings2[i]);
  }

  if (normA == 0 || normB == 0) return 0;

  const cosineSimilarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  const ratingDistance = ratingDistanceSum / ratings1.length;
  const adjustedWeight = cosineSimilarity * (1 / (1 + ratingDistance));


  return adjustedWeight.toFixed(3)
};
