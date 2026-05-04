import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import GLBViewer from './GLBViewer'
import AssetComponentBreakdown from './AssetComponentBreakdown'
import styles from './AssetDetailModal.module.css'

interface AssetPhysics {
  staticFriction: number
  dynamicFriction: number
  restitution: number
  density: number
  collision: string
}

interface AssetDimensions {
  width: number
  height: number
  depth: number
  unit: string
}

export interface PartMaterial {
  name: string | null
  static_friction: number | null
  dynamic_friction: number | null
  restitution: number | null
  density: number | null
}

export interface PartMass {
  total_kg: number | null
  min_kg: number | null
  max_kg: number | null
  single_kg: number | null
}

export interface PartGroup {
  label: string
  count: number
  material: PartMaterial
  mass: PartMass
  collider_types: string[]
}

export interface PhysicsData {
  dimensions: { width_m: number; height_m: number; depth_m: number }
  overall_mass_kg: number
  part_count: number
  parts: PartGroup[]
}

export interface Asset {
  id: string
  name: string
  category: string
  type: string
  material: string
  dimensions: AssetDimensions
  mass: number
  physics: AssetPhysics
  thumbnail: string
  glbPath: string
  usdPath: string
  simreadyStatus: 'certified' | 'pending'
  articulated?: boolean
  displayOrder?: number
  license?: {
    name: string
    type: string
    url: string
  }
  physicsData?: PhysicsData
}

interface AssetDetailModalProps {
  asset: Asset | null
  onClose: () => void
  triggerRef?: React.RefObject<HTMLElement | null>
}

type DownloadType = 'usd' | 'glb' | 'metadata'

