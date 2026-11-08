import Button from '../components/Button'
import { PageHero } from '../components/shared'
import { usePageMeta } from '../components/usePageMeta'

export default function NotFound() {
  usePageMeta('Page not found', 'The page you are looking for could not be found.')
  return (
    <>
      <PageHero eyebrow="404" title="This box is empty." text="The page you’re looking for doesn’t exist or has moved.">
        <Button to="/" variant="gold">
          Back to Home
        </Button>
      </PageHero>
      <div className="h-24" />
    </>
  )
}
