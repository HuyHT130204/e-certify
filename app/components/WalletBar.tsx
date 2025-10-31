"use client";

import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    solana?: any;
  }
}

export default function WalletBar({ onConnected }: { onConnected?: (pubkey: string) => void }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [hasPhantom, setHasPhantom] = useState(false);

  useEffect(() => {
    setHasPhantom(!!window?.solana?.isPhantom);
    const provider = window?.solana;
    if (!provider) return;
    provider?.on?.("connect", (pk: { toString: () => string }) => {
      const a = pk?.toString?.() || provider.publicKey?.toString?.() || "";
      setConnected(true);
      setAddress(a);
      onConnected?.(a);
    });
    provider?.on?.("disconnect", () => {
      setConnected(false);
      setAddress("");
    });
    // try auto connect
    provider?.connect?.({ onlyIfTrusted: true }).catch(() => {});
  }, [onConnected]);

  const connect = async () => {
    const provider = window?.solana;
    if (!provider) return window.open("https://phantom.app/", "_blank");
    try {
      const res = await provider.connect();
      const a = res?.publicKey?.toString?.() || provider.publicKey?.toString?.() || "";
      setConnected(true);
      setAddress(a);
      onConnected?.(a);
    } catch (e) {
      // ignore
    }
  };

  const disconnect = async () => {
    try { await window?.solana?.disconnect?.(); } catch {}
  };

  return (
    <div className="flex items-center gap-2">
      {connected ? (
        <>
          <span className="opacity-80 text-[13px]">{address.slice(0, 4)}...{address.slice(-4)}</span>
          <button onClick={disconnect} className="btn-ghost">Disconnect</button>
        </>
      ) : (
        <button onClick={connect} className="btn-primary">
          {hasPhantom ? 'Connect Wallet' : 'Install Phantom'}
        </button>
      )}
    </div>
  );
}


