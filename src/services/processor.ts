export const processJob = async (payload: any) => {
  const text = payload.message || "";

  const products = ["شنطة", "تيشيرت", "مخدة", "شال", "فستان"];

  const foundProduct = products.find((p) => text.includes(p)) || "منتج مخصص";

  const nameMatch = text.match(/اسم\s+(\S+)/);
  const extractedName = nameMatch ? nameMatch[1] : "غير معروف";

  const priority =
    text.includes("بسرعة") || text.includes("مستعجل") ? "urgent" : "normal";

  return {
    extractedName,
    product: foundProduct,
    priority,
    reply: `تم استلام طلبك لتطريز ${foundProduct} لـ ${extractedName} 💖، سيتم التواصل معك قريباً.`,
  };
};
