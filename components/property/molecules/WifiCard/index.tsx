'use client';

import { useState } from 'react';
import { MdWifi, MdContentCopy, MdCheck } from 'react-icons/md';
import { Button, Card } from '@/components/shared/atoms';
import { CardHeader, DataField } from '@/components/shared/molecules';

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
    <Card>
      <CardHeader icon={<MdWifi size={20} />} title="WiFi" />

      <div className="space-y-2">
        <DataField label="Rede" value={network} />
        <DataField
          label="Senha"
          value={password}
          mono
          boxed
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              aria-label="Copiar senha"
              className="text-primary hover:text-primary-hover px-0 py-0 h-auto min-h-0"
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
            </Button>
          }
        />
      </div>
    </Card>
  );
}
