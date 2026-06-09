'use client';

import { useState } from 'react';
import { MdWifi, MdContentCopy, MdCheck } from 'react-icons/md';

interface WifiCardProps {
  network: string;
  password: string;
}

export function WifiCard({ network, password }: WifiCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-surface border border-border rounded-[--radius-lg] p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-9 h-9 bg-primary-light rounded-[--radius-md] text-primary">
          <MdWifi size={20} />
        </div>
        <span className="text-sm font-semibold text-text-heading">WiFi</span>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-text-muted mb-0.5">Rede</p>
          <p className="text-sm font-medium text-text-body">{network}</p>
        </div>

        <div>
          <p className="text-xs text-text-muted mb-0.5">Senha</p>
          <div className="flex items-center justify-between gap-2 bg-surface-secondary rounded-[--radius-md] px-3 py-2">
            <span className="text-sm font-mono font-medium text-text-heading tracking-wide">
              {password}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition-colors cursor-pointer"
              aria-label="Copiar senha"
            >
              {copied ? (
                <>
                  <MdCheck size={15} />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <MdContentCopy size={15} />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
