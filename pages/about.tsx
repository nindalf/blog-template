
import styles from '../components/layout.module.css'
import utilStyles from '../styles/utils.module.css'
import config from '../blog-config.json'

export default function About() {
    return  <>
      <img
        src="/images/profile.jpg"
        className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
        alt={config.author}
      />
      <h1 className={utilStyles.heading2Xl}>{config.author}</h1>
      <p>{config.bio}</p>
    </>
}
