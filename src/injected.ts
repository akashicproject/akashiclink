// Injected script that provides EIP-1193 Ethereum provider to web pages
import { AkashicProvider } from './provider/akashic-provider';

// Create the Akashic provider instance
const akashic = new AkashicProvider();

// Register the provider in the global registry (maintains backward compatibility)
akashic.registerInGlobalRegistry();

export {};
