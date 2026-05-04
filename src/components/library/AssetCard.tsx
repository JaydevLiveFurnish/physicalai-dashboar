import { useState } from 'react'
import { useInView } from '@/lib/useInView'
import type { Asset } from '@/components/library/AssetDetailModal'
import { AssetCardLockOverlay } from '@/components/assets/AssetCardLockOverlay'
import styles from './AssetCard.module.css'

export default function AssetCard({
  asset,
  index,
  onSelect,
}: {
  asset: Asset
  index: number
  onSelect: (a: Asset) => void
}) {
  const { ref, isInView } = useInView()
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div
      ref={ref}
      className={`${styles.assetCard} ${isInView ? styles.assetCardVisible : ''}`}
      style={{ transitionDelay: `${0.03 + (index % 10) * 0.04}s` }}
      onClick={() => onSelect(asset)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(asset) } }}
      aria-label={`View ${asset.name} details`}
    >
      <div className={styles.cardThumb}>
        {asset.articulated && (
          <span className={styles.cardTypeBadge}>Articulated</span>
        )}
        {!imgFailed ? (
          <img
            src={asset.thumbnail}
            alt={`${asset.name} - SimReady 3D model for robotics simulation`}
            className={styles.cardThumbImg}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className={styles.cardThumbPlaceholder}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
        )}
        {asset.isLocked && <AssetCardLockOverlay />}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardName}>{asset.name}</div>
        <div className={styles.cardCategory}>{asset.category}</div>
      </div>
    </div>
  )
}
