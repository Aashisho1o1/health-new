import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft, Send, CheckCircle, AlertCircle, Lightbulb, ChevronDown,
  ChevronUp, Eye, EyeOff, RotateCcw, Flag, ZoomIn, ZoomOut, X,
  MessageSquare, Stethoscope, FileText, Info, Tag, ExternalLink, Minus, Plus
} from "lucide-react";
import { CASES, type PatientCase } from "../data/cases";

// Types

type MessageRole = "patient" | "student" | "system";

interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  revealsClues?: string[];
}

type Phase = "interview" | "diagnosed";

// Helpers

function generateId() {
  return Math.random().toString(36).slice(2);
}

function getPatientResponse(patientCase: PatientCase, input: string, revealedClueIds: Set<string>): { response: string; newClues: string[] } {
  const lower = input.toLowerCase();
  for (const rule of patientCase.responseRules) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      const newClues = (rule.revealsClues || []).filter(id => !revealedClueIds.has(id));
      return { response: rule.response, newClues };
    }
  }
  const idx = Math.floor(Math.random() * patientCase.defaultResponses.length);
  return { response: patientCase.defaultResponses[idx], newClues: [] };
}

function checkDiagnosis(patientCase: PatientCase, input: string): boolean {
  const lower = input.toLowerCase();
  return patientCase.acceptedAnswers.some(ans => lower.includes(ans));
}

function getPostDiagnosisResponse(patientCase: PatientCase, input: string): string {
  const lower = input.toLowerCase();
  for (const rule of patientCase.postDiagnosisRules) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      return rule.response;
    }
  }
  return patientCase.postDiagnosisDefault;
}

// Category colors

const CATEGORY_STYLE: Record<string, { color: string; bg: string }> = {
  "Chief Complaint": { color: "#af1d27", bg: "#fdf2f3" },
  "Symptom": { color: "#005a93", bg: "#e8f1f8" },
  "History": { color: "#ed9822", bg: "#fff5e6" },
  "Social": { color: "#2499a9", bg: "#e4f4f7" },
  "Examination Finding": { color: "#42a083", bg: "#e8f4f1" },
};

// Main component

