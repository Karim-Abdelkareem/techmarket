export const categoryConfig = {
  "mobile-tablets": {
    title: "Mobile & Tablets",
    apiEndpoint: "/api/products?category=mobile-tablets",
  },
  accessories: {
    title: "Accessories",
    children: {
      cables: {
        title: "Cables",
        apiEndpoint: "/api/products?productType=cables",
      },
      chargers: {
        title: "Chargers",
        apiEndpoint: "/api/products?productType=chargers",
      },
      "power-bank": {
        title: "Power Bank",
        apiEndpoint: "/api/products?productType=power-bank",
      },
      cases: {
        title: "Cases & Covers",
        apiEndpoint: "/api/products?productType=cases",
      },
      "screen-protector": {
        title: "Screen Protector",
      },
    },
  },
  wearables: {
    title: "Wearables",
    children: {
      bands: {
        title: "Smart Bands",
      },
      watches: {
        title: "Smart Watches",
      },
    },
  },
  audio: {
    title: "Audio",
    children: {
      "over-ear": {
        title: "Over Ear",
        apiEndpoint: "/api/products?productType=over-ear",
      },
      "in-ear": {
        title: "In Ear",
        apiEndpoint: "/api/products?productType=in-ear",
      },
      wireless: {
        title: "Wireless",
        apiEndpoint: "/api/products?productType=wireless",
      },
    },
  },
  laptops: {
    title: "Laptops",
    children: {
      student: {
        title: "Student",
        apiEndpoint: "/api/products?productType=student",
      },
      professional: {
        title: "Professional",
        apiEndpoint: "/api/products?productType=professional",
      },
      gaming: {
        title: "Gaming",
        apiEndpoint: "/api/products?productType=gaming",
      },
      x360: {
        title: "X360",
        apiEndpoint: "/api/products?productType=x360",
      },
      business: {
        title: "Business",
        apiEndpoint: "/api/products?productType=business",
      },
      macbook: {
        title: "MacBook",
        apiEndpoint: "/api/products?productType=macbook",
      },
    },
  },
};
