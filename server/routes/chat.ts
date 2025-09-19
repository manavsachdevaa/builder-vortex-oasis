import { RequestHandler } from "express";
import type { ChatMessage, ChatRequest, ChatResponse } from "@shared/api";

function generateReply(messages: ChatMessage[]): ChatMessage {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = (lastUser?.content || "").toLowerCase();

  const replyParts: string[] = [];

  // Simple intents
  if (/eligible|eligibility|can i donate|who can donate/.test(text)) {
    replyParts.push(
      "Eligibility basics: age 18–65, weight > 50 kg, hemoglobin within range, no donation in last 56 days (84 for platelets/plasma policies vary).",
      "Avoid donating if you have fever, infection, are pregnant, or on certain medications. Always confirm with your local blood bank.",
    );
  }

  if (/badge|reward|points|tier/.test(text)) {
    replyParts.push(
      "Badges & rewards: Bronze at 1 verified donation, Silver at 3, Gold at 5+. Perks may include partner discounts.",
    );
  }

  if (/sos|urgent|emergen/.test(text)) {
    replyParts.push(
      "SOS alerts broadcast urgent hospital requests to nearby compatible donors. Enable location for the best matches.",
    );
  }

  if (/location|nearby|distance|km/.test(text)) {
    replyParts.push(
      "We estimate proximity based on your location to prioritize nearby hospitals and faster response times.",
    );
  }

  if (/blood type|compatible|match|o\+|o-|a\+|a-|b\+|b-|ab\+|ab-/.test(text)) {
    replyParts.push(
      "Compatibility quick tips: O- donors are universal donors; AB+ patients are universal recipients. Always follow lab crossmatch.",
    );
  }

  if (/hello|hi|hey|help|what can you do/.test(text)) {
    replyParts.push(
      "Hi! I can answer questions about donor eligibility, SOS alerts, rewards, and how matching works. Ask me anything!",
    );
  }

  if (replyParts.length === 0) {
    replyParts.push(
      "I can help with donor eligibility, compatibility, SOS alerts, and rewards. Could you clarify your question?",
    );
  }

  const message: ChatMessage = { role: "assistant", content: replyParts.join(" \n\n") };
  return message;
}

export const handleChat: RequestHandler = (req, res) => {
  const body = req.body as ChatRequest | undefined;
  const messages = Array.isArray(body?.messages) ? body!.messages : [];
  const message = generateReply(messages);
  const response: ChatResponse = { message };
  res.status(200).json(response);
};
