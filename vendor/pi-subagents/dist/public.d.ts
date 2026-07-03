import { ThinkingLevel } from '@earendil-works/pi-ai';

/**
 * types.ts — Type definitions for the subagent system.
 */

/** Agent type: any string name (built-in defaults or user-defined). */
type SubagentType = string;
interface AgentInvocation {
    /** Short display name, e.g. "haiku" — only set when different from parent. */
    modelName?: string;
    thinking?: ThinkingLevel;
    maxTurns?: number;
    inheritContext?: boolean;
    runInBackground?: boolean;
}

/** usage.ts — Token usage: shapes, accumulator operators, session-stats readers. */
/**
 * Lifetime usage components, accumulated via `message_end` events. Survives
 * compaction (which replaces session.state.messages and would reset any
 * stats-derived sum). cacheRead is excluded because each turn's cacheRead is
 * the cumulative cached prefix re-read on that one call — summing across
 * turns counts the prefix N times. See issue #38.
 */
type LifetimeUsage = {
    input: number;
    output: number;
    cacheWrite: number;
};

/**
 * subagent-state.ts — SubagentState value object: lifecycle status, metrics, and live activity.
 *
 * Owns the passive, readable state of a subagent — status, result, error,
 * timestamps, stats (toolUses, lifetimeUsage, compactionCount), and live-activity
 * fields (turnCount, activeTools, responseText) — together with the transition
 * methods (markRunning, markCompleted, …), accumulation methods
 * (incrementToolUses, addUsage, incrementCompactions), and live-activity
 * transition methods (incrementTurnCount, addActiveTool, removeActiveTool,
 * resetResponseText, appendResponseText) that mutate them.
 *
 * State is encapsulated behind getters; external code reads through them but
 * mutates only via the transition/accumulation methods. The value object owns
 * all of its own mutations — no field is written from outside.
 *
 * Subagent holds one of these privately and delegates its getters and mutation
 * methods to it. Extracting it lets the lifecycle state machine and the
 * session-event observer be unit-tested without constructing an executor.
 */

type SubagentStatus = "queued" | "running" | "completed" | "steered" | "aborted" | "stopped" | "error";

/**
 * workspace.ts — The single generative extension seam (ADR 0002, Phase 16 Step 2).
 *
 * "Where does a child run, and what brackets the run?" is a strategy (git
 * worktree, container, tmpdir, remote sandbox), not core behavior. The core
 * needs only a working directory plus a disposal hook; the default — the
 * parent's cwd, with no setup/teardown — is always correct.
 *
 * Unlike the observational lifecycle events in child-lifecycle.ts, this is a
 * *generative* seam: a registered provider returns a value the core consumes
 * synchronously at run-start. The core has no knowledge of git or worktrees.
 */

/** Context the core hands a provider when a child run starts. */
interface WorkspacePrepareContext {
    agentId: string;
    agentType: SubagentType;
    baseCwd: string;
    invocation?: AgentInvocation;
}
/** Outcome the core reports to a workspace when the run ends. */
interface WorkspaceDisposeOutcome {
    status: SubagentStatus;
    description: string;
}
/** What dispose may hand back for the core to fold into the child result. */
interface WorkspaceDisposeResult {
    /** Appended verbatim to the child's result text — the provider owns the wording. */
    resultAddendum?: string;
}
/** A prepared working directory plus its bracketed teardown. Born complete. */
interface Workspace {
    /** The working directory — already exists when the workspace is handed back. */
    readonly cwd: string;
    dispose(outcome: WorkspaceDisposeOutcome): WorkspaceDisposeResult | undefined;
}
/** The single generative seam: supplies a child's workspace. */
interface WorkspaceProvider {
    prepare(ctx: WorkspacePrepareContext): Promise<Workspace | undefined>;
}

/**
 * service.ts — Public API surface for cross-extension access to subagents.
 *
 * Consumers declare this package as an optional peer dependency and use
 * dynamic import to access the accessor functions:
 *
 *   const { getSubagentsService } = await import("@gotgenes/pi-subagents");
 *   const svc = getSubagentsService();
 *   svc?.spawn("Explore", "Check for stale TODOs");
 */

/** Serializable snapshot of an agent's state — no live session objects. */
interface SubagentRecord {
    id: string;
    type: string;
    description: string;
    status: SubagentStatus;
    result?: string;
    error?: string;
    toolUses: number;
    startedAt: number;
    completedAt?: number;
    lifetimeUsage: LifetimeUsage;
    compactionCount: number;
}
/** Options for spawning an agent via the service. */
interface SpawnOptions {
    description?: string;
    model?: string;
    maxTurns?: number;
    thinkingLevel?: string;
    inheritContext?: boolean;
    foreground?: boolean;
    bypassQueue?: boolean;
}
/** The public service contract for cross-extension subagent access. */
interface SubagentsService {
    /** Spawn an agent. Returns the agent ID immediately. */
    spawn(type: string, prompt: string, options?: SpawnOptions): string;
    /** Get a snapshot of an agent's current state. */
    getRecord(id: string): SubagentRecord | undefined;
    /** List all tracked agents, most recent first. */
    listAgents(): SubagentRecord[];
    /** Abort a running or queued agent. Returns false if not found. */
    abort(id: string): boolean;
    /** Send a steering message to a running agent. */
    steer(id: string, message: string): Promise<boolean>;
    /** Wait for all running and queued agents to complete. */
    waitForAll(): Promise<void>;
    /** Whether any agents are running or queued. */
    hasRunning(): boolean;
    /**
     * Register the single workspace provider that supplies a child's working
     * directory plus bracketed setup/teardown. Throws if one is already
     * registered. Returns a disposer that unregisters the provider.
     */
    registerWorkspaceProvider(provider: WorkspaceProvider): () => void;
}
/** Event channel constants for pi.events subscriptions. */
declare const SUBAGENT_EVENTS: {
    readonly STARTED: "subagents:started";
    readonly COMPLETED: "subagents:completed";
    readonly ACTIVITY: "subagents:activity";
};
/** Publish the SubagentsService on globalThis for cross-extension access. */
declare function publishSubagentsService(service: SubagentsService): void;
/** Retrieve the published SubagentsService, or undefined if not yet published. */
declare function getSubagentsService(): SubagentsService | undefined;
/** Remove the SubagentsService from globalThis (call on shutdown/reload). */
declare function unpublishSubagentsService(): void;

export { SUBAGENT_EVENTS, getSubagentsService, publishSubagentsService, unpublishSubagentsService };
export type { LifetimeUsage, SpawnOptions, SubagentRecord, SubagentStatus, SubagentsService, Workspace, WorkspaceDisposeOutcome, WorkspaceDisposeResult, WorkspacePrepareContext, WorkspaceProvider };
