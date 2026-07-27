import { Container } from '@/app/(frontend)/components/layout/Container'
import { EditorialState } from '@/components/article'

import styles from './InsightsPage.module.css'

export default function InsightsLoading() {
	return (
		<div className={styles.content}>
			<Container>
				<EditorialState kind="loading" />
			</Container>
		</div>
	)
}
