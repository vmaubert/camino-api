// ajoute les champs nécessaire pour requêter le sous-objet titre

import { IFields } from '../../types'

// pour vérifier si l'utilisateur a les droits sur les titres
const fieldTitreAdd = (fields: IFields) => {
  if (!fields.titre) {
    fields.titre = {
      id: {},
      nom: {}
    }
  }

  if (!fields.titre.type) {
    fields.titre.type = { id: {}, type: { nom: {} } }
  }

  if (!fields.titre.domaine) {
    fields.titre.domaine = { id: {}, nom: {} }
  }

  if (!fields.titre.statut) {
    fields.titre.statut = { id: {}, nom: {} }
  }

  if (!fields.titre.titulaires) {
    fields.titre.titulaires = {}
  }

  if (!fields.titre.amodiataires) {
    fields.titre.amodiataires = {}
  }

  return fields
}

const stringSplit = (string: string) =>
  (string.match(/[\w-/]+|"(?:\\"|[^"])+"/g) || []).map(e =>
    e.replace(/^"(.*)"$/, '$1')
  )

const emailsSplit = (string: string) =>
  string.match(/\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+/g) || []

export { fieldTitreAdd, stringSplit, emailsSplit }
