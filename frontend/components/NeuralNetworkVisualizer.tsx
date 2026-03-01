"use client";

import { memo, useMemo, useState, useEffect  } from "react";
import { motion } from "framer-motion";

interface NeuralNetworkVisualizerProps {
  currentLoss: number | null;
  status: string;
  currentEpoch: number;
}

type LayerKind = "input" | "hidden" | "output";

type LayerSpec = {
  key: string;
  label: string;
  nodeCount: number;
  kind: LayerKind;
};

type Node = {
  id: string;
  x: number;
  y: number;
  layerIndex: number;
  nodeIndex: number;
  kind: LayerKind;
};

type Layer = {
  key: string;
  label: string;
  kind: LayerKind;
  x: number;
  nodes: Node[];
};

type Connection = {
  id: string;
  from: Node;
  to: Node;
  fromLayerIndex: number;
  fromNodeIndex: number;
  toNodeIndex: number;
};

const WIDTH = 1400;
const HEIGHT = 800;
const LAYER_TOP = 180;
const LAYER_BOTTOM = HEIGHT - 120;
const SIDE_PADDING = 150;
const STAR_COUNT = 24;

const LAYER_SPECS: LayerSpec[] = [
  { key: "input", label: "INPUT", nodeCount: 6, kind: "input" },
  { key: "hidden-1", label: "HIDDEN 1", nodeCount: 5, kind: "hidden" },
  { key: "hidden-2", label: "HIDDEN 2", nodeCount: 6, kind: "hidden" },
  { key: "hidden-3", label: "HIDDEN 3", nodeCount: 5, kind: "hidden" },
  { key: "output", label: "OUTPUT", nodeCount: 4, kind: "output" }
];

const NODE_STYLE_BY_KIND: Record<
  LayerKind,
  {
    gradientId: string;
    glowColor: string;
    labelColor: string;
  }
> = {
  input: {
    gradientId: "inputNode",
    glowColor: "rgba(88, 227, 255, 0.72)",
    labelColor: "#b8f3ff"
  },
  hidden: {
    gradientId: "hiddenNode",
    glowColor: "rgba(255, 179, 70, 0.78)",
    labelColor: "#ffd79f"
  },
  output: {
    gradientId: "outputNode",
    glowColor: "rgba(207, 111, 255, 0.8)",
    labelColor: "#efbeff"
  }
};

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const stars = Array.from({ length: STAR_COUNT }, (_, index) => ({
  id: `star-${index}`,
  x: 30 + pseudoRandom(index * 2.7) * (WIDTH - 60),
  y: 40 + pseudoRandom(index * 3.9) * (HEIGHT - 80),
  r: 0.8 + pseudoRandom(index * 7.2) * 1.8,
  opacity: 0.16 + pseudoRandom(index * 11.5) * 0.4
}));

const buildLayers = (specs: LayerSpec[]): Layer[] => {
  const xStep =
    specs.length > 1
      ? (WIDTH - SIDE_PADDING * 2) / (specs.length - 1)
      : WIDTH / 2;

  return specs.map((spec, layerIndex) => {
    const x = SIDE_PADDING + layerIndex * xStep;
    const stepY =
      spec.nodeCount > 1
        ? (LAYER_BOTTOM - LAYER_TOP) / (spec.nodeCount - 1)
        : 0;

    const nodes = Array.from({ length: spec.nodeCount }, (_, nodeIndex) => ({
      id: `${spec.key}-${nodeIndex}`,
      x,
      y:
        spec.nodeCount > 1
          ? LAYER_TOP + nodeIndex * stepY
          : (LAYER_TOP + LAYER_BOTTOM) / 2,
      layerIndex,
      nodeIndex,
      kind: spec.kind
    }));

    return {
      key: spec.key,
      label: spec.label,
      kind: spec.kind,
      x,
      nodes
    };
  });
};

const buildConnections = (layers: Layer[]) => {
  const allConnections: Connection[] = [];

  for (let i = 0; i < layers.length - 1; i += 1) {
    const currentLayer = layers[i];
    const nextLayer = layers[i + 1];

    currentLayer.nodes.forEach(from => {
      nextLayer.nodes.forEach(to => {
        allConnections.push({
          id: `${from.id}-${to.id}`,
          from,
          to,
          fromLayerIndex: i,
          fromNodeIndex: from.nodeIndex,
          toNodeIndex: to.nodeIndex
        });
      });
    });
  }

  return allConnections;
};

