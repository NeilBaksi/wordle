import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Tile } from '../components/Tile';

describe('Tile', () => {
  it('renders empty tile with no letter', () => {
    render(<Tile letter="" state="empty" frontState="empty" isRevealed={false} col={0} bounce={false} />);
    const front = document.querySelector('.tile-front');
    expect(front).toHaveAttribute('aria-label', 'empty');
  });

  it('renders letter in uppercase', () => {
    render(<Tile letter="c" state="empty" frontState="active" isRevealed={false} col={0} bounce={false} />);
    expect(document.querySelector('.tile-front')).toHaveTextContent('C');
    expect(document.querySelector('.tile-back')).toHaveTextContent('C');
  });

  it('applies data-revealed when isRevealed is true', () => {
    render(<Tile letter="c" state="correct" frontState="empty" isRevealed={true} col={2} bounce={false} />);
    const tile = document.querySelector('.tile');
    expect(tile).toHaveAttribute('data-revealed');
  });

  it('does not apply data-revealed when isRevealed is false', () => {
    render(<Tile letter="c" state="empty" frontState="active" isRevealed={false} col={0} bounce={false} />);
    const tile = document.querySelector('.tile');
    expect(tile).not.toHaveAttribute('data-revealed');
  });

  it('applies correct data-state to tile-back', () => {
    render(<Tile letter="a" state="correct" frontState="empty" isRevealed={true} col={0} bounce={false} />);
    expect(document.querySelector('.tile-back')).toHaveAttribute('data-state', 'correct');
  });

  it('applies present data-state to tile-back', () => {
    render(<Tile letter="b" state="present" frontState="empty" isRevealed={true} col={1} bounce={false} />);
    expect(document.querySelector('.tile-back')).toHaveAttribute('data-state', 'present');
  });

  it('applies active data-state to tile-front when typed', () => {
    render(<Tile letter="x" state="empty" frontState="active" isRevealed={false} col={0} bounce={false} />);
    expect(document.querySelector('.tile-front')).toHaveAttribute('data-state', 'active');
  });

  it('sets --col CSS custom property for stagger', () => {
    render(<Tile letter="a" state="correct" frontState="empty" isRevealed={true} col={3} bounce={false} />);
    const tile = document.querySelector('.tile') as HTMLElement;
    expect(tile.style.getPropertyValue('--col')).toBe('3');
  });

  it('applies data-bounce when bounce is true', () => {
    render(<Tile letter="a" state="correct" frontState="empty" isRevealed={true} col={0} bounce={true} />);
    const tile = document.querySelector('.tile');
    expect(tile).toHaveAttribute('data-bounce');
  });
});
