import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component (Test Unitaire)', () => {
  it('doit afficher le texte passé en enfant', () => {
    render(<Badge>Terminé</Badge>);
    expect(screen.getByText('Terminé')).toBeInTheDocument();
  });

  it('doit appliquer la classe de variante par défaut (neutral)', () => {
    render(<Badge>En cours</Badge>);
    const badgeElement = screen.getByText('En cours');
    expect(badgeElement.className).toContain('bg-[#F4F2EC]');
    expect(badgeElement.className).toContain('text-stone-700');
  });

  it('doit appliquer les styles de la variante success', () => {
    render(<Badge variant="success">Succès</Badge>);
    const badgeElement = screen.getByText('Succès');
    expect(badgeElement.className).toContain('bg-[#EAF3EB]');
    expect(badgeElement.className).toContain('text-[#2D5A3C]');
  });

  it('doit afficher l\'icône lorsqu\'elle est fournie', () => {
    render(
      <Badge icon={<span data-testid="test-icon">★</span>}>
        Avec icône
      </Badge>
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Avec icône')).toBeInTheDocument();
  });

  it('doit fusionner une classe personnalisée passée en prop', () => {
    render(<Badge className="custom-test-class">Custom</Badge>);
    const badgeElement = screen.getByText('Custom');
    expect(badgeElement.className).toContain('custom-test-class');
  });
});
