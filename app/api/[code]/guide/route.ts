import { NextResponse } from 'next/server';
import { GuideService } from '@/lib/services/guide';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  try {
    const guide = await GuideService.getOrGenerate(code.toUpperCase());
    return NextResponse.json({ ok: true, data: guide });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao gerar guia';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
