export const processJob = async (payload: any) => {
  const text = payload.message || "";

  // 1. Product Extraction & Pricing Map
  const products: Record<string, number> = {
    شنطة: 150,
    تيشيرت: 80,
    مخدة: 60,
    شال: 100,
    فستان: 350,
  };

  const foundProduct =
    Object.keys(products).find((p) => text.includes(p)) || "منتج مخصص";

  // 2. Price Estimator Action
  const estimatedPrice = products[foundProduct] || 50;

  // 3. Entity Extraction (Name Parser)
  const nameMatch = text.match(/(?:اسم|لـ|باسم)\s+(\S+)/);
  const extractedName = nameMatch ? nameMatch[1] : "غير معروف";

  // 4. Priority Detection Action
  const priority =
    text.includes("بسرعة") || text.includes("مستعجل") ? "urgent" : "normal";

  // Return the final processed results to be stored in the DB and sent as a reply
  return {
    extractedName,
    product: foundProduct,
    price: estimatedPrice,
    priority,
    reply: `تم استلام طلبك لتطريز ${foundProduct} لـ ${extractedName}. السعر التقديري: ${estimatedPrice} شيكل. سيتم التواصل معك قريباً 💖`,
  };
};
