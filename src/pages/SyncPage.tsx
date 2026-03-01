import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bluetooth,
  BluetoothSearching,
  Signal,
  CheckCircle2,
  Loader2,
  Send,
  BookOpen,
  X,
  Wifi,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { syncSyllabus } from "@/services/conceptService";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type SyncState = "bluetoothOff" | "scanning" | "found" | "connected";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

function SignalBars({ strength }: { strength: number }) {
  return (
    <div className="flex items-end gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          className={`w-1 rounded-full origin-bottom ${
            i <= strength ? "bg-success" : "bg-border"
          }`}
          style={{ height: `${8 + i * 4}px` }}
        />
      ))}
    </div>
  );
}

export default function SyncPage() {
  const [state, setState] = useState<SyncState>("bluetoothOff");
  const [loading, setLoading] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [sendingQ, setSendingQ] = useState(false);
  const { toast } = useToast();

  const turnOn = () => {
    setState("scanning");
    setTimeout(() => setState("found"), 2200);
  };

  const connect = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setState("connected");
    }, 1200);
  };

  const loadSyllabus = async () => {
    setLoading(true);
    try {
      const res = await syncSyllabus();
      toast({
        title: "Syllabus Synced",
        description: `${res.added} concept${res.added !== 1 ? "s" : ""} synced successfully`,
      });
    } catch {
      toast({
        title: "Sync Failed",
        description: "Could not sync syllabus. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendQuestion = () => {
    if (!question.trim()) return;
    setSendingQ(true);
    setTimeout(() => {
      setSendingQ(false);
      setAskOpen(false);
      setQuestion("");
      toast({
        title: "Question Sent",
        description: "Question sent to teacher device",
      });
    }, 1200);
  };

  return (
    <AppLayout>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Teacher Sync
        </h1>
        <p className="mt-1 text-muted-foreground">
          Discover nearby teacher devices via Bluetooth and sync syllabus
        </p>
      </div>

      <div className="mx-auto max-w-md">
        <AnimatePresence mode="wait">
          {/* ── State 1: Bluetooth Off ── */}
          {state === "bluetoothOff" && (
            <motion.div key="off" {...fade} className="rounded-xl border border-border bg-card p-8 shadow-card text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                <Bluetooth className="h-9 w-9 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Bluetooth is turned off
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enable Bluetooth to discover nearby teacher devices
              </p>
              <button
                onClick={turnOn}
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg gradient-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Bluetooth className="h-4 w-4" />
                Turn On Bluetooth
              </button>
            </motion.div>
          )}

          {/* ── State 2: Scanning ── */}
          {state === "scanning" && (
            <motion.div key="scan" {...fade} className="rounded-xl border border-border bg-card p-8 shadow-card text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                >
                  <BluetoothSearching className="h-9 w-9 text-primary-foreground" />
                </motion.div>
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Scanning for nearby teacher devices…
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Looking for active Bluetooth education nodes
              </p>
              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-accent">
                <motion.div
                  className="h-full rounded-full gradient-primary"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  style={{ width: "50%" }}
                />
              </div>
            </motion.div>
          )}

          {/* ── State 3: Teacher Found ── */}
          {state === "found" && (
            <motion.div key="found" {...fade} className="rounded-xl border border-border bg-card p-8 shadow-card">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary">
                  <Signal className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-medium uppercase tracking-wider text-success">
                    Device Found
                  </p>
                  <h2 className="text-lg font-semibold text-foreground leading-tight">
                    Teacher Nearby
                  </h2>
                </div>
                <SignalBars strength={4} />
              </div>

              <div className="rounded-lg bg-muted/60 p-4 space-y-2 text-sm text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium text-foreground">
                    Prof. Sharma – Biology Dept
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device ID</span>
                  <span className="font-mono text-xs text-foreground">
                    EDU-TEACHER-001
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Signal</span>
                  <span className="font-medium text-success">Strong</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setState("bluetoothOff")}
                  className="h-11 rounded-lg border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  onClick={connect}
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg gradient-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wifi className="h-4 w-4" />
                  )}
                  {loading ? "Connecting…" : "Connect"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── State 4: Connected ── */}
          {state === "connected" && (
            <motion.div key="connected" {...fade} className="rounded-xl border border-border bg-card p-8 shadow-card text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-success/10"
              >
                <CheckCircle2 className="h-9 w-9 text-success" />
              </motion.div>
              <h2 className="text-lg font-semibold text-foreground">
                Connected to Prof.&nbsp;Sharma
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Bluetooth link established · Ready to sync
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={loadSyllabus}
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg gradient-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <BookOpen className="h-4 w-4" />
                  )}
                  {loading ? "Syncing…" : "Load Syllabus"}
                </button>
                <button
                  onClick={() => setAskOpen(true)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <Send className="h-4 w-4" />
                  Ask Question
                </button>
              </div>

              <button
                onClick={() => setState("bluetoothOff")}
                className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Disconnect
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Ask Question Modal ── */}
      <Dialog open={askOpen} onOpenChange={setAskOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ask Teacher a Question</DialogTitle>
            <DialogDescription>
              Send a question to Prof.&nbsp;Sharma's device via Bluetooth
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Type your question here…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAskOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendQuestion} disabled={sendingQ || !question.trim()}>
              {sendingQ ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
