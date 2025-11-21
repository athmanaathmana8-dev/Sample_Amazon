/**
 * Product Reviews Data
 * Dummy reviews for products
 */
export const productReviews = {
  1: [
    {
      id: 1,
      userName: "Alex Johnson",
      rating: 5,
      date: "2024-01-15",
      comment: "Excellent mouse! Very responsive and comfortable to use. Great for both work and gaming."
    },
    {
      id: 2,
      userName: "Sarah Williams",
      rating: 4,
      date: "2024-01-10",
      comment: "Good quality mouse, battery lasts long. Only minor issue is the scroll wheel could be smoother."
    },
    {
      id: 3,
      userName: "Mike Chen",
      rating: 5,
      date: "2024-01-05",
      comment: "Best wireless mouse I've owned. Highly recommend!"
    }
  ],
  2: [
    {
      id: 1,
      userName: "Emily Davis",
      rating: 5,
      date: "2024-01-20",
      comment: "Amazing keyboard! The mechanical switches feel great and typing is so satisfying."
    },
    {
      id: 2,
      userName: "David Brown",
      rating: 4,
      date: "2024-01-18",
      comment: "Solid build quality. The RGB lighting is nice but could be brighter."
    }
  ],
  3: [
    {
      id: 1,
      userName: "Lisa Anderson",
      rating: 5,
      date: "2024-01-12",
      comment: "Fast charging cable, works perfectly with my devices. Great value for money!"
    },
    {
      id: 2,
      userName: "Tom Wilson",
      rating: 4,
      date: "2024-01-08",
      comment: "Good cable, durable. No complaints so far."
    }
  ],
  4: [
    {
      id: 1,
      userName: "Jennifer Martinez",
      rating: 5,
      date: "2024-01-22",
      comment: "Perfect laptop stand! Adjustable height and very sturdy. Helps with my posture too."
    }
  ],
  5: [
    {
      id: 1,
      userName: "Robert Taylor",
      rating: 4,
      date: "2024-01-14",
      comment: "Good webcam quality for video calls. Auto-focus works well."
    }
  ],
  6: [
    {
      id: 1,
      userName: "Amanda White",
      rating: 5,
      date: "2024-01-19",
      comment: "Great sound quality and comfortable to wear for hours. Battery life is excellent!"
    },
    {
      id: 2,
      userName: "Chris Lee",
      rating: 4,
      date: "2024-01-16",
      comment: "Good headphones, noise cancellation works well. Only wish the bass was a bit stronger."
    }
  ],
  7: [
    {
      id: 1,
      userName: "Jessica Moore",
      rating: 5,
      date: "2024-01-21",
      comment: "Best sunscreen I've used! Non-greasy and provides excellent protection. Perfect for daily use."
    },
    {
      id: 2,
      userName: "Daniel Garcia",
      rating: 5,
      date: "2024-01-17",
      comment: "Great SPF 50 protection. Doesn't leave a white cast and feels light on the skin."
    }
  ],
  8: [
    {
      id: 1,
      userName: "Sophie Turner",
      rating: 5,
      date: "2024-01-13",
      comment: "Classic novel! Beautiful writing and compelling story. A must-read for everyone."
    },
    {
      id: 2,
      userName: "James Parker",
      rating: 4,
      date: "2024-01-09",
      comment: "Great book, though the print could be slightly larger. Overall satisfied with the purchase."
    }
  ],
  9: [
    {
      id: 1,
      userName: "Olivia Green",
      rating: 5,
      date: "2024-01-23",
      comment: "Amazing makeup set! All the colors are pigmented and blend beautifully. Great value!"
    },
    {
      id: 2,
      userName: "Emma Thompson",
      rating: 5,
      date: "2024-01-20",
      comment: "Professional quality makeup. The brushes included are soft and work perfectly."
    }
  ],
  10: [
    {
      id: 1,
      userName: "Noah Adams",
      rating: 5,
      date: "2024-01-18",
      comment: "Perfect water bottle! Keeps drinks cold for hours. Stainless steel is durable and easy to clean."
    },
    {
      id: 2,
      userName: "Mia Rodriguez",
      rating: 4,
      date: "2024-01-15",
      comment: "Good bottle, leak-proof cap. Only wish it came in more colors."
    }
  ],
  11: [
    {
      id: 1,
      userName: "Ethan Harris",
      rating: 5,
      date: "2024-01-24",
      comment: "Premium sound quality! The noise cancellation is incredible. Worth every penny!"
    },
    {
      id: 2,
      userName: "Ava Clark",
      rating: 5,
      date: "2024-01-21",
      comment: "Best headphones I've ever owned. Comfortable for long listening sessions and amazing bass."
    },
    {
      id: 3,
      userName: "Lucas Lewis",
      rating: 4,
      date: "2024-01-19",
      comment: "Great headphones, though the price is a bit high. Sound quality is excellent though."
    }
  ],
  12: [
    {
      id: 1,
      userName: "Isabella Walker",
      rating: 5,
      date: "2024-01-25",
      comment: "Amazing phone! The camera quality is outstanding and the performance is lightning fast. Love it!"
    },
    {
      id: 2,
      userName: "Mason Hall",
      rating: 5,
      date: "2024-01-22",
      comment: "Best iPhone yet! The Pro features are worth it. Battery life is great too."
    },
    {
      id: 3,
      userName: "Charlotte Young",
      rating: 4,
      date: "2024-01-20",
      comment: "Excellent phone, though it's quite expensive. The display and camera are top-notch."
    },
    {
      id: 4,
      userName: "Benjamin King",
      rating: 5,
      date: "2024-01-18",
      comment: "Upgraded from iPhone 13 and the difference is noticeable. Highly recommend!"
    }
  ]
};

/**
 * Get reviews for a product
 * @param {number} productId - Product ID
 * @returns {Array} Array of reviews
 */
export const getProductReviews = (productId) => {
  return productReviews[productId] || [];
};

/**
 * Calculate average rating for a product
 * @param {number} productId - Product ID
 * @returns {number} Average rating
 */
export const getAverageRating = (productId) => {
  const reviews = getProductReviews(productId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

