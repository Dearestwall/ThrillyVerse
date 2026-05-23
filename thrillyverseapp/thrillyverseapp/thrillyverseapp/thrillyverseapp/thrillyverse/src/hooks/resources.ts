import { demoBlogs, demoContacts, demoMaterials, demoMovies, demoProjects } from '../data/demo'
import { useCollection } from './useCollection'
import type { Blog, ContactSubmission, Material, Movie, Project } from '../types'

export const useProjects = () => useCollection<Project>('projects', demoProjects)
export const useMaterials = () => useCollection<Material>('materials', demoMaterials)
export const useMovies = () => useCollection<Movie>('movies', demoMovies)
export const useBlogs = () => useCollection<Blog>('blogs', demoBlogs)
export const useContacts = () => useCollection<ContactSubmission>('contact_submissions', demoContacts)