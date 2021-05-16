import React from 'react';
import { StoryListItem } from '..';
import head from '../../components/head';
import Layout from '../../components/layout';
import { store } from '../../lib/content-store'
import styles from '../../styles/utils.module.css'

export default function HomeByTag({ nodes }) {
    return (
        <Layout home>
            {head(null)}
            <section className={`${styles.headingMd}`}>
                <ul className={styles.list}>
                    {nodes.map(node => StoryListItem(node))}
                </ul>
            </section>
        </Layout>
    )
}


export async function getStaticPaths() {
    const paths = store.getAllTags().map(tag => {
        return {
            params: {
                tag: tag
            }
        };
    });
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const nodes = store.getNodesByTag(params.tag)
    return {
        props: {
            nodes
        }
    }
}
