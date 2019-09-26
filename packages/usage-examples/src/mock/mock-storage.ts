/* eslint-disable spellcheck/spell-checker */
// Copy from packages/request-client.js/src/mock-storage.ts

import { StorageTypes } from '@requestnetwork/types';
import Utils from '@requestnetwork/utils';

/**
 * Storage layer implemented with in-memory hashmap, to be used for testing.
 */
export default class MockStorage implements StorageTypes.IStorage {
  private data: { [key: string]: { content: string; timestamp: number } } = {};

  public async initialize(): Promise<void> {
    return;
  }

  public async append(content: string): Promise<StorageTypes.IResultDataIdWithMeta> {
    if (!content) {
      throw Error('Error: no content provided');
    }
    const hash = Utils.crypto.normalizeKeccak256Hash(content);

    const nowTimestampInSec = Utils.getCurrentTimestampInSecond();

    this.data[hash] = { content, timestamp: nowTimestampInSec };

    return {
      meta: {
        storageType: StorageTypes.StorageSystemType.IN_MEMORY_MOCK,
        timestamp: nowTimestampInSec,
      },
      result: {
        dataId: hash,
      },
    };
  }

  public async read(id: string): Promise<StorageTypes.IResultContentWithMeta> {
    if (!id) {
      throw Error('No id provided');
    }
    return {
      meta: {
        storageType: StorageTypes.StorageSystemType.IN_MEMORY_MOCK,
        timestamp: this.data[id].timestamp,
      },
      result: { content: this.data[id].content },
    };
  }

  public async readMany(ids: string[]): Promise<StorageTypes.IResultContentWithMeta[]> {
    return Promise.all(ids.map(id => this.read(id)));
  }

  public async getData(): Promise<StorageTypes.IEntriesWithLastTimestamp> {
    const entries = Object.entries(this.data).map(([id, { content, timestamp }]) => ({
      content,
      id,
      meta: {
        storageType: StorageTypes.StorageSystemType.IN_MEMORY_MOCK,
        timestamp,
      },
    }));

    const nowTimestampInSec = Utils.getCurrentTimestampInSecond();

    return {
      entries,
      lastTimestamp: nowTimestampInSec,
    };
  }
}
