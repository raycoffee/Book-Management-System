# Book Recommendation System

## 1. Setup and Running Instructions

### Prerequisites
- Docker
- Docker Compose

### Setup Steps
1. Clone the repository
```bash
git clone https://github.com/raycoffee/Book-Management-System.git
cd Book-Management-System
```

2. Build the Docker containers
```bash
docker-compose build
```

3. Start the application
```bash
docker-compose up
```

The application will be available at:
- Frontend: `http://localhost:80`
- Backend API: `http://localhost:3001`

### Docker Configuration
```yaml
version: '3'

services:
  server:
    build: ./server
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
    networks:
      - app-network

  client:
    build: ./client
    ports:
      - "80:80" 
    environment:
      NODE_ENV: production
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## 2. Deployment to Google Cloud Engine

### Deployment Process
1. Make your changes to the codebase
2. Commit and push to the main branch:
```bash
git add .
git commit -m "Your meaningful commit message"
git push origin main
```

That's it! GitHub Actions will automatically:
- Build the Docker containers
- Push to Google Cloud Engine
- Deploy the updated application

## 3. Recommendation Engine and Bonus Features

### Recommendation Engine
The system implements user-based collaborative filtering with enhanced cosine similarity calculations:

```javascript
const cosineSimilarityDistance = (ratings1, ratings2) => {
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

  return adjustedWeight.toFixed(3);
};
```

The recommendation generation process:
```javascript
const recommendBooks = async (req, res) => {
  try {
    const { predectiveRatings } = req;
    const recommendedBooks = [];

    for (let bookId of Object.keys(predectiveRatings)) {
      const book = await Book.findById(bookId);
      if (!book) continue;

      recommendedBooks.push({
        book,
        predictiveRating: predectiveRatings[bookId],
      });
    }

    recommendedBooks.sort((a, b) => {
      return b.predictiveRating - a.predictiveRating;
    });

    res.status(200).json(recommendedBooks);
  } catch (error) {
    console.error("Error fetching recommended books:", error);
    res.status(500).json({ error: "Failed to fetch recommended books." });
  }
};
```

Key Features:
- Cosine similarity measurement
- Rating distance incorporation
- Adjusted weighting system
- Sorted recommendations by predicted rating

### Bonus Features

1. **JWT Authentication System**
   - Secure cookie-based JWT authentication
   - Protected routes with token verification
   - User validation for each request
   
   Implementation:
   ```javascript
   export const authenticateToken = async (req, res, next) => {
     const token = req.cookies?.jwt;

     if (!token) {
       return res.status(401).json({ error: "No token provided." });
     }

     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);

       const user = await User.findById(decoded.id);

       if (!user) {
         return res.status(404).json({ error: "User not found." });
       }
       req.user = user;

       next();
     } catch (error) {
       return res.status(403).json({ error: "Invalid or expired token." });
     }
   };
   ```
   
   Features:
   - JWT token extraction from cookies
   - Token verification using JWT_SECRET
   - User existence validation
   - Detailed error handling for different scenarios
   - Secure middleware implementation

2. **Automated CI/CD Pipeline**
   - GitHub Actions integration for automated deployment
   - Direct deployment to Google Cloud Engine
   - Docker container management
   - Zero-downtime deployment process
   - Automatic builds on push to main branch