function NeuralNetworkVisualizerComponent({
  currentLoss,
  status,
  currentEpoch
}: NeuralNetworkVisualizerProps) {
  const [activeNodes, setActiveNodes] = useState<Record<string, boolean>>({});
  const glowStrength = useMemo(() => {
    if (currentLoss == null) return 0.7;
    const clamped = Math.max(0.03, Math.min(currentLoss, 1.4));
    const normalized = 1.45 - clamped;
    return Math.max(0.35, Math.min(normalized, 1));
  }, [currentLoss]);

  const { layers, connections, animatedConnections, pulseConnections } = useMemo(() => {
    const builtLayers = buildLayers(LAYER_SPECS);
    const builtConnections = buildConnections(builtLayers);

   const groupedConnections = builtConnections.reduce((acc, connection) => {
  const key = connection.fromLayerIndex;
  if (!acc[key]) acc[key] = [];
  acc[key].push(connection);
  return acc;
}, {} as Record<number, Connection[]>);

// pick connections from EACH layer pair
// simulate real distributed NN signal
const movingConnections: Connection[] = [];

Object.keys(groupedConnections).forEach(layerKey => {
  const layerConnections = groupedConnections[Number(layerKey)];

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * layerConnections.length);
    movingConnections.push(layerConnections[randomIndex]);
  }
});
    return {
      layers: builtLayers,
      connections: builtConnections,
      animatedConnections: movingConnections.slice(0, 26),
      pulseConnections: movingConnections.slice(0, 24)
    };
  }, []);

  const isRunning = status === "running";
  useEffect(() => {

  if (status !== "running") {
    setActiveNodes({});
    return;
  }

  const map: Record<string, boolean> = {};

  layers.forEach(layer => {

    // INPUT LAYER → ALL ACTIVE
    if (layer.kind === "input") {
      layer.nodes.forEach(n => map[n.id] = true);
    }

    // HIDDEN LAYER → RANDOM ACTIVE
    if (layer.kind === "hidden") {

      const randomCount = Math.floor(Math.random() * layer.nodes.length) + 1;

      const shuffled = [...layer.nodes]
        .sort(() => 0.5 - Math.random())
        .slice(0, randomCount);

      shuffled.forEach(n => map[n.id] = true);
    }

    // OUTPUT LAYER → ONLY 1 OR 2 ACTIVE
    if (layer.kind === "output") {

      const selected = [...layer.nodes]
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      selected.forEach(n => map[n.id] = true);
    }

  });

  setActiveNodes(map);

}, [currentEpoch, status]);

  return (
    <div className="glass-panel neon-border overflow-hidden p-3 sm:p-4 md:p-5">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#020719]">
        <div className="relative h-[320px] sm:h-[400px] md:h-[500px] lg:h-[580px]">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            aria-label="Neural network architecture visualization"
          >
            <defs>
              <linearGradient id="panelGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#061634" />
                <stop offset="45%" stopColor="#14091f" />
                <stop offset="100%" stopColor="#080022" />
              </linearGradient>

              <radialGradient id="inputGlowBg" cx="12%" cy="50%" r="52%">
                <stop offset="0%" stopColor="rgba(12, 184, 255, 0.22)" />
                <stop offset="100%" stopColor="rgba(12, 184, 255, 0)" />
              </radialGradient>
              <radialGradient id="hiddenGlowBg" cx="52%" cy="50%" r="52%">
                <stop offset="0%" stopColor="rgba(255, 141, 21, 0.2)" />
                <stop offset="100%" stopColor="rgba(255, 141, 21, 0)" />
              </radialGradient>
              <radialGradient id="outputGlowBg" cx="88%" cy="50%" r="52%">
                <stop offset="0%" stopColor="rgba(193, 72, 255, 0.22)" />
                <stop offset="100%" stopColor="rgba(193, 72, 255, 0)" />
              </radialGradient>

              <radialGradient id="inputNode" cx="45%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#e8fdff" />
                <stop offset="45%" stopColor="#40d8ff" />
                <stop offset="100%" stopColor="#006dcb" />
              </radialGradient>

              <radialGradient id="hiddenNode" cx="45%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#fff5de" />
                <stop offset="45%" stopColor="#ffad2f" />
                <stop offset="100%" stopColor="#ff5d00" />
              </radialGradient>

              <radialGradient id="outputNode" cx="45%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#f9e8ff" />
                <stop offset="45%" stopColor="#cb68ff" />
                <stop offset="100%" stopColor="#8c3aff" />
              </radialGradient>

              <filter id="softGlow" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width={WIDTH} height={HEIGHT} fill="url(#panelGradient)" />
            <rect width={WIDTH} height={HEIGHT} fill="url(#inputGlowBg)" />
            <rect width={WIDTH} height={HEIGHT} fill="url(#hiddenGlowBg)" />
            <rect width={WIDTH} height={HEIGHT} fill="url(#outputGlowBg)" />

            {stars.map(star => (
              <motion.circle
                key={star.id}
                cx={star.x}
                cy={star.y}
                r={star.r}
                fill="#eaf3ff"
                initial={{ opacity: star.opacity * 0.5 }}
                animate={
                  isRunning
                    ? {
                        opacity: [star.opacity * 0.45, star.opacity, star.opacity * 0.45]
                      }
                    : { opacity: star.opacity * 0.55 }
                }
                transition={{
                  duration: 2.6 + (star.r % 1.3) * 1.2,
                  repeat: isRunning ? Infinity : 0,
                  ease: "easeInOut"
                }}
              />
            ))}

            <g opacity={0.35}>
              {connections.map(connection => (
                <line
                  key={connection.id}
                  x1={connection.from.x}
                  y1={connection.from.y}
                  x2={connection.to.x}
                  y2={connection.to.y}
                  stroke={
                    connection.to.kind === "output"
                      ? "rgba(202, 114, 255, 0.64)"
                      : "rgba(99, 220, 255, 0.58)"
                  }
                  strokeWidth={1.05}
                  strokeLinecap="round"
                />
              ))}
            </g>

            {animatedConnections.map(connection => (
              <motion.line
                key={`animated-${connection.id}`}
                x1={connection.from.x}
                y1={connection.from.y}
                x2={connection.to.x}
                y2={connection.to.y}
                stroke={
                  connection.to.kind === "output"
                    ? "rgba(233, 145, 255, 0.84)"
                    : "rgba(144, 233, 255, 0.78)"
                }
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray="7 11"
                filter="url(#softGlow)"
                initial={{ strokeDashoffset: 64, opacity: 0.5 }}
                animate={
                  isRunning
                    ? { strokeDashoffset: [64, 0], opacity: [0.42, 0.8, 0.42] }
                    : { strokeDashoffset: 64, opacity: 0.44 }
                }
                transition={{
                  duration: 1.2,
                  delay:
                    (connection.fromLayerIndex +
                      connection.fromNodeIndex +
                      connection.toNodeIndex) *
                    0.03,
                  repeat: isRunning ? Infinity : 0,
                   repeatType: "loop",
                  ease: "linear"
                }}
              />
            ))}

            {pulseConnections.map((connection, index) => (
              <motion.circle
                key={`pulse-${connection.id}`}
                r={3.8}
                fill={connection.to.kind === "output" ? "#f0b4ff" : "#9deeff"}
                filter="url(#softGlow)"
                initial={{ opacity: 0, cx: connection.from.x, cy: connection.from.y }}
                animate={
                  isRunning
                    ? {
                        cx: [connection.from.x, connection.to.x],
                        cy: [connection.from.y, connection.to.y],
                        opacity: [0, 0.95, 0]
                      }
                    : { opacity: 0 }
                }
                transition={{
                  duration: 1.2,
                  delay: connection.fromLayerIndex * 0.25 + index * 0.05,
                  repeat: isRunning ? Infinity : 0,
                  ease: "linear"
                }}
              />
            ))}

            {layers.map(layer => {
              const nodeStyle = NODE_STYLE_BY_KIND[layer.kind];

              return (
                <g key={layer.key}>
                  <text
                    x={layer.x}
                    y={92}
                    textAnchor="middle"
                    fill={nodeStyle.labelColor}
                    style={{
                      fontSize: "21px",
                      fontWeight: 700,
                      letterSpacing: "1.4px"
                    }}
                  >
                    {layer.label}
                  </text>

                  {layer.nodes.map(node => (
                    
                    <g key={node.id}>
                      
<motion.circle
  cx={node.x}
  cy={node.y}
  r={30}
  fill={nodeStyle.glowColor}
  filter="url(#softGlow)"
  animate={
    isRunning
      ? {
          scale: [1, 1.18, 1],
          opacity: [0.35, 0.75, 0.35]
        }
      : {
          scale: 1,
          opacity: 0.35
        }
  }
  transition={{
    duration: 1.2,
    delay: node.nodeIndex * 0.08,
    repeat: isRunning ? Infinity : 0,
    ease: "easeInOut"
  }}
/>

                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={20}
                        fill={`url(#${nodeStyle.gradientId})`}
                        stroke="rgba(255,255,255,0.34)"
                        strokeWidth={1.1}
                      />
                      <circle
                        cx={node.x - 4.5}
                        cy={node.y - 5.5}
                        r={5.2}
                        fill="rgba(255,255,255,0.66)"
                      />
                    </g>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

export const NeuralNetworkVisualizer = memo(NeuralNetworkVisualizerComponent);
