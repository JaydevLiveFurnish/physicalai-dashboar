/**
 * AssetComponentBreakdown — collapsible per-part physics table.
 *
 * Tested against these assets to validate grouping across complexity range:
 * - Baking Tray (1 part → 1 group, single_kg)
 * - Base Cabinet Double Door (3 parts → 2 groups: cabinet base + 2× door)
 * - Oven (9 parts → 4 groups: base, 4× button, door, 3× grill)
 * - Bowl With Apples (17 parts → 2 groups: 16× apple + 1 bowl)
 * - Fork (1 part → 1 group, single_kg, null material)
 * - Refrigerator (13 parts → 8 groups after material normalization)
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { PartGroup } from './AssetDetailModal'
import styles from './AssetComponentBreakdown.module.css'

const MAX_INITIAL_ROWS = 6

interface Props {
  assetId: string
  assetName: string
  assetCategory: string
  parts: PartGroup[]
  partCount: number
}

function formatGroupMass(group: PartGroup): string {
  if (group.count === 1) {
    const kg = group.mass.single_kg
    return kg != null ? `${kg} kg` : '—'
  }
  const total = group.mass.total_kg
  const min = group.mass.min_kg
  const max = group.mass.max_kg
  if (total == null) return '—'
  if (min != null && max != null && min !== max) {
    return `${total} kg (${min}–${max} ea)`
  }
  if (min != null && min === max) {
    return `${total} kg (${group.count}× ${min})`
  }
  return `${total} kg`
}

function getGroupMassTotal(g: PartGroup): number {
  if (g.count === 1) return g.mass.single_kg ?? 0
  return g.mass.total_kg ?? 0
}

function PartRow({ g, showCollider }: { g: PartGroup; showCollider: boolean }) {
  return (
    <tr className={styles.row}>
      <td className={styles.tdComponent}>
        {g.label}{g.count > 1 ? ` ×${g.count}` : ''}
      </td>
      <td className={styles.tdMaterial}>{g.material.name || '—'}</td>
      <td className={styles.tdNum}>{formatGroupMass(g)}</td>
      {showCollider && (
        <td className={styles.tdCollider}>
          {g.collider_types.length > 0 ? g.collider_types.join(', ') : '—'}
        </td>
      )}
    </tr>
  )
}

function PartCard({ g, showCollider }: { g: PartGroup; showCollider: boolean }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        {g.label}{g.count > 1 ? ` ×${g.count}` : ''}
      </div>
      <div className={styles.cardGrid}>
        <span className={styles.cardLabel}>Material</span>
        <span className={styles.cardValue}>{g.material.name || '—'}</span>
        <span className={styles.cardLabel}>Mass</span>
        <span className={styles.cardValue}>{formatGroupMass(g)}</span>
        {showCollider && (
          <>
            <span className={styles.cardLabel}>Collider</span>
            <span className={styles.cardValue}>
              {g.collider_types.length > 0 ? g.collider_types.join(', ') : '—'}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default function AssetComponentBreakdown({
  assetId,
  assetName,
  assetCategory,
  parts,
  partCount,
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const [showAll, setShowAll] = useState(false)

  // Auto-expand on desktop, stay collapsed on mobile
  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      setExpanded(true)
    }
  }, [])

  const hasCollider = useMemo(() =>
    parts.some(g => g.collider_types && g.collider_types.length > 0),
    [parts],
  )

  // Sort: by count DESC, then by total mass DESC
  const sortedParts = useMemo(() =>
    [...parts].sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return getGroupMassTotal(b) - getGroupMassTotal(a)
    }),
    [parts],
  )

  const needsCap = sortedParts.length > MAX_INITIAL_ROWS
  const visibleParts = showAll || !needsCap
    ? sortedParts
    : sortedParts.slice(0, MAX_INITIAL_ROWS)

  const handleToggle = useCallback(() => {
    const willExpand = !expanded
    setExpanded(willExpand)
    if (!willExpand) setShowAll(false)
    if (willExpand) {
      try {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'asset_inspect_components', {
            asset_id: assetId,
            asset_name: assetName,
            asset_category: assetCategory,
            part_count: partCount,
          })
        }
      } catch { /* never block UI */ }
    }
  }, [expanded, assetId, assetName, assetCategory, partCount])

  const handleShowAll = useCallback(() => {
    const willShowAll = !showAll
    setShowAll(willShowAll)
    if (willShowAll) {
      try {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'asset_inspect_full_components', {
            asset_id: assetId,
            asset_name: assetName,
            asset_category: assetCategory,
            total_parts: partCount,
          })
        }
      } catch { /* never block UI */ }
    }
  }, [showAll, assetId, assetName, assetCategory, partCount])

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.header}
        onClick={handleToggle}
        aria-expanded={expanded}
      >
        <span className={`${styles.arrow} ${expanded ? styles.arrowOpen : ''}`}>
          &#x25B6;
        </span>
        View component breakdown ({partCount} part{partCount !== 1 ? 's' : ''})
      </button>

      {expanded && (
        <>
          {/* Desktop: table */}
          <div className={styles.tableWrap}>
            <table className={`${styles.table} ${hasCollider ? '' : styles.threeCol}`}>
              <thead>
                <tr>
                  <th className={`${styles.thLeft} ${styles.colComponent}`}>Component</th>
                  <th className={`${styles.thLeft} ${styles.colMaterial}`}>Material</th>
                  <th className={`${styles.thRight} ${styles.colMass}`}>Mass</th>
                  {hasCollider && (
                    <th className={`${styles.thLeft} ${styles.colCollider}`}>Collider</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {visibleParts.map((g) => <PartRow key={g.label} g={g} showCollider={hasCollider} />)}
              </tbody>
            </table>
            {needsCap && (
              <button
                type="button"
                className={styles.showAllBtn}
                onClick={handleShowAll}
              >
                {showAll ? 'Show fewer' : `Show all ${sortedParts.length} components`}
              </button>
            )}
          </div>

          {/* Mobile: cards */}
          <div className={styles.cardList}>
            {visibleParts.map((g) => <PartCard key={g.label} g={g} showCollider={hasCollider} />)}
            {needsCap && (
              <button
                type="button"
                className={styles.showAllBtn}
                onClick={handleShowAll}
              >
                {showAll ? 'Show fewer' : `Show all ${sortedParts.length} components`}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
