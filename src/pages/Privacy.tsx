import { PageHero } from '../components/shared'
import { usePageMeta } from '../components/usePageMeta'
import { useCopy } from '../cms/CmsContext'

/** Text comes from the admin (Page text → Privacy & cookies). "## " starts a heading; a blank line starts a paragraph. */
export default function Privacy() {
  const t = useCopy()
  usePageMeta('Privacy', 'How Packup handles information you share with us.')
  // Line by line: a "## " line is a heading; text between blank lines is a paragraph (even right under a heading).
  const blocks: { h: boolean; text: string }[] = []
  let para: string[] = []
  const flush = () => {
    if (para.length) blocks.push({ h: false, text: para.join('\n') })
    para = []
  }
  for (const raw of t('privacy.body').split(/\r?\n/)) {
    const line = raw.trim()
    if (line.startsWith('## ')) {
      flush()
      blocks.push({ h: true, text: line.slice(3) })
    } else if (!line) flush()
    else para.push(line)
  }
  flush()
  return (
    <>
      <PageHero eyebrow="Legal" title={t('privacy.heroTitle')} text={t('privacy.heroText')} />
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <article className="mx-auto max-w-3xl">
            <p className="mb-10 text-[13px] text-charcoal/55">{t('privacy.updated')}</p>
            {blocks.map((b, i) =>
              b.h ? (
                <h2 key={i} className="mb-3 mt-10 font-display text-3xl first:mt-0">
                  {b.text}
                </h2>
              ) : (
                <p key={i} className="mb-4 whitespace-pre-line text-[16px] leading-relaxed text-charcoal/75">
                  {b.text}
                </p>
              ),
            )}
          </article>
        </div>
      </section>
    </>
  )
}
