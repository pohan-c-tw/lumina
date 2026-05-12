import "dotenv/config";
import {
  AgentHttpRequestBodySchema,
  parseAgentToolsHttpRequestBody,
  type AgentHttpRequestBody,
  type ParsedAgentToolsHttpRequestBody,
} from "@lumina/shared/agentProtocol";
import cors from "cors";
import express from "express";
import { debugLog } from "./logger";
import {
  runAgentStepFromToolResults,
  runAgentStepFromUserInput,
} from "./runtime";
import { listSessionIds } from "./session";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/agent", async (req, res) => {
  let body: AgentHttpRequestBody;

  try {
    body = AgentHttpRequestBodySchema.parse(req.body);
  } catch (error) {
    console.error("[POST /agent] invalid body", error);
    return res.status(400).json({ error: "Invalid body" });
  }

  debugLog("[POST /agent] request", {
    hasSessionId: Boolean(body.sessionId),
    textLength: body.text.length,
  });

  try {
    const { sessionId, text } = body;
    const result = await runAgentStepFromUserInput({ sessionId, text });
    return res.json(result);
  } catch (error) {
    console.error("[POST /agent] runAgentStepFromUserInput error", error);
    return res.status(500).json({ error: "Agent 執行失敗" });
  }
});

app.post("/agent/tools", async (req, res) => {
  let body: ParsedAgentToolsHttpRequestBody;

  try {
    body = parseAgentToolsHttpRequestBody(req.body);
  } catch (error) {
    console.error("[POST /agent/tools] invalid body", error);
    return res.status(400).json({ error: "Invalid body" });
  }

  debugLog("[POST /agent/tools] request", {
    sessionId: body.sessionId,
    toolNames: body.toolResults.map((toolResult) => toolResult.name),
  });

  try {
    const { sessionId, toolResults } = body;
    const result = await runAgentStepFromToolResults({
      sessionId,
      toolResults,
    });
    return res.json(result);
  } catch (error) {
    console.error(
      "[POST /agent/tools] runAgentStepFromToolResults error",
      error,
    );
    return res.status(500).json({ error: "Agent 執行失敗" });
  }
});

app.get("/list-session-ids", async (_req, res) => {
  res.json({ sessions: listSessionIds() });
});

const port = process.env.PORT ?? 8787;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
