import { AsyncLocalStorage } from 'node:async_hooks';

type RequestContextStore = {
  correlationId: string;
};

const storage = new AsyncLocalStorage<RequestContextStore>();

export class RequestContext {
  static run(correlationId: string, callback: () => void): void {
    storage.run({ correlationId }, callback);
  }

  static getCorrelationId(): string | undefined {
    return storage.getStore()?.correlationId;
  }
}
