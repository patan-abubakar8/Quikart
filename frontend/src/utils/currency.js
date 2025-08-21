// Currency formatting utility for Indian Rupees
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

// Convert USD to INR (approximate rate: 1 USD = 83 INR)
export const convertToINR = (usdPrice) => {
  return Math.round(usdPrice * 83);
};

// Format price with Indian number system (lakhs, crores)
export const formatIndianPrice = (price) => {
  if (price >= 10000000) { // 1 crore
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  } else if (price >= 100000) { // 1 lakh
    return `₹${(price / 100000).toFixed(1)} L`;
  } else if (price >= 1000) { // 1 thousand
    return `₹${(price / 1000).toFixed(1)}K`;
  } else {
    return formatPrice(price);
  }
};