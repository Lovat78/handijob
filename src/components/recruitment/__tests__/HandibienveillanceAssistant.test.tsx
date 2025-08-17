// src/components/recruitment/__tests__/HandibienveillanceAssistant.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HandibienveillanceAssistant } from '../HandibienveillanceAssistant';

// Mock hooks
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn()
    }
  })
}));

describe('HandibienveillanceAssistant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render main interface', () => {
    render(<HandibienveillanceAssistant />);
    
    expect(screen.getByText('Assistant IA Handibienveillance')).toBeInTheDocument();
    expect(screen.getByText('Analysez et optimisez vos offres d\'emploi pour une inclusion parfaite')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Collez ici le contenu/)).toBeInTheDocument();
  });

  it('should show analyze button disabled when no content', () => {
    render(<HandibienveillanceAssistant />);
    
    const analyzeButton = screen.getByText('Analyser l\'handibienveillance');
    expect(analyzeButton).toBeDisabled();
  });

  it('should enable analyze button when content is entered', () => {
    render(<HandibienveillanceAssistant />);
    
    const textarea = screen.getByPlaceholderText(/Collez ici le contenu/);
    fireEvent.change(textarea, { target: { value: 'Test job offer content' } });
    
    const analyzeButton = screen.getByText('Analyser l\'handibienveillance');
    expect(analyzeButton).not.toBeDisabled();
  });

  it('should show loading state during analysis', async () => {
    render(<HandibienveillanceAssistant />);
    
    const textarea = screen.getByPlaceholderText(/Collez ici le contenu/);
    fireEvent.change(textarea, { target: { value: 'Test job offer content' } });
    
    const analyzeButton = screen.getByText('Analyser l\'handibienveillance');
    fireEvent.click(analyzeButton);
    
    expect(screen.getByText('Analyse en cours...')).toBeInTheDocument();
    expect(screen.getByText('Analyse en cours...').parentElement).toBeDisabled();
  });

  it('should display analysis results after completion', async () => {
    render(<HandibienveillanceAssistant />);
    
    const textarea = screen.getByPlaceholderText(/Collez ici le contenu/);
    fireEvent.change(textarea, { target: { value: 'Test job offer content' } });
    
    const analyzeButton = screen.getByText('Analyser l\'handibienveillance');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Score Handibienveillance')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText('72/100')).toBeInTheDocument();
    expect(screen.getByText('Conformité AA')).toBeInTheDocument();
  });

  it('should apply suggestion and update score', async () => {
    render(<HandibienveillanceAssistant />);
    
    const textarea = screen.getByPlaceholderText(/Collez ici le contenu/);
    fireEvent.change(textarea, { target: { value: 'Nous recherchons un développeur senior dynamique' } });
    
    const analyzeButton = screen.getByText('Analyser l\'handibienveillance');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Score Handibienveillance')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Click suggestions tab
    const suggestionsTab = screen.getByText(/Suggestions/);
    fireEvent.click(suggestionsTab);
    
    // Apply first suggestion
    const applyButtons = screen.getAllByText('Appliquer cette suggestion');
    fireEvent.click(applyButtons[0]);
    
    // Score should be updated (72 + 15 = 87)
    await waitFor(() => {
      expect(screen.getByText('87/100')).toBeInTheDocument();
    });
  });

  it('should display rewritten content in optimized version', async () => {
    render(<HandibienveillanceAssistant />);
    
    const textarea = screen.getByPlaceholderText(/Collez ici le contenu/);
    fireEvent.change(textarea, { target: { value: 'Test content' } });
    
    const analyzeButton = screen.getByText('Analyser l\'handibienveillance');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Score Handibienveillance')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    const rewriteTab = screen.getByText('Version optimisée');
    fireEvent.click(rewriteTab);
    
    expect(screen.getByText(/Développeur\/se Full Stack - CDI/)).toBeInTheDocument();
    expect(screen.getByText('Version handibienveillante validée !')).toBeInTheDocument();
  });
});

export {};