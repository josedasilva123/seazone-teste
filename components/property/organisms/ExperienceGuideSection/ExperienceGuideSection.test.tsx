import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ExperienceGuideSection } from '.';

const mockGuideGenerated = {
  id: 'guide-1',
  welcomeMessage: 'Bem-vindo ao apartamento em Florianópolis!',
  seasonalTips: 'No inverno, aproveite os restaurantes de frutos do mar.',
  aiGeneratedAt: new Date().toISOString(),
  places: [
    {
      id: 'p1',
      name: 'Box 32',
      category: 'restaurant',
      placeType: null,
      distance: 'Aprox. 1,2 km',
      description: 'Famoso pelos petiscos e chopes gelados.',
    },
    {
      id: 'p2',
      name: 'Praia da Joaquina',
      category: 'attraction',
      placeType: null,
      distance: 'Aprox. 18 km',
      description: 'Famosa pelas dunas e ondas para surf.',
    },
    {
      id: 'p3',
      name: 'Farmácia Catarinense',
      category: 'essential',
      placeType: 'pharmacy',
      distance: 'Aprox. 300m',
      description: 'Farmácia 24h.',
    },
  ],
};

const mockGuidePending = {
  ...mockGuideGenerated,
  aiGeneratedAt: null,
};

describe('ExperienceGuideSection', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exibe estado de carregamento inicialmente', () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));
    render(<ExperienceGuideSection code="FLN001" />);
    expect(screen.getByText(/Guia de Experiências/i)).toBeInTheDocument();
  });

  it('exibe mensagem de boas-vindas após carregar guia gerado', async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({ ok: true, data: mockGuideGenerated }),
    } as Response);

    render(<ExperienceGuideSection code="FLN001" />);

    await waitFor(() => {
      expect(screen.getByText(/Bem-vindo ao apartamento em Florianópolis!/)).toBeInTheDocument();
    });
  });

  it('exibe dica sazonal quando disponível', async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({ ok: true, data: mockGuideGenerated }),
    } as Response);

    render(<ExperienceGuideSection code="FLN001" />);

    await waitFor(() => {
      expect(screen.getByText(/Dica da temporada/i)).toBeInTheDocument();
      expect(screen.getByText(/frutos do mar/)).toBeInTheDocument();
    });
  });

  it('exibe restaurantes com nome e distância', async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({ ok: true, data: mockGuideGenerated }),
    } as Response);

    render(<ExperienceGuideSection code="FLN001" />);

    await waitFor(() => {
      expect(screen.getByText('Box 32')).toBeInTheDocument();
      expect(screen.getByText('Aprox. 1,2 km')).toBeInTheDocument();
    });
  });

  it('exibe atrações próximas', async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({ ok: true, data: mockGuideGenerated }),
    } as Response);

    render(<ExperienceGuideSection code="FLN001" />);

    await waitFor(() => {
      expect(screen.getByText('Praia da Joaquina')).toBeInTheDocument();
    });
  });

  it('exibe serviços essenciais', async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({ ok: true, data: mockGuideGenerated }),
    } as Response);

    render(<ExperienceGuideSection code="FLN001" />);

    await waitFor(() => {
      expect(screen.getByText('Farmácia Catarinense')).toBeInTheDocument();
    });
  });

  it('exibe feedback de geração em progresso quando guia não foi gerado', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        json: async () => ({ ok: true, data: mockGuidePending }),
      } as Response)
      .mockReturnValue(new Promise(() => {}));

    render(<ExperienceGuideSection code="FLN001" />);

    await waitFor(() => {
      expect(screen.getByText(/Gerando guia personalizado/i)).toBeInTheDocument();
    });
  });

  it('exibe mensagem de erro quando a API falha', async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({ ok: false, error: 'Chave de API inválida' }),
    } as Response);

    render(<ExperienceGuideSection code="FLN001" />);

    await waitFor(() => {
      expect(screen.getByText(/Chave de API inválida/)).toBeInTheDocument();
    });
  });
});
