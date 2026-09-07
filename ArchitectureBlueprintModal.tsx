import React, { useState } from 'react';
import {
  X,
  Layers,
  Database,
  Server,
  Zap,
  HardDrive,
  Cpu,
  Shield,
  Activity,
  Terminal,
  Copy,
  Check,
  Code2,
  RefreshCw,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const ArchitectureBlueprintModal: React.FC = () => {
  const { isBlueprintOpen, setIsBlueprintOpen, matrixLogs, logMatrixEvent } = useChat();
  const [selectedNode, setSelectedNode] = useState<string>('synapse');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isBlueprintOpen) return null;

  const nodeDetails: Record<
    string,
    {
      title: string;
      tag: string;
      description: string;
      tech: string;
      port: string;
      status: string;
      configSnippet: string;
    }
  > = {
    client: {
      title: 'Frontend Clients (React / Flutter)',
      tag: 'CLIENT LAYER',
      description:
        'Cross-platform clients interfacing with Synapse homeserver via Matrix Client-Server API v3 and Vodozemac Megolm cryptographic ratchets.',
      tech: 'React 18 + Vite / Flutter Matrix Dart SDK',
      port: '3000 (HTTPS/WSS)',
      status: 'Healthy • Connected',
      configSnippet: `// Matrix SDK Client Initialization
const client = matrixcs.createClient({
  baseUrl: "https://matrix.wat.chat",
  userId: "@amara:wat.chat",
  accessToken: "syt_YW1hcmE_...",
  crypto: {
    cryptoCallbacks: new MemoryCryptoStore(),
    algorithm: "m.megolm.v1.aes-sha2"
  }
});
await client.initCrypto();
await client.startClient({ initialSyncLimit: 20 });`,
    },
    synapse: {
      title: 'Synapse Matrix Homeserver',
      tag: 'CORE MESSAGING ENGINE',
      description:
        'Reference Matrix homeserver handling federated room state, user presence, access token validation, and room event directed acyclic graphs (DAG).',
      tech: 'Matrix Synapse v1.98 (Rust Crypto Engine)',
      port: '8008 / 8448 (Federation)',
      status: 'Running • 24 Worker Pools',
      configSnippet: `# homeserver.yaml configuration
server_name: "wat.chat"
enable_registration: false
enable_presence: true
url_preview_enabled: true
app_service_config_files: []

database:
  name: psycopg2
  args:
    user: synapse_user
    password: "\${SYNAPSE_DB_PASSWORD}"
    database: synapse
    host: postgres.internal
    cp_min: 5
    cp_max: 20

redis:
  enabled: true
  host: redis.internal
  port: 6379`,
    },
    postgres: {
      title: 'PostgreSQL Relational Storage',
      tag: 'STATE PERSISTENCE',
      description:
        'Stores room state DAGs, membership hierarchies, E2EE device key bundles, access tokens, and read receipt markers.',
      tech: 'PostgreSQL 16 (B-Tree + GIN indexing)',
      port: '5432',
      status: 'Active • 4.2ms avg query',
      configSnippet: `-- Synapse core schema sample
SELECT event_id, room_id, type, sender, origin_server_ts, content
FROM events 
WHERE room_id = '!africabiz:wat.chat' 
ORDER BY stream_ordering DESC 
LIMIT 50;`,
    },
    redis: {
      title: 'Redis Worker Replication & Cache',
      tag: 'IN-MEMORY PUB/SUB',
      description:
        'Inter-process messaging between Synapse worker instances, presence broadcasting, sliding sync caching, and rate-limiting buckets.',
      tech: 'Redis 7.2 Cluster (In-Memory)',
      port: '6379',
      status: 'Operating • 0.8ms latency',
      configSnippet: `# Redis Worker Bus Stream
XADD synapse_stream * worker_id sync_worker_3 event_type m.room.message room_id !africabiz:wat.chat`,
    },
    s3: {
      title: 'Sovereign Media Object Store (MinIO/S3)',
      tag: 'MEDIA REPOSITORY',
      description:
        'Content-addressable encrypted media storage for voice notes, HD images, video snippets, and catalog documents.',
      tech: 'MinIO / S3 Encrypted Storage',
      port: '9000',
      status: 'Operating • 99.99% Durability',
      configSnippet: `# media_repository config
media_storage_providers:
  - module: synapse_s3_storage_provider.S3StorageProviderExtension
    config:
      bucket: wat-media-sovereign-af-south
      endpoint_url: https://s3.af-south-1.wat.chat`,
    },
    jitsi: {
      title: 'Jitsi Meet SFU (JVB2 + Prosody + Jicofo)',
      tag: 'SELECTIVE FORWARDING UNIT',
      description:
        'MatrixRTC conference bridge routing multi-participant voice/video tracks with bandwidth estimation, Simulcast, and E2EE Insertable Streams.',
      tech: 'JVB2 (Java/WebRTC) + Prosody XMPP',
      port: '10000/UDP (JVB) & 443 (HTTPS)',
      status: 'Healthy • SFU Cluster active',
      configSnippet: `# jvb.conf snippet
videobridge {
  http-servers {
    public {
      port = 9090
    }
  }
  websockets {
    enabled = true
    server-id = "jvb-af-south-01"
  }
}`,
    },
  };

  const currentNode = nodeDetails[selectedNode] || nodeDetails.synapse;

  const copySnippet = () => {
    navigator.clipboard.writeText(currentNode.configSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in">
      <div className="bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl w-full max-w-5xl shadow-[0_24px_48px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col max-h-[92vh] text-neutral-900">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white/80 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-neutral-900">
                  Matrix Sovereign Architecture Blueprint
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-black/[0.05] text-neutral-700 text-[10px] font-mono border border-black/[0.08]">
                  Matrix 2.0 Spec (MSC3861 / MSC3401)
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Live interactive topology, decentralized data flow, and cryptographic boundary mapping
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBlueprintOpen(false)}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-black hover:bg-black/[0.04] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two-Column Topology Graph & Node Inspector */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Column: Interactive Topology Node Graph */}
          <div className="lg:col-span-7 p-6 overflow-y-auto bg-black/[0.02] space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                System Topology & Component Graph
              </span>
              <span className="text-[10px] font-mono text-neutral-800 font-bold">
                Click any node to inspect specs
              </span>
            </div>

            {/* Layer 1: Clients */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('client')}
                className={`w-full max-w-md p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
                  selectedNode === 'client'
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-white border-black/[0.06] hover:border-black/20 text-neutral-800 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      selectedNode === 'client' ? 'bg-white/20 text-white' : 'bg-black/[0.04] text-neutral-800 border border-black/[0.06]'
                    }`}
                  >
                    APP
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${selectedNode === 'client' ? 'text-white' : 'text-neutral-900'}`}>
                      Mobile & Web Client Applications
                    </h4>
                    <p className={`text-[10px] ${selectedNode === 'client' ? 'text-white/70' : 'text-neutral-500'}`}>
                      Flutter (Dart) • React 18 (TypeScript) • Vodozemac Olm
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-mono ${selectedNode === 'client' ? 'text-white/80' : 'text-neutral-600 font-semibold'}`}>
                  WSS/HTTPS
                </span>
              </button>

              {/* Vertical connector */}
              <div className="w-0.5 h-6 bg-black/20" />
            </div>

            {/* Layer 2: Synapse Homeserver */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('synapse')}
                className={`w-full max-w-md p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                  selectedNode === 'synapse'
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-white border-black/[0.06] hover:border-black/20 text-neutral-800 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      selectedNode === 'synapse' ? 'bg-white/20 text-white' : 'bg-black/[0.04] text-neutral-800 border border-black/[0.06]'
                    }`}
                  >
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold flex items-center gap-2 ${selectedNode === 'synapse' ? 'text-white' : 'text-neutral-900'}`}>
                      <span>SYNAPSE MATRIX HOMESERVER</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </h4>
                    <p className={`text-[10px] ${selectedNode === 'synapse' ? 'text-white/70' : 'text-neutral-500'}`}>
                      Matrix Core Engine • Event DAGs • Federation • Worker Clusters
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-mono ${selectedNode === 'synapse' ? 'text-white/80' : 'text-neutral-600 font-semibold'}`}>
                  :8008
                </span>
              </button>

              {/* Vertical connector split */}
              <div className="w-0.5 h-6 bg-black/20" />
            </div>

            {/* Layer 3: Tri-Core Storage & Cache */}
            <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
              {/* Postgres */}
              <button
                onClick={() => setSelectedNode('postgres')}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col items-center justify-center text-center ${
                  selectedNode === 'postgres'
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-white border-black/[0.06] hover:border-black/20 text-neutral-800 shadow-2xs'
                }`}
              >
                <Database className={`w-5 h-5 mb-1 ${selectedNode === 'postgres' ? 'text-white' : 'text-neutral-800'}`} />
                <span className={`text-[11px] font-bold ${selectedNode === 'postgres' ? 'text-white' : 'text-neutral-900'}`}>
                  PostgreSQL
                </span>
                <span className={`text-[9px] font-mono ${selectedNode === 'postgres' ? 'text-white/70' : 'text-neutral-500'}`}>
                  Room State DB
                </span>
              </button>

              {/* Redis */}
              <button
                onClick={() => setSelectedNode('redis')}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col items-center justify-center text-center ${
                  selectedNode === 'redis'
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-white border-black/[0.06] hover:border-black/20 text-neutral-800 shadow-2xs'
                }`}
              >
                <Zap className={`w-5 h-5 mb-1 ${selectedNode === 'redis' ? 'text-white' : 'text-neutral-800'}`} />
                <span className={`text-[11px] font-bold ${selectedNode === 'redis' ? 'text-white' : 'text-neutral-900'}`}>
                  Redis Cache
                </span>
                <span className={`text-[9px] font-mono ${selectedNode === 'redis' ? 'text-white/70' : 'text-neutral-500'}`}>
                  Pub/Sub Pool
                </span>
              </button>

              {/* Media S3 */}
              <button
                onClick={() => setSelectedNode('s3')}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col items-center justify-center text-center ${
                  selectedNode === 's3'
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-white border-black/[0.06] hover:border-black/20 text-neutral-800 shadow-2xs'
                }`}
              >
                <HardDrive className={`w-5 h-5 mb-1 ${selectedNode === 's3' ? 'text-white' : 'text-neutral-800'}`} />
                <span className={`text-[11px] font-bold ${selectedNode === 's3' ? 'text-white' : 'text-neutral-900'}`}>
                  Media Store
                </span>
                <span className={`text-[9px] font-mono ${selectedNode === 's3' ? 'text-white/70' : 'text-neutral-500'}`}>
                  MinIO / S3
                </span>
              </button>
            </div>

            {/* Bottom: Jitsi SFU Node */}
            <div className="flex flex-col items-center pt-2">
              <button
                onClick={() => setSelectedNode('jitsi')}
                className={`w-full max-w-md p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
                  selectedNode === 'jitsi'
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-white border-black/[0.06] hover:border-black/20 text-neutral-800 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      selectedNode === 'jitsi' ? 'bg-white/20 text-white' : 'bg-black/[0.04] text-neutral-800 border border-black/[0.06]'
                    }`}
                  >
                    SFU
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${selectedNode === 'jitsi' ? 'text-white' : 'text-neutral-900'}`}>
                      Jitsi Meet SFU (MatrixRTC WebRTC Focus)
                    </h4>
                    <p className={`text-[10px] ${selectedNode === 'jitsi' ? 'text-white/70' : 'text-neutral-500'}`}>
                      JVB2 Selective Forwarding • Simulcast • Insertable Streams
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-mono ${selectedNode === 'jitsi' ? 'text-white/80' : 'text-neutral-600 font-semibold'}`}>
                  :10000 UDP
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Node Inspector & Live Configuration Panel */}
          <div className="lg:col-span-5 p-6 border-t lg:border-t-0 lg:border-l border-black/[0.06] bg-white flex flex-col justify-between overflow-y-auto space-y-4 custom-scrollbar">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                <div>
                  <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">
                    {currentNode.tag}
                  </span>
                  <h3 className="text-base font-black text-neutral-900 mt-0.5">
                    {currentNode.title}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-black/[0.05] text-neutral-800 text-[10px] font-mono font-bold border border-black/[0.08]">
                  {currentNode.status}
                </span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {currentNode.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.06]">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                    Stack / Engine
                  </span>
                  <span className="text-neutral-900 font-semibold mt-0.5 block truncate">
                    {currentNode.tech}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.06]">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                    Bound Ports
                  </span>
                  <span className="text-neutral-900 font-mono font-semibold mt-0.5 block truncate">
                    {currentNode.port}
                  </span>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                    <Code2 className="w-3.5 h-3.5 text-neutral-800" />
                    <span>Configuration / Implementation</span>
                  </div>
                  <button
                    onClick={copySnippet}
                    className="p-1 rounded-lg text-neutral-400 hover:text-black flex items-center gap-1 text-[10px] font-mono font-semibold"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-black" />
                        <span className="text-black">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.08] text-[11px] font-mono text-neutral-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {currentNode.configSnippet}
                </pre>
              </div>
            </div>

            {/* Footer action */}
            <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span>Synapse 1.98.0 / Matrix 2.0</span>
              <button
                onClick={() => setIsBlueprintOpen(false)}
                className="px-4 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
