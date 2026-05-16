import { demoBlogs, demoContacts, demoMaterials, demoMovies, demoProjects } from '../data/demo'
import { useCollection } from './useCollection'
import type { Blog, ContactSubmission, Material, Movie, Project } from '../types'

export const useProjects = () =>
  useCollection<Project>({ table: 'projects', demoData: demoProjects })

export const useMaterials = () =>
  useCollection<Material>({ table: 'materials', demoData: demoMaterials })

export const useMovies = () =>
  useCollection<Movie>({ table: 'movies', demoData: demoMovies })

export const useBlogs = () =>
  useCollection<Blog>({ table: 'blogs', demoData: demoBlogs })

export const useContacts = () =>
  useCollection<ContactSubmission>({
    table: 'contact_submissions',
    demoData: demoContacts
  })