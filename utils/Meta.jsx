import Head from 'next/head'
// or import Head from next/head for Next.js
import PropTypes from 'prop-types'

// const DOMAIN = "https://ostello.co.in"
const MAIN_KEYWORDS = 'my website, tech, software, content'

// const DEFAULT_IMAGE_CARD = "https://mywebsite.com/image-card"
const DEFAULT_TITLE =
  "Ostello | World's Largest Marketplace for Coaching Institutes"
const DEFAULT_DESCRIPTION =
  "Ostello is the World's first B2B marketplace for all coaching institutes,from Academics to JEE/NEET/Academics, we have it all. List your institute today amongst thousands of amazing institutes and go global"

// const FAVICON_SOURCE = "https://mywebsite.com/favicon.ico"

const POSTFIX_TITLE = ' - Ostello India'

function Meta({
  title,
  description,
  link,
  keywords,
  // imageCard,
  // largeTwitterCard = false,
  addPostfixTitle = false,
  noIndex = false,
  children = null,
}) {
  let metaTitle

  if (addPostfixTitle) {
    metaTitle = title + POSTFIX_TITLE
  } else {
    metaTitle = title
  }

  const metaDesc = description ?? DEFAULT_DESCRIPTION
  const metaLink = link

  const metaKeywords = keywords.length
    ? MAIN_KEYWORDS + ', ' + keywords
    : MAIN_KEYWORDS

  // let metaImageCard

  // if (imageCard) {
  //   if (imageCard.startsWith("https")) {
  //     metaImageCard = imageCard
  //   } else {
  //     metaImageCard = DOMAIN + imageCard
  //   }
  // } else {
  //   metaImageCard = DEFAULT_IMAGE_CARD
  // }

  const metaRobots = noIndex ? 'noindex, nofollow' : 'index, follow'

  // const twitterCardType = largeTwitterCard ? "summary_large_image" : "summary"

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name='description' content={metaDesc} />
      <link rel='canonical' href={metaLink} />
      <meta name='keywords' content={metaKeywords} />
      <meta name='robots' content={metaRobots} />
      {/* <link rel="icon" content={FAVICON_SOURCE} /> */}

      {/* OG Tags */}
      {/* https://ogp.me/ */}
      <meta property='og:url' title={metaLink} />
      <meta property='og:title' title={metaTitle} />
      <meta property='og:description' title={metaDesc} />
      <meta property='og:type' content='...' />
      {/* <meta property="og:image" content={metaImageCard} /> */}

      {/* Twitter tags */}
      {/* https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started */}
      <meta property='twitter:site' title='twitter username of website' />
      <meta property='twitter:title' title={metaTitle} />
      <meta property='twitter:description' title={metaDesc} />
      <meta
        property='twitter:creator'
        content='twitter username of webpage content'
      />
      {/* <meta property="twitter:card" content={twitterCardType} />
      <meta property="twitter:image" content={metaImageCard} /> */}

      {/* https://moz.com/blog/meta-referrer-tag */}
      <meta name='referrer' content='origin-when-crossorigin' />

      {children}
    </Head>
  )
}

Meta.defaultProps = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  // imageCard: DEFAULT_IMAGE_CARD,
  // largeTwitterCard: false,
  addPostfixTitle: false,
  noIndex: false,
  children: null,
  keywords: '',
}

Meta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  link: PropTypes.string.isRequired,
  keywords: PropTypes.string,
  // imageCard: PropTypes.string,
  // largeTwitterCard: PropTypes.bool,
  addPostfixTitle: PropTypes.bool,
  noIndex: PropTypes.bool,
  children: PropTypes.node,
}

export default Meta
