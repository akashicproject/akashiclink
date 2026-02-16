/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  type EIP1193Provider,
  EXT_ENV,
  type JsonRpcRequest,
  type JsonRpcResponse,
  PAGE_CHANNEL,
  PAGE_EVENT,
} from '../types/provider-types';

export class AkashicProvider implements EIP1193Provider {
  public isAkashicLink: boolean = true;

  private _isConnected: boolean = false;
  private _eventListeners: Map<string, Set<Function>> = new Map();
  private _requestId: number = 0;
  private _version: string | null = null;

  constructor() {
    this.setupEventListeners();
    this.signalReadiness();
  }

  // EIP-1193 main request method
  async request(args: {
    method: string;
    params?: unknown[];
  }): Promise<unknown> {
    const id = ++this._requestId;
    const payload: JsonRpcRequest = {
      id,
      method: args.method,
      params: args.params as any[],
    };

    this.log('request ->', payload);

    return new Promise<unknown>((resolve, reject) => {
      const handle = (event: MessageEvent) => {
        if (
          event.source !== window ||
          !event.data ||
          event.data[PAGE_CHANNEL] !== PAGE_EVENT.RESPONSE
        ) {
          return; // early exit: not our response
        }

        const resp: JsonRpcResponse = event.data.payload;
        if (resp.id !== id) return; // different request

        window.removeEventListener('message', handle);
        this.log('response <-', resp);

        if (resp.error) {
          reject(new Error(resp.error.message));
        } else {
          resolve(resp.result);
        }
      };

      window.addEventListener('message', handle);
      window.postMessage(
        { [PAGE_CHANNEL]: PAGE_EVENT.REQUEST, payload },
        window.location.origin
      );
    });
  }

  // Event management
  on(eventName: string, listener: (...args: unknown[]) => void): this {
    if (!this._eventListeners.has(eventName)) {
      this._eventListeners.set(eventName, new Set());
    }
    this._eventListeners.get(eventName)!.add(listener);
    return this;
  }

  removeListener(
    eventName: string,
    listener: (...args: unknown[]) => void
  ): this {
    const listeners = this._eventListeners.get(eventName);
    if (listeners) {
      listeners.delete(listener);
    }
    return this;
  }

  isConnected(): boolean {
    return this._isConnected;
  }

  // Private methods
  private emit(event: string, ...args: unknown[]): void {
    const listeners = this._eventListeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Event listener error for '${event}':`, error);
        }
      });
    }
  }

  private log(message: string, obj?: any, ...args: any[]): void {
    if (process.env.REACT_APP_PROVIDER_DEBUG === 'true') {
      console.log(`[AkashicLink][provider] ${message}`, obj || '', ...args);
    }
  }

  private setupEventListeners(): void {
    // Initialize event listeners for standard events
    const standardEvents = [
      'accountsChanged',
      'chainChanged',
      'connect',
      'disconnect',
    ];
    standardEvents.forEach((event) => {
      this._eventListeners.set(event, new Set());
    });

    // Listen for provider events from content script
    window.addEventListener('message', (event: MessageEvent) => {
      // Security: verify origin before trusting message
      if (event.origin !== window.location.origin) return;
      if (event.source !== window || !event.data) return;

      const data = event.data;

      // Handle initialization
      if (data[PAGE_CHANNEL] === PAGE_EVENT.INIT) {
        this._version = data.version;
        this._isConnected = true;
        this.log('init received', { version: this._version });
        this.emit('connect');
        return;
      }

      // Handle provider events
      if (data[PAGE_CHANNEL] === PAGE_EVENT.PROVIDER_EVENT) {
        const { event: ev, args } = data;
        this.log('provider_event <-', ev, args);
        this.emit(ev, ...(args || []));
      }
    });
  }

  private signalReadiness(): void {
    // Signal readiness so content script can safely request init
    try {
      window.postMessage(
        { [PAGE_CHANNEL]: PAGE_EVENT.INJECTED_READY },
        window.location.origin
      );
    } catch (error) {
      this.log('failed to signal readiness', error);
    }
  }

  // Expose provider in registry
  public registerInGlobalRegistry(): void {
    try {
      const g: any = window as any;
      if (!g.__AKASHIC_PROVIDERS) {
        Object.defineProperty(g, '__AKASHIC_PROVIDERS', {
          value: {},
          configurable: false,
          enumerable: false,
          writable: false,
        });
      }

      // Attach provider to registry under its environment
      const existing = g.__AKASHIC_PROVIDERS[EXT_ENV];
      if (!existing) {
        g.__AKASHIC_PROVIDERS[EXT_ENV] = this;
        this.log('provider registered in registry env=', EXT_ENV);
      } else if (existing !== this) {
        this.log('registry already has provider for env', EXT_ENV);
      }
    } catch (e) {
      this.log('failed to register provider', e);
    }
  }
}