export function Interview() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const patientCase = CASES.find(c => c.id === caseId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("interview");
  const [revealedClueIds, setRevealedClueIds] = useState<Set<string>>(new Set());
  const [showDiagnosisInput, setShowDiagnosisInput] = useState(false);
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [diagnosisError, setDiagnosisError] = useState("");
  const [showCluesPanel, setShowCluesPanel] = useState(true);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [isPatientTyping, setIsPatientTyping] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Init with opening message
  useEffect(() => {
    if (!patientCase) return;
    setMessages([
      {
        id: generateId(),
        role: "patient",
        text: patientCase.openingMessage,
        timestamp: new Date(),
      },
    ]);
  }, [patientCase]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isPatientTyping]);

  if (!patientCase) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 60px)", fontFamily: "var(--font-ui)" }}>
        <div style={{ textAlign: "center" }}>
          <AlertCircle size={40} color="#e0e0e0" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ color: "#1a1a1a", marginBottom: 8 }}>Case not found</h2>
          <button onClick={() => navigate("/cases")} style={{ padding: "8px 20px", background: "#af1d27", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 14 }}>
            Back to Cases
          </button>
        </div>
      </div>
    );
  }

  // Actions

  const sendMessage = () => {
    if (!input.trim() || isPatientTyping) return;
    const studentMsg: Message = { id: generateId(), role: "student", text: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, studentMsg]);
    setInput("");
    setMessageCount(c => c + 1);

    if (phase === "interview") {
      setIsPatientTyping(true);
      const { response, newClues } = getPatientResponse(patientCase, input, revealedClueIds);
      setTimeout(() => {
        setIsPatientTyping(false);
        if (newClues.length > 0) {
          setRevealedClueIds(prev => new Set([...prev, ...newClues]));
        }
        const patientMsg: Message = { id: generateId(), role: "patient", text: response, timestamp: new Date(), revealsClues: newClues };
        setMessages(prev => [...prev, patientMsg]);
      }, 900 + Math.random() * 600);
    } else {
      // Post-diagnosis
      setIsPatientTyping(true);
      const response = getPostDiagnosisResponse(patientCase, input);
      setTimeout(() => {
        setIsPatientTyping(false);
        setMessages(prev => [...prev, { id: generateId(), role: "patient", text: response, timestamp: new Date() }]);
      }, 800 + Math.random() * 500);
    }
  };

  const submitDiagnosis = () => {
    if (!diagnosisInput.trim()) return;
    setDiagnosisError("");
    if (checkDiagnosis(patientCase, diagnosisInput)) {
      // Correct!
      const successMsg: Message = {
        id: generateId(), role: "system",
        text: `Correct diagnosis: ${patientCase.condition}. Well done - you've identified the condition. The clinical image is now available. Continue your consultation to explore the findings in depth.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, successMsg]);
      setIsPatientTyping(true);
      setTimeout(() => {
        setIsPatientTyping(false);
        setMessages(prev => [...prev, { id: generateId(), role: "patient", text: patientCase.correctDiagnosisResponse, timestamp: new Date() }]);
        setPhase("diagnosed");
        setShowImagePanel(false);
        setShowDiagnosisInput(false);
        setDiagnosisInput("");
      }, 1200);
    } else {
      setWrongAttempts(w => w + 1);
      const idx = Math.min(wrongAttempts, patientCase.wrongDiagnosisResponses.length - 1);
      setDiagnosisError(`Incorrect. Try a more specific clinical diagnosis.`);
      setIsPatientTyping(true);
      setTimeout(() => {
        setIsPatientTyping(false);
        setMessages(prev => [...prev, { id: generateId(), role: "patient", text: patientCase.wrongDiagnosisResponses[idx], timestamp: new Date() }]);
      }, 700);
    }
  };

  const reset = () => {
    setMessages([{ id: generateId(), role: "patient", text: patientCase.openingMessage, timestamp: new Date() }]);
    setPhase("interview");
    setRevealedClueIds(new Set());
    setShowDiagnosisInput(false);
    setDiagnosisInput("");
    setWrongAttempts(0);
    setDiagnosisError("");
    setMessageCount(0);
    setShowImagePanel(false);
    setImageZoom(1);
    setImageModalOpen(false);
  };

  const revealedClues = patientCase.clues.filter(cl => revealedClueIds.has(cl.id));
  const unrevealed = patientCase.clues.filter(cl => !revealedClueIds.has(cl.id));
  const cluePercent = Math.round((revealedClues.length / patientCase.clues.length) * 100);
  const isImageStudyOpen = phase === "diagnosed" && showImagePanel;

  // Render

  return (
    <div style={{ fontFamily: "var(--font-ui)", height: "calc(100vh - 60px)", display: "flex", flexDirection: "column", background: "#f7f7f6", overflow: "hidden" }}>

      {/* Context bar */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e0e0e0", padding: "8px 24px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, flexWrap: "wrap" }}>
        <button onClick={() => navigate("/cases")}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", border: "1px solid #e0e0e0", borderRadius: 6, background: "#fff", color: "#5d615a", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-ui)" }}>
          <ArrowLeft size={13} /> Cases
        </button>
        <span style={{ color: "#e0e0e0" }}>{">"}</span>
        <div style={{ display: "flex", align: "center", gap: 8 }}>
          <img src={patientCase.patient.portrait} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", objectPosition: "top" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{patientCase.patient.name}, {patientCase.patient.age}</span>
          <span style={{ fontSize: 12, color: "#5d615a" }}>| {patientCase.setting}</span>
        </div>

        {/* Phase indicator */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {phase === "diagnosed" ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "#e8f4f1", border: "1px solid #b8ddd5", borderRadius: 20, fontSize: 12, color: "#42a083", fontWeight: 600 }}>
              <CheckCircle size={13} /> Diagnosis confirmed
            </span>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "#f0f6fb", border: "1px solid #cce0f0", borderRadius: 20, fontSize: 12, color: "#005a93", fontWeight: 500 }}>
              <MessageSquare size={13} /> Consultation in progress
            </span>
          )}
          {/* Clue progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#5d615a" }}>{revealedClues.length}/{patientCase.clues.length} findings</span>
            <div style={{ width: 60, height: 4, background: "#e0e0e0", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${cluePercent}%`, background: "#af1d27", borderRadius: 4, transition: "width 0.4s ease" }} />
            </div>
          </div>
          <button onClick={reset}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", border: "1px solid #e0e0e0", borderRadius: 6, background: "#fff", color: "#5d615a", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-ui)" }}>
            <RotateCcw size={12} /> Restart
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left column: notes before diagnosis, image after it is opened */}
        {isImageStudyOpen ? (
          /* POST-DIAGNOSIS: Image panel */
          <div style={{ width: "44%", flexShrink: 0, display: "flex", flexDirection: "column", borderRight: "1px solid #e0e0e0", background: "#fff", overflow: "hidden" }}>
            {/* Image toolbar */}
            <div style={{ padding: "10px 16px", borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "#fafafa" }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#42a083", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: 8 }}>Image Study View</span>
                <span style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>{patientCase.condition}</span>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {[
                  { icon: EyeOff, label: "Hide image", onClick: () => setShowImagePanel(false) },
                  { icon: ZoomIn, label: "Zoom in", onClick: () => setImageZoom(z => Math.min(z + 0.3, 3)) },
                  { icon: ZoomOut, label: "Zoom out", onClick: () => setImageZoom(z => Math.max(z - 0.3, 0.6)) },
                  { icon: RotateCcw, label: "Reset", onClick: () => setImageZoom(1) },
                  { icon: ExternalLink, label: "Fullscreen", onClick: () => setImageModalOpen(true) },
                ].map(({ icon: Icon, label, onClick }) => (
                  <button key={label} title={label} onClick={onClick}
                    style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e0e0e0", borderRadius: 5, background: "#fff", color: "#5d615a", cursor: "pointer" }}>
                    <Icon size={13} />
                  </button>
                ))}
              </div>
            </div>

            {/* Image */}
            <div style={{ flex: 1, overflow: "hidden", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <img src={patientCase.medicalImage} alt={patientCase.medicalImageTitle}
                style={{ display: "block", maxWidth: "100%", maxHeight: "100%", objectFit: "contain", transform: `scale(${imageZoom})`, transformOrigin: "center center", transition: "transform 0.25s ease" }} />
              {imageZoom !== 1 && (
                <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 4 }}>
                  {Math.round(imageZoom * 100)}%
                </div>
              )}
            </div>

            {/* Image caption */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #e0e0e0", background: "#fafafa", flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 5 }}>{patientCase.medicalImageTitle}</div>
              <p style={{ fontSize: 12, color: "#5d615a", lineHeight: 1.6 }}>{patientCase.medicalImageCaption}</p>
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {patientCase.learningObjectives.slice(0, 2).map((obj, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 5, fontSize: 11, color: "#005a93", background: "#e8f1f8", padding: "4px 10px", borderRadius: 6, lineHeight: 1.5, maxWidth: "100%" }}>
                    <Info size={10} style={{ marginTop: 1, flexShrink: 0 }} /> {obj}
                  </div>
                ))}
              </div>
            </div>

            {/* Revealed findings summary */}
            <div style={{ padding: "10px 16px", borderTop: "1px solid #e0e0e0", background: "#fff", flexShrink: 0, maxHeight: 140, overflowY: "auto" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#5d615a", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>
                Clinical Findings - {revealedClues.length}/{patientCase.clues.length} uncovered
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {patientCase.clues.map(cl => {
                  const found = revealedClueIds.has(cl.id);
                  return (
                    <span key={cl.id}
                      title={cl.description}
                      style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: found ? "#e8f4f1" : "#f4f4f4", color: found ? "#42a083" : "#c0c0c0", border: `1px solid ${found ? "#b8ddd5" : "#e8e8e8"}`, display: "flex", alignItems: "center", gap: 4 }}>
                      {found ? <CheckCircle size={9} /> : <span style={{ width: 9, height: 9, borderRadius: "50%", border: "1.5px solid #ccc", display: "inline-block" }} />}
                      {cl.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Notes panel */
          <div style={{ width: "300px", flexShrink: 0, borderRight: "1px solid #e0e0e0", background: "#ffffff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Patient card */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img src={patientCase.patient.portrait} alt={patientCase.patient.name}
                style={{ width: "100%", height: 150, objectFit: "cover", objectPosition: "top center", filter: "brightness(0.7)", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: 14, left: 16 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{patientCase.patient.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>{patientCase.patient.age} yrs | {patientCase.patient.gender}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{patientCase.patient.occupation} | {patientCase.setting}</div>
              </div>
              <div style={{ position: "absolute", top: 12, right: 12, padding: "3px 10px", background: "rgba(0,0,0,0.55)", borderRadius: 20, fontSize: 10, color: "#fff" }}>
                {patientCase.system}
              </div>
            </div>

            {/* Clues section */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#5d615a", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                  Clinical Findings
                </div>
                <button onClick={() => setShowCluesPanel(s => !s)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#5d615a", display: "flex", alignItems: "center" }}>
                  {showCluesPanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5d615a", marginBottom: 4 }}>
                  <span>{revealedClues.length} of {patientCase.clues.length} uncovered</span>
                  <span>{cluePercent}%</span>
                </div>
                <div style={{ height: 5, background: "#e0e0e0", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${cluePercent}%`, background: "#af1d27", borderRadius: 4, transition: "width 0.5s ease" }} />
                </div>
              </div>

              {showCluesPanel && (
                <div>
                  {/* Revealed clues */}
                  {revealedClues.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      {revealedClues.map(cl => {
                        const cat = CATEGORY_STYLE[cl.category] || { color: "#5d615a", bg: "#f4f4f4" };
                        return (
                          <div key={cl.id} style={{ marginBottom: 7, padding: "8px 10px", background: cat.bg, borderRadius: 8, borderLeft: `3px solid ${cat.color}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 4 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.3 }}>{cl.label}</div>
                              <CheckCircle size={12} color={cat.color} style={{ flexShrink: 0, marginTop: 1 }} />
                            </div>
                            <div style={{ fontSize: 10, color: cat.color, fontWeight: 500, marginTop: 2 }}>{cl.category}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Unrevealed */}
                  {unrevealed.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, color: "#9e9e9e", marginBottom: 6, fontStyle: "italic" }}>Still to uncover:</div>
                      {unrevealed.map(cl => (
                        <div key={cl.id} style={{ marginBottom: 5, padding: "7px 10px", background: "#f7f7f6", borderRadius: 8, borderLeft: "3px solid #e0e0e0" }}>
                          <div style={{ fontSize: 12, color: "#b0b0b0" }}>Ask about {cl.category.toLowerCase()}...</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Hint toggle */}
              {messageCount >= 4 && phase === "interview" && (
                <div style={{ marginTop: 14, borderTop: "1px solid #f0f0f0", paddingTop: 14 }}>
                  <button onClick={() => setShowHint(h => !h)}
                    style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "7px 10px", background: "#fff5e6", border: "1px solid #f5d6a0", borderRadius: 7, fontSize: 12, color: "#ed9822", cursor: "pointer", fontFamily: "var(--font-ui)", fontWeight: 500 }}>
                    <Lightbulb size={13} /> {showHint ? "Hide hint" : "Show a hint"}
                  </button>
                  {showHint && unrevealed.length > 0 && (
                    <div style={{ marginTop: 8, padding: "8px 12px", background: "#fff5e6", borderRadius: 7, fontSize: 12, color: "#7f4a00", lineHeight: 1.6 }}>
                      Tip: try asking about <strong>{unrevealed[0].category.toLowerCase()}</strong> - you haven't covered that area yet.
                    </div>
                  )}
                </div>
              )}

              {/* Learning objectives */}
              <div style={{ marginTop: 16, borderTop: "1px solid #f0f0f0", paddingTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#5d615a", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>Learning Objectives</div>
                {patientCase.learningObjectives.map((obj, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, fontSize: 11, color: "#5d615a", lineHeight: 1.5 }}>
                    <span style={{ color: "#af1d27", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    {obj}
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnosis button area */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #e0e0e0", flexShrink: 0 }}>
              {phase === "diagnosed" ? (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>Image study ready</div>
                  <p style={{ fontSize: 12, color: "#5d615a", lineHeight: 1.6, marginBottom: 10 }}>
                    Open the case image to review the finding on the left while you continue the discussion on the right.
                  </p>
                  <button onClick={() => setShowImagePanel(true)}
                    style={{ width: "100%", padding: "10px 0", background: "#af1d27", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-ui)", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                    <Eye size={15} />
                    Open case image
                  </button>
                </div>
              ) : !showDiagnosisInput ? (
                <button onClick={() => { setShowDiagnosisInput(true); setDiagnosisError(""); }}
                  disabled={messageCount < 3}
                  style={{ width: "100%", padding: "10px 0", background: messageCount >= 3 ? "#af1d27" : "#f4f4f4", color: messageCount >= 3 ? "#fff" : "#c0c0c0", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: messageCount >= 3 ? "pointer" : "not-allowed", fontFamily: "var(--font-ui)", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  <Stethoscope size={15} />
                  {messageCount < 3 ? "Ask more questions first..." : "Submit my diagnosis"}
                </button>
              ) : (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>Your diagnosis:</div>
                  <input type="text" value={diagnosisInput} onChange={e => { setDiagnosisInput(e.target.value); setDiagnosisError(""); }}
                    placeholder="e.g. Acute appendicitis..." autoFocus
                    onKeyDown={e => { if (e.key === "Enter") submitDiagnosis(); if (e.key === "Escape") { setShowDiagnosisInput(false); setDiagnosisError(""); } }}
                    style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e0e0e0", borderRadius: 7, fontSize: 14, fontFamily: "var(--font-ui)", outline: "none", boxSizing: "border-box", marginBottom: 8 }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#af1d27")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")} />
                  {diagnosisError && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#af1d27", marginBottom: 8 }}>
                      <AlertCircle size={12} /> {diagnosisError}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 7 }}>
                    <button onClick={submitDiagnosis}
                      style={{ flex: 1, padding: "8px 0", background: "#af1d27", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-ui)" }}>
                      Confirm
                    </button>
                    <button onClick={() => { setShowDiagnosisInput(false); setDiagnosisError(""); }}
                      style={{ padding: "8px 12px", background: "#fff", color: "#5d615a", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-ui)" }}>
                      Cancel
                    </button>
                  </div>
                  {wrongAttempts > 0 && (
                    <div style={{ marginTop: 8, fontSize: 11, color: "#5d615a" }}>
                      {wrongAttempts} incorrect attempt{wrongAttempts > 1 ? "s" : ""} - try to be more specific.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right column: chat interface */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Chat header */}
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #e0e0e0", background: "#ffffff", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <img src={patientCase.patient.portrait} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", objectPosition: "top", border: "2px solid #e0e0e0" }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{patientCase.patient.name}</div>
              <div style={{ fontSize: 11, color: "#5d615a" }}>
                {phase === "interview" ? "Awaiting your questions - interview in progress" : isImageStudyOpen ? `Image study open: ${patientCase.condition} | Discuss what you see` : `Diagnosis confirmed: ${patientCase.condition} | Open the image from the left to start reviewing it`}
              </div>
            </div>
            {phase === "diagnosed" && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", background: "#e8f4f1", border: "1px solid #b8ddd5", borderRadius: 20, fontSize: 12, color: "#42a083", fontWeight: 600 }}>
                <CheckCircle size={12} /> {patientCase.condition}
              </div>
            )}
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Instruction banner */}
            {phase === "interview" && messages.length === 1 && (
              <div style={{ padding: "10px 14px", background: "#f0f6fb", border: "1px solid #cce0f0", borderRadius: 8, fontSize: 13, color: "#005a93", lineHeight: 1.6 }}>
                <strong>Your role:</strong> You are the doctor. Ask this patient follow-up questions to uncover their symptoms, history, and risk factors. Once you have enough information, submit your diagnosis using the panel on the left.
              </div>
            )}

            {phase === "diagnosed" && (
              <div style={{ padding: "10px 14px", background: "#e8f4f1", border: "1px solid #b8ddd5", borderRadius: 8, fontSize: 13, color: "#2d7a60", lineHeight: 1.6 }}>
                <strong>Diagnosis confirmed.</strong> Open the image on the left to turn this into a study workspace, then keep asking questions about the finding, diagnosis, or next steps.
              </div>
            )}

            {messages.map(msg => {
              if (msg.role === "system") {
                return (
                  <div key={msg.id} style={{ padding: "10px 14px", background: "#e8f4f1", border: "1px solid #b8ddd5", borderRadius: 10, fontSize: 13, color: "#2d7a60", lineHeight: 1.6, fontWeight: 500 }}>
                    <CheckCircle size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "text-bottom" }} />
                    {msg.text}
                  </div>
                );
              }

              const isPatient = msg.role === "patient";
              return (
                <div key={msg.id} style={{ display: "flex", flexDirection: isPatient ? "row" : "row-reverse", gap: 10, alignItems: "flex-end" }}>
                  {isPatient && (
                    <img src={patientCase.patient.portrait} alt="" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", objectPosition: "top", flexShrink: 0, border: "1.5px solid #e0e0e0" }} />
                  )}
                  <div style={{ maxWidth: "70%" }}>
                    <div style={{ fontSize: 10, color: "#9e9e9e", marginBottom: 3, textAlign: isPatient ? "left" : "right" }}>
                      {isPatient ? patientCase.patient.name : "You (Doctor)"}
                    </div>
                    <div style={{
                      padding: "11px 15px",
                      borderRadius: isPatient ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
                      background: isPatient ? "#ffffff" : "#af1d27",
                      border: isPatient ? "1px solid #e0e0e0" : "none",
                      color: isPatient ? "#1a1a1a" : "#ffffff",
                      fontSize: 14,
                      lineHeight: 1.65,
                      boxShadow: isPatient ? "0 1px 4px rgba(0,0,0,0.05)" : "0 2px 8px rgba(175,29,39,0.25)",
                    }}>
                      {msg.text}
                    </div>
                    {/* New clues badge */}
                    {msg.revealsClues && msg.revealsClues.length > 0 && (
                      <div style={{ marginTop: 5, display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {msg.revealsClues.map(id => {
                          const cl = patientCase.clues.find(c => c.id === id);
                          if (!cl) return null;
                          const cat = CATEGORY_STYLE[cl.category] || { color: "#5d615a", bg: "#f4f4f4" };
                          return (
                            <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", background: cat.bg, border: `1px solid ${cat.color}30`, borderRadius: 20, fontSize: 10, color: cat.color, fontWeight: 600 }}>
                              <Tag size={9} /> {cl.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isPatientTyping && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <img src={patientCase.patient.portrait} alt="" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", objectPosition: "top", flexShrink: 0, border: "1.5px solid #e0e0e0" }} />
                <div style={{ padding: "12px 16px", background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "4px 14px 14px 14px", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#c0c0c0", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #e0e0e0", background: "#ffffff", flexShrink: 0 }}>
            {/* Suggested questions for student */}
            {phase === "interview" && messageCount < 2 && (
              <div style={{ marginBottom: 10, display: "flex", gap: 7, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "#9e9e9e", alignSelf: "center" }}>Try asking:</span>
                {["Can you describe the pain?", "When did this start?", "Any other symptoms?", "Any relevant medical history?"].map(q => (
                  <button key={q} onClick={() => setInput(q)}
                    style={{ padding: "4px 12px", background: "#f7f7f6", border: "1px solid #e0e0e0", borderRadius: 20, fontSize: 12, color: "#1a1a1a", cursor: "pointer", fontFamily: "var(--font-ui)", whiteSpace: "nowrap" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#af1d27")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#e0e0e0")}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", background: "#f7f7f6", border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "10px 12px" }}
              onFocusCapture={e => (e.currentTarget.style.borderColor = "#af1d27")}
              onBlurCapture={e => (e.currentTarget.style.borderColor = "#e0e0e0")}>
              <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                placeholder={phase === "interview" ? "Ask the patient a question... (e.g. 'Where exactly is the pain? Does anything make it better or worse?')" : "Ask about the image, the key finding, or the diagnosis to keep the study discussion going..."}
                rows={2}
                style={{ flex: 1, resize: "none", border: "none", outline: "none", fontSize: 14, color: "#1a1a1a", fontFamily: "var(--font-ui)", background: "transparent", lineHeight: 1.5 }}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
              <button onClick={sendMessage} disabled={!input.trim() || isPatientTyping}
                style={{ width: 36, height: 36, borderRadius: 8, background: input.trim() && !isPatientTyping ? "#af1d27" : "#e0e0e0", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !isPatientTyping ? "pointer" : "not-allowed", flexShrink: 0 }}>
                <Send size={15} color="#fff" />
              </button>
            </div>
            <div style={{ fontSize: 11, color: "#9e9e9e", marginTop: 6 }}>
              <kbd style={{ padding: "1px 5px", background: "#f0f0f0", borderRadius: 3, border: "1px solid #e0e0e0", fontSize: 10 }}>Enter</kbd> to send |{" "}
              <kbd style={{ padding: "1px 5px", background: "#f0f0f0", borderRadius: 3, border: "1px solid #e0e0e0", fontSize: 10 }}>Shift+Enter</kbd> new line
              {phase === "interview" && <> | Gather enough findings, then submit your diagnosis</>}
            </div>
          </div>
        </div>
      </div>

      {/* Full image modal */}
      {imageModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 100, display: "flex", flexDirection: "column" }}
          onClick={e => { if (e.target === e.currentTarget) setImageModalOpen(false); }}>
          <div style={{ padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{patientCase.medicalImageTitle}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setImageZoom(z => Math.min(z + 0.3, 4))} style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={14} /></button>
              <button onClick={() => setImageZoom(z => Math.max(z - 0.3, 0.5))} style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={14} /></button>
              <button onClick={() => setImageModalOpen(false)} style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(175,29,39,0.4)", border: "1px solid rgba(175,29,39,0.5)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} /></button>
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <img src={patientCase.medicalImage} alt={patientCase.medicalImageTitle}
              style={{ maxWidth: "none", height: `${550 * imageZoom}px`, objectFit: "contain", borderRadius: 4, transition: "height 0.25s ease" }} />
          </div>
          <div style={{ padding: "10px 24px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", maxWidth: 600, lineHeight: 1.5 }}>{patientCase.medicalImageCaption}</p>
            <button onClick={() => setImageModalOpen(false)} style={{ padding: "7px 18px", background: "#af1d27", border: "none", borderRadius: 7, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-ui)" }}>
              Return to consultation
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
