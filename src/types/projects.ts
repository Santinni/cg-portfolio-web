export interface ProjectType {
  id: number
  title: string
  description: string
  image: {
    id: number
    url: string
  }
  link: string
  technologies: {
    technology: string
  }[]
} 