export default function AssetDetailModal({ asset, onClose, triggerRef }: AssetDetailModalProps) {
  const [confirmationMsg, setConfirmationMsg] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!asset) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [asset, onClose])

  useEffect(() => {
    if (asset) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => closeBtnRef.current?.focus())
    } else {
      document.body.style.overflow = ''
      triggerRef?.current?.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [asset, triggerRef])

  useEffect(() => {
    if (!asset || !modalRef.current) return
    const modal = modalRef.current
    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', handleTab)
    return () => window.removeEventListener('keydown', handleTab)
  }, [asset])

  useEffect(() => {
    setConfirmationMsg('')
  }, [asset?.id])

  const fireDownloadEvent = useCallback((assetData: Asset, dlType: DownloadType) => {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'asset_download', {
          asset_name: assetData.name,
          asset_category: assetData.category,
          asset_id: assetData.id,
          download_type: dlType,
        })
      }
    } catch (err) {
      console.warn('GA4 download event failed:', err)
    }
  }, [])

  const handleDownloadClick = useCallback(async (dlType: DownloadType) => {
    if (!asset) return

    fireDownloadEvent(asset, dlType)

    const url = dlType === 'usd' ? asset.usdPath : dlType === 'glb' ? asset.glbPath : null

    if (url && url.startsWith('http')) {
      setConfirmationMsg('Downloading...')
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Download failed')
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = url.split('/').pop()?.replace(/%20/g, ' ') || `${asset.id}.${dlType}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(blobUrl)
        setConfirmationMsg('Download complete')
        setTimeout(() => setConfirmationMsg(''), 3000)
      } catch {
        setConfirmationMsg('Download failed. Please try again.')
        setTimeout(() => setConfirmationMsg(''), 5000)
      }
    } else {
      setConfirmationMsg('Your download link will be sent to your email')
      setTimeout(() => setConfirmationMsg(''), 5000)
    }
  }, [asset, fireDownloadEvent])

  if (!asset) return null

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div ref={modalRef} className={styles.modal} role="dialog" aria-modal="true" aria-label={`${asset.name} details`}>
        <button
          ref={closeBtnRef}
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          &#x2715;
        </button>

        {/* Left: 3D Viewer */}
        <div className={styles.viewerPane}>
          <GLBViewer
            glbPath={asset.glbPath}
            fallbackImage={asset.thumbnail}
            className={styles.viewer}
          />
          <div className={styles.viewerHint}>Drag to orbit, scroll to zoom</div>
        </div>

        {/* Right: Details */}
        <div className={styles.detailsPane}>
          <div className={styles.detailsScroll}>
            <h2 className={styles.assetName}>{asset.name}</h2>

            {/* Tier 1: Summary strip */}
            <SummaryStrip asset={asset} />

            {/* Tier 2: Component breakdown accordion */}
            {asset.physicsData && asset.physicsData.parts.length > 0 && (
              <AssetComponentBreakdown
                assetId={asset.id}
                assetName={asset.name}
                assetCategory={asset.category}
                parts={asset.physicsData.parts}
                partCount={asset.physicsData.part_count}
              />
            )}
          </div>

          <div className={styles.downloadSection}>
            {confirmationMsg && (
              <div className={styles.confirmationMsg}>{confirmationMsg}</div>
            )}
            <button
              type="button"
              className={`${styles.downloadBtn} ${styles.downloadBtnPrimary}`}
              onClick={() => handleDownloadClick('usd')}
            >
              Download USD
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}

function formatMass(kg: number): string {
  if (kg >= 10) return `${kg} kg`
  return `${kg} kg`
}

function SummaryStrip({ asset }: { asset: Asset }) {
  const pd = asset.physicsData
  const dims = pd?.dimensions
  const [showAllMats, setShowAllMats] = useState(false)

  // Collect unique materials across all part groups
  const uniqueMaterials: { name: string; mat: PartMaterial }[] = []
  const seenNames = new Set<string>()
  if (pd) {
    for (const g of pd.parts) {
      const matName = g.material.name || 'Unknown'
      if (!seenNames.has(matName)) {
        seenNames.add(matName)
        uniqueMaterials.push({ name: matName, mat: g.material })
      }
    }
  }

  const MAX_CHIPS = 4
  const visibleMats = showAllMats ? uniqueMaterials : uniqueMaterials.slice(0, MAX_CHIPS)
  const hiddenCount = uniqueMaterials.length - MAX_CHIPS

  return (
    <div className={styles.summaryStrip}>
      {/* Row 1: Key specs */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryStat}>
          <span className={styles.summaryLabel}>Dimensions</span>
          <span className={styles.summaryValue}>
            {dims
              ? `${dims.width_m} × ${dims.depth_m} × ${dims.height_m} m`
              : `${asset.dimensions.width} × ${asset.dimensions.depth} × ${asset.dimensions.height} ${asset.dimensions.unit}`}
          </span>
        </div>
        <div className={styles.summaryStat}>
          <span className={styles.summaryLabel}>Mass</span>
          <span className={styles.summaryValue}>
            {pd ? formatMass(pd.overall_mass_kg) : `${asset.mass} kg`}
          </span>
        </div>
        <div className={styles.summaryStat}>
          <span className={styles.summaryLabel}>Components</span>
          <span className={styles.summaryValue}>
            {pd ? `${pd.part_count} part${pd.part_count !== 1 ? 's' : ''}` : '—'}
          </span>
        </div>
        {asset.license && (
          <div className={styles.summaryStat}>
            <span className={styles.summaryLabel}>License</span>
            <span className={styles.summaryValueLicense}>
              <a
                href={asset.license.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.licenseLink}
              >
                {asset.license.name}
              </a>
              <LicenseTooltip />
            </span>
          </div>
        )}
      </div>

      {/* Row 2: Material chips */}
      {uniqueMaterials.length > 0 && (
        <div className={styles.materialChips}>
          {visibleMats.map(({ name, mat }) => (
            <MaterialChip key={name} name={name} material={mat} />
          ))}
          {!showAllMats && hiddenCount > 0 && (
            <button
              type="button"
              className={styles.materialChipMore}
              onClick={() => setShowAllMats(true)}
            >
              +{hiddenCount} more
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function MaterialChip({ name, material }: { name: string; material: PartMaterial }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const handleMouseEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 200)
  }, [])

  const hasProps = material.static_friction != null || material.dynamic_friction != null
    || material.restitution != null || material.density != null

  return (
    <span
      ref={wrapRef}
      className={styles.materialChipWrap}
      onMouseEnter={hasProps ? handleMouseEnter : undefined}
      onMouseLeave={hasProps ? handleMouseLeave : undefined}
    >
      <button
        type="button"
        className={styles.materialChip}
        onClick={hasProps ? () => setOpen(prev => !prev) : undefined}
        aria-expanded={hasProps ? open : undefined}
      >
        {name}
      </button>
      {open && hasProps && (
        <span className={styles.materialTooltip} role="tooltip">
          {material.static_friction != null && (
            <span className={styles.matTooltipRow}>
              <span>&#956;_static</span><span>{material.static_friction}</span>
            </span>
          )}
          {material.dynamic_friction != null && (
            <span className={styles.matTooltipRow}>
              <span>&#956;_dynamic</span><span>{material.dynamic_friction}</span>
            </span>
          )}
          {material.restitution != null && (
            <span className={styles.matTooltipRow}>
              <span>restitution</span><span>{material.restitution}</span>
            </span>
          )}
          {material.density != null && (
            <span className={styles.matTooltipRow}>
              <span>density</span><span>{material.density} kg/m&#xB3;</span>
            </span>
          )}
        </span>
      )}
    </span>
  )
}

function LicenseTooltip() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const handleMouseEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 200)
  }, [])

  return (
    <span
      ref={wrapRef}
      className={styles.tooltipWrap}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={styles.tooltipTrigger}
        onClick={() => setOpen(prev => !prev)}
        aria-label="License information"
        aria-expanded={open}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </button>
      {open && (
        <span className={styles.tooltip} role="tooltip">
          Free for research, evaluation, and academic use. Commercial use
          including robot training for production systems requires a separate
          license.{' '}
          <Link to="/contact" className={styles.tooltipLink}>Talk to us</Link>{' '}
          for commercial licensing.
        </span>
      )}
    </span>
  )
}
