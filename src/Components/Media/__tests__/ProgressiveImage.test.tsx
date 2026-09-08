import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressiveImage } from '../ProgressiveImage';

describe('ProgressiveImage Component', () => {
  it('renders loading skeleton initially and reveals image on load', () => {
    render(<ProgressiveImage src="https://example.com/nebula.jpg" alt="Nebula" />);

    expect(screen.getByText(/cargando medio astronómico/i)).toBeTruthy();

    const img = screen.getByAltText('Nebula');
    expect(img.className).toContain('opacity-0');

    fireEvent.load(img);
    expect(img.className).toContain('opacity-100');
    expect(screen.queryByText(/cargando medio astronómico/i)).toBeNull();
  });

  it('displays error recovery ui on image error', () => {
    render(<ProgressiveImage src="https://example.com/broken.jpg" alt="Broken" />);

    const img = screen.getByAltText('Broken');
    fireEvent.error(img);

    expect(screen.getByText(/no se pudo cargar la imagen astronómica/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /reintentar carga/i })).toBeTruthy();
  });

  it('resets state when src prop changes', () => {
    const { rerender } = render(
      <ProgressiveImage src="https://example.com/image1.jpg" alt="Image 1" />
    );

    const img1 = screen.getByAltText('Image 1');
    fireEvent.load(img1);
    expect(screen.queryByText(/cargando medio astronómico/i)).toBeNull();

    // Rerender con nuevo src
    rerender(<ProgressiveImage src="https://example.com/image2.jpg" alt="Image 2" />);

    // El skeleton debe reaparecer
    expect(screen.getByText(/cargando medio astronómico/i)).toBeTruthy();
  });
});
