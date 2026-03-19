export const processJob = async (payload: any) => {
  const text = payload.message || "";

  return {
    extractedName: extractName(text),
    priority: detectPriority(text),
    reply: generateReply(text),
  };
};

const extractName = (text: string) => {
  // أبسط parser: الكلمة الثالثة غالبًا الاسم
  return text.split(" ")[2] || "غير معروف";
};

const detectPriority = (text: string) => {
  return text.includes("بسرعة") ? "urgent" : "normal";
};

const generateReply = (text: string) => {
  return "تم استلام طلبك 💖";
};
