import utilStyles from '../styles/utils.module.css'
import config from '../blog-config.json'
import head from '../components/head'

export default function About() {
    return  <>
      {head(null)}
      <img
        src={config.imageUrl}
        className={`${utilStyles.aboutImage} ${utilStyles.borderCircle}`}
        alt={config.author}
      />
      <h1>{config.author}</h1>
      <p>{config.bio}</p>
    </>
}
