import GraphQLJSON from 'graphql-type-json'
import { GraphQLUpload } from 'graphql-upload'

import {
  titre,
  titres,
  titreCreer,
  titreSupprimer,
  titreModifier
} from './resolvers/titres'

import {
  etapeCreer,
  etapeModifier,
  etapeSupprimer
} from './resolvers/titres-etapes'

import {
  documentCreer,
  documentModifier,
  documentSupprimer
} from './resolvers/titres-documents'

import {
  demarches,
  demarcheCreer,
  demarcheModifier,
  demarcheSupprimer
} from './resolvers/titres-demarches'

import {
  utilisateur,
  utilisateurs,
  moi,
  utilisateurTokenCreer,
  utilisateurCerbereTokenCreer,
  utilisateurCerbereUrlObtenir,
  utilisateurCreer,
  utilisateurCreationEmailEnvoyer,
  utilisateurModifier,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseEmailEnvoyer,
  utilisateurMotDePasseInitialiser
} from './resolvers/utilisateurs'

import {
  devises,
  demarchesTypes,
  demarchesStatuts,
  documentsTypes,
  domaines,
  etapesTypes,
  geoSystemes,
  permission,
  permissions,
  referencesTypes,
  statuts,
  types,
  unites,
  version,
  activitesTypes
} from './resolvers/metas'

import { substance, substances } from './resolvers/substances'
import {
  entreprise,
  entreprises,
  entrepriseCreer,
  entrepriseModifier
} from './resolvers/entreprises'
import { administration, administrations } from './resolvers/administrations'
import {
  activite,
  activites,
  activiteModifier
} from './resolvers/titres-activites'
import { statistiques } from './resolvers/statistiques'

export default {
  //  types
  Json: GraphQLJSON,
  FileUpload: GraphQLUpload,

  //  queries
  demarches,
  demarchesTypes,
  demarchesStatuts,
  etapesTypes,
  devises,
  documentsTypes,
  domaines,
  geoSystemes,
  permission,
  permissions,
  referencesTypes,
  statuts,
  types,
  unites,
  version,
  titre,
  titres,
  substance,
  substances,
  moi,
  entreprise,
  entreprises,
  administration,
  administrations,
  utilisateur,
  utilisateurs,
  statistiques,
  activite,
  activites,
  activitesTypes,

  // mutations
  titreCreer,
  titreModifier,
  titreSupprimer,
  demarcheCreer,
  demarcheModifier,
  demarcheSupprimer,
  etapeCreer,
  etapeModifier,
  etapeSupprimer,
  documentCreer,
  documentModifier,
  documentSupprimer,
  activiteModifier,
  utilisateurTokenCreer,
  utilisateurCerbereTokenCreer,
  utilisateurCerbereUrlObtenir,
  utilisateurModifier,
  utilisateurCreer,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseInitialiser,
  utilisateurMotDePasseEmailEnvoyer,
  utilisateurCreationEmailEnvoyer,
  entrepriseCreer,
  entrepriseModifier
}
