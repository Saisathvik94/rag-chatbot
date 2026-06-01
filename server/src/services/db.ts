import { QdrantClient } from "@qdrant/js-client-rest";

export const COLLECTION_NAME = "yt-rag";

// Match this with your embedding model's actual dimension
export const VECTOR_SIZE = 3072;

export const client = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:6333",
});

export async function ensureCollection(): Promise<void> {
  try {
    const { collections } = await client.getCollections();

    const collectionExists = collections.some(
      (collection) => collection.name === COLLECTION_NAME
    );

    if (collectionExists) {
      console.log(`Collection "${COLLECTION_NAME}" already exists`);
      return;
    }

    await client.createCollection(COLLECTION_NAME, {
      vectors: {
        size: VECTOR_SIZE,
        distance: "Cosine",
      },
    });

    console.log(`Collection "${COLLECTION_NAME}" created successfully`);
  } catch (error) {
    console.error("Failed to initialize Qdrant collection:", error);
    throw error;
  }
}