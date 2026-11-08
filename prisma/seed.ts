import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// The brief's asset is re-hosted locally at build time (see README "3D
// model asset" note): the CloudFront origin serves it without CORS headers
// (verified with `curl -I`), so browsers block model-viewer/three.js's
// fetch() for it cross-origin. Same bytes, served same-origin instead.
const HUBBLE_MODEL_URL = "/models/c41-qs.glb";

const PRODUCTS = [
  {
    slug: "hubble-c41-qs",
    name: "Hubble C41 QS Tracker",
    tagline: "Quick-start GPS/IoT tracker for fleets on the move",
    description:
      "The C41 QS is Cavliwireless's flagship GPS/IoT tracker, built for rapid deployment across fleet and logistics operations. It reports location, motion, and diagnostic events over cellular with minimal setup.",
    category: "GPS/IoT Tracker",
    heroImageUrl: "/products/hubble-c41-qs.jpg",
    modelUrl: HUBBLE_MODEL_URL,
    features: [
      "Multi-constellation GNSS (GPS, GLONASS, Galileo)",
      "Cellular + Bluetooth connectivity",
      "Quick-start provisioning in under 5 minutes",
      "IP67-rated enclosure",
    ],
  },
  {
    slug: "hubble-c100",
    name: "Hubble C100 Cellular Module",
    tagline: "Compact cellular connectivity module for embedded designs",
    description:
      "A low-power cellular module designed to drop into existing hardware designs, giving any device reliable LTE connectivity with a minimal board footprint.",
    category: "Connectivity Module",
    heroImageUrl: "/products/hubble-c100.jpg",
    modelUrl: HUBBLE_MODEL_URL,
    features: [
      "LTE Cat-1 connectivity",
      "Compact SMD form factor",
      "Low-power sleep modes",
      "AT command + MQTT support",
    ],
  },
  {
    slug: "hubble-edge-gateway",
    name: "Hubble Edge Gateway",
    tagline: "Local edge gateway for sensor and telemetry aggregation",
    description:
      "Aggregates data from nearby sensors and trackers over BLE/LoRa and forwards it upstream over cellular or Ethernet, with on-device buffering for unreliable links.",
    category: "Gateway",
    heroImageUrl: "/products/hubble-edge-gateway.jpg",
    modelUrl: HUBBLE_MODEL_URL,
    features: [
      "BLE + LoRa sensor aggregation",
      "On-device store-and-forward buffering",
      "Ethernet and cellular uplink",
      "Remote firmware updates",
    ],
  },
  {
    slug: "hubble-sensor-hub",
    name: "Hubble Sensor Hub",
    tagline: "Multi-sensor hub for environmental and asset monitoring",
    description:
      "Combines temperature, humidity, shock, and tilt sensing into a single rugged unit, reporting conditions in real time for cold-chain and asset-monitoring use cases.",
    category: "Sensor Hardware",
    heroImageUrl: "/products/hubble-sensor-hub.jpg",
    modelUrl: HUBBLE_MODEL_URL,
    features: [
      "Temperature + humidity sensing",
      "Shock and tilt detection",
      "Multi-year battery life",
      "Configurable alert thresholds",
    ],
  },
  {
    slug: "hubble-fleet-dashboard",
    name: "Hubble Fleet Dashboard Unit",
    tagline: "In-cabin display unit for live fleet telemetry",
    description:
      "An in-cabin unit that surfaces live vehicle and fleet telemetry to drivers, pairing with Hubble trackers and sensors over Bluetooth for at-a-glance status.",
    category: "Fleet Management",
    heroImageUrl: "/products/hubble-fleet-dashboard.jpg",
    modelUrl: HUBBLE_MODEL_URL,
    features: [
      "In-cabin live telemetry display",
      "Bluetooth pairing with Hubble trackers",
      "Driver alert notifications",
      "Night-mode display",
    ],
  },
];

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  for (const product of PRODUCTS) {
    const { features, ...productData } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        ...productData,
        features: {
          create: features.map((label, index) => ({
            label,
            sortOrder: index,
          })),
        },
      },
      update: {
        ...productData,
        features: {
          deleteMany: {},
          create: features.map((label, index) => ({
            label,
            sortOrder: index,
          })),
        },
      },
    });
  }

  console.log(`Seeded ${PRODUCTS.length} products.`);
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
