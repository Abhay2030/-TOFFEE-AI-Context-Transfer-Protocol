// ============================================================
// Demo Data Seeder — Pre-populates the Library with sample
// bundles so Edge reviewers can explore without capturing
// ============================================================

import { db, type StoredBundle } from './database';
import { v4 as uuid } from 'uuid';

// ── Demo Bundle IDs (fixed so we can clean them up) ──────────

const DEMO_PREFIX = 'demo-';

const DEMO_BUNDLES: Omit<StoredBundle, 'id'>[] = [
  {
    displayName: 'React Architecture Deep Dive',
    sourcePlatform: 'chatgpt',
    sourceModel: 'gpt-4o',
    compressionProfile: 'standard',
    tokenCountOriginal: 18420,
    tokenCountBundle: 4210,
    compressionRatio: 0.228,
    tags: ['react', 'architecture', 'frontend'],
    bundleData: btoa(JSON.stringify({
      version: 1,
      source: { platform: 'chatgpt', model: 'gpt-4o' },
      summary: {
        title: 'React Architecture Deep Dive',
        critical_context: 'Discussion about React 19 Server Components architecture, streaming SSR patterns, and the transition from client-side state management to server-first data fetching. Key decisions: use React Server Components for data-heavy pages, maintain client components for interactive elements, implement optimistic updates via useOptimistic hook.',
        key_decisions: [
          'Adopt RSC for all data-fetching pages',
          'Use Zustand only for client-side UI state',
          'Implement streaming SSR for initial page loads',
        ],
        open_questions: ['Whether to use tRPC or server actions for mutations'],
      },
      turns_compressed: [
        { role: 'user', summary: 'Asked about React 19 Server Components best practices' },
        { role: 'assistant', summary: 'Explained RSC architecture, data fetching patterns, and streaming SSR' },
        { role: 'user', summary: 'Follow-up on state management with RSC' },
        { role: 'assistant', summary: 'Recommended Zustand for client state, server actions for mutations' },
      ],
    })),
    hmacSignature: 'demo-signature-001',
    version: 1,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    displayName: 'Python ML Pipeline Design',
    sourcePlatform: 'claude',
    sourceModel: 'claude-3.5-sonnet',
    compressionProfile: 'standard',
    tokenCountOriginal: 24650,
    tokenCountBundle: 5180,
    compressionRatio: 0.21,
    tags: ['python', 'machine-learning', 'data-pipeline'],
    bundleData: btoa(JSON.stringify({
      version: 1,
      source: { platform: 'claude', model: 'claude-3.5-sonnet' },
      summary: {
        title: 'Python ML Pipeline Design',
        critical_context: 'Designed an end-to-end ML pipeline for time-series forecasting using PyTorch. Architecture: data ingestion (Apache Kafka) → feature engineering (Pandas + NumPy) → model training (PyTorch Lightning) → serving (FastAPI + ONNX Runtime). Key insight: use sliding window approach with 30-day lookback for feature generation.',
        key_decisions: [
          'PyTorch Lightning over raw PyTorch for training loop',
          'ONNX export for production inference',
          'Kafka for real-time data ingestion',
        ],
        open_questions: ['GPU vs CPU trade-off for inference at scale'],
      },
      turns_compressed: [
        { role: 'user', summary: 'Described the time-series forecasting problem' },
        { role: 'assistant', summary: 'Proposed end-to-end pipeline architecture with component selection' },
        { role: 'user', summary: 'Asked about feature engineering strategies' },
        { role: 'assistant', summary: 'Recommended sliding window approach, lag features, and temporal encoding' },
        { role: 'user', summary: 'Discussed model deployment options' },
        { role: 'assistant', summary: 'Suggested ONNX Runtime with FastAPI for low-latency serving' },
      ],
    })),
    hmacSignature: 'demo-signature-002',
    version: 1,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    displayName: 'Kubernetes Cluster Optimization',
    sourcePlatform: 'gemini',
    sourceModel: 'gemini-1.5-pro',
    compressionProfile: 'full',
    tokenCountOriginal: 31200,
    tokenCountBundle: 6840,
    compressionRatio: 0.219,
    tags: ['kubernetes', 'devops', 'infrastructure'],
    bundleData: btoa(JSON.stringify({
      version: 1,
      source: { platform: 'gemini', model: 'gemini-1.5-pro' },
      summary: {
        title: 'Kubernetes Cluster Optimization',
        critical_context: 'Optimized a production K8s cluster running 200+ pods. Key changes: implemented Vertical Pod Autoscaler (VPA) alongside HPA, configured resource quotas per namespace, migrated from Docker to containerd runtime, set up Prometheus + Grafana monitoring stack. Reduced infrastructure costs by 40% while improving P99 latency.',
        key_decisions: [
          'VPA + HPA combo for intelligent autoscaling',
          'Containerd as container runtime',
          'Istio service mesh for traffic management',
        ],
        open_questions: ['Migration timeline for remaining workloads to spot instances'],
      },
      turns_compressed: [
        { role: 'user', summary: 'Described cluster performance issues and cost concerns' },
        { role: 'assistant', summary: 'Analyzed resource utilization and identified over-provisioning' },
        { role: 'user', summary: 'Asked about autoscaling strategies' },
        { role: 'assistant', summary: 'Recommended VPA + HPA combination with custom metrics' },
        { role: 'user', summary: 'Discussed monitoring and observability' },
        { role: 'assistant', summary: 'Designed Prometheus + Grafana stack with custom dashboards' },
        { role: 'user', summary: 'Asked about cost optimization with spot instances' },
        { role: 'assistant', summary: 'Provided spot instance strategy with fallback to on-demand' },
      ],
    })),
    hmacSignature: 'demo-signature-003',
    version: 1,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Seed the database with demo bundles if none with the demo prefix exist.
 * Safe to call multiple times — will not duplicate.
 */
export async function seedDemoBundles(): Promise<number> {
  try {
    // Check if demo bundles already exist
    const existing = await db.bundles
      .filter((b) => b.id.startsWith(DEMO_PREFIX))
      .count();

    if (existing > 0) {
      console.log(`[Toffee] Demo data already seeded (${existing} bundles)`);
      return 0;
    }

    // Insert demo bundles
    const entries: StoredBundle[] = DEMO_BUNDLES.map((bundle, i) => ({
      ...bundle,
      id: `${DEMO_PREFIX}${uuid().slice(0, 8)}-${i}`,
    }));

    await db.bundles.bulkPut(entries);
    console.log(`[Toffee] Seeded ${entries.length} demo bundles`);
    return entries.length;
  } catch (err) {
    console.error('[Toffee] Failed to seed demo data:', err);
    return 0;
  }
}

/**
 * Remove all demo bundles from the database.
 */
export async function clearDemoBundles(): Promise<void> {
  try {
    const demoIds = await db.bundles
      .filter((b) => b.id.startsWith(DEMO_PREFIX))
      .primaryKeys();

    if (demoIds.length > 0) {
      await db.bundles.bulkDelete(demoIds);
      console.log(`[Toffee] Cleared ${demoIds.length} demo bundles`);
    }
  } catch (err) {
    console.error('[Toffee] Failed to clear demo data:', err);
  }
}